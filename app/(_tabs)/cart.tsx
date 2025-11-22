import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

const API_BASE_URL = 'http://192.168.1.52:3000';
const STRIPE_TEST_TOKEN = 'tok_visa';
const DUMMY_ORDER_ID = 1; // Usado para prueba de pago, no debe ser fijo en producción
const CUSTOMER_ID = 'user_test_mobile'; // Usado para crear la orden

export default function Carrito() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const { items, remove, checkout, add, clear } = useCart();
    const [modalVisible, setModalVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
    const [loadingPayment, setLoadingPayment] = useState(false);

    const eliminarProducto = (id: number | string) => {
        Alert.alert(
            'Eliminar producto',
            '¿Estás seguro de que deseas eliminar este producto del carrito?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => remove(id) }
            ]
        );
    };

    // FUNCIÓN PARA INCREMENTAR LA CANTIDAD
    const handleIncrement = (product) => {
        add({
            productId: product.productId,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1, // 'add' añade una unidad más
        });
    };


    const mostrarDetalles = (producto: any) => {
        setProductoSeleccionado(producto);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setProductoSeleccionado(null);
    };

    const calcularTotal = () => {
        return items.reduce((total, it) => total + (Number(it.price || 0) * it.quantity), 0).toFixed(2);
    };

    // FLUJO DE PAGO (ASEGURA LIMPIEZA)
    const doCheckout = async () => {
        if (items.length === 0) return;
        setLoadingPayment(true);

        const orderItems = items.map(item => ({
            product_id: Number(item.productId),
            quantity: item.quantity,
            unit_price: Number(item.price)
        }));

        let orderId = null;

        try {
            // 1. CREAR LA ORDEN EN LA API
            const createOrderUrl = `${API_BASE_URL}/api/orders`;

            const orderRes = await fetch(createOrderUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: CUSTOMER_ID,
                    items: orderItems,
                    payment_status: 'pending',
                    order_status: 'new'
                }),
            });

            if (!orderRes.ok) {
                const errBody = await orderRes.json().catch(() => ({}));
                throw new Error(`Fallo al crear la orden: ${orderRes.status} - ${errBody.error || 'Respuesta no JSON'}`);
            }

            const orderData = await orderRes.json();
            orderId = orderData.id;

            // 2. PROCESAR EL PAGO USANDO STRIPE (tok_visa)
            const paymentUrl = `${API_BASE_URL}/api/payment/process`;

            const paymentRes = await fetch(paymentUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderId,
                    token: STRIPE_TEST_TOKEN,
                    currency: 'usd',
                    totalAmount: orderData.total
                }),
            });

            const paymentResult = await paymentRes.json();

            if (paymentRes.ok && paymentResult.success) {
                Alert.alert('¡Pago Exitoso!', `Folio: ${paymentResult.folio}`);
                clear(); // <-- VACÍA EL CARRITO AL ÉXITO
            } else {
                throw new Error(paymentResult.error || 'Pago rechazado por el proveedor.');
            }

        } catch (err: any) {
            console.error('Error en el flujo de checkout:', err);
            Alert.alert('Error en el pago', err.message || 'Error desconocido.');
        } finally {
            setLoadingPayment(false);
        }
    };


    return (
        <>
            <ScrollView style={{ backgroundColor: colors.background }}>
                <View style={styles.ViewTop}>
                    <Text style={{ color: colors.text, fontSize: 52 }}>Carrito de compras</Text>
                    {items.length > 0 && (
                        <Text style={{ color: colors.text, fontSize: 18, marginTop: 10 }}>
                            Total: ${calcularTotal()}
                        </Text>
                    )}
                </View>

                {items.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>
                            Tu carrito está vacío
                        </Text>
                    </View>
                ) : (
                    items.map((producto) => (
                        <View key={String(producto.productId)} style={[styles.viewCard, { backgroundColor: colors.background }]}>
                            <View style={styles.imageContainer}>
                                {producto.image ? <Image source={{ uri: producto.image }} style={styles.productImage} /> : null}
                                {/* CONTADOR DE CANTIDAD */}
                                <View style={styles.quantityBadge}>
                                    <Text style={styles.quantityText}>{producto.quantity}</Text>
                                </View>
                            </View>
                            <View style={styles.productDetails}>
                                <Text style={[styles.productName, { color: colors.text }]}>
                                    {producto.name || `Producto ${producto.productId}`}
                                </Text>
                                <Text style={[styles.productPrice, { color: colors.text }]}>${(Number(producto.price) || 0).toFixed(2)}</Text>

                                <View style={styles.actionsGroup}>
                                    {/* BOTÓN + PARA INCREMENTAR */}
                                    <Pressable
                                        onPress={() => handleIncrement(producto)}
                                        style={({ pressed }) => [
                                            styles.buttonAdd,
                                            { backgroundColor: pressed ? '#4aa4f3ff' : '#36b5f4ff', flex: 0.5 }
                                        ]}
                                    >
                                        <Text style={styles.buttonText}>+</Text>
                                    </Pressable>
                                    {/* Botón Ver Detalles */}
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? '#4aa4f3ff' : '#36b5f4ff', flex: 1 }
                                        ]}
                                        onPress={() => mostrarDetalles(producto)}
                                    >
                                        <Text style={styles.deleteIcon}>👁️</Text>
                                        <Text style={styles.buttonText}>Ver Detalles</Text>
                                    </Pressable>
                                    {/* Botón Eliminar */}
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? '#d32f2f' : '#f44336', flex: 1.5 }
                                        ]}
                                        onPress={() => eliminarProducto(producto.productId)}
                                    >
                                        <Text style={styles.deleteIcon}>🗑</Text>
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                {items.length > 0 && (
                    <View style={{ padding: 20 }}>
                        <Pressable
                            onPress={doCheckout}
                            style={[styles.modalButton, { backgroundColor: '#28a745' }]}
                            disabled={loadingPayment}
                        >
                            {loadingPayment ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.modalButtonText}>Pagar ahora</Text>
                            )}
                        </Pressable>
                    </View>
                )}

            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        {productoSeleccionado && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Detalle del producto</Text>
                                    <Pressable style={styles.closeButton} onPress={cerrarModal}><Text style={styles.closeButtonText}>✕</Text></Pressable>
                                </View>
                                <ScrollView style={styles.modalBody}>
                                    {productoSeleccionado.image ? (
                                        <View style={styles.modalImageContainer}><Image source={{ uri: productoSeleccionado.image }} style={styles.modalImage} /></View>
                                    ) : null}
                                    <Text style={[styles.modalProductName, { color: colors.text }]}>{productoSeleccionado.name}</Text>
                                    <Text style={[styles.modalProductPrice, { color: colors.text }]}>Precio: ${(Number(productoSeleccionado.price) || 0).toFixed(2)}</Text>
                                </ScrollView>
                                <View style={styles.modalFooter}><Pressable style={[styles.modalButton, styles.closeModalButton]} onPress={cerrarModal}><Text style={styles.modalButtonText}>Cerrar</Text></Pressable></View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    ViewTop: {
        marginTop: 100,
        marginLeft: 25,
        marginRight: 25
    },
    emptyCart: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    viewCard: {
        marginTop: 20,
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'red',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8
    },
    productDetails: {
        flex: 2,
        paddingLeft: 15,
        justifyContent: 'space-between'
    },
    productName: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 8,
        lineHeight: 20
    },
    productDescription: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 8,
        lineHeight: 20
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 0,
        paddingRight: 6,
        gap: 5
    },
    buttonDelete: {
        minWidth: 85,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginHorizontal: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    },
    deleteIcon: {
        fontSize: 16,
        marginRight: 8
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700'
    },
    buttonAdd: {
        width: 40,
        height: 40,
        padding: 0,
        borderRadius: 8,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.18,
        shadowRadius: 2,
        elevation: 3
    },
    quantityBadge: {
        position: 'absolute',
        top: -5,
        right: 10,
        backgroundColor: '#007bff', // Azul para que destaque
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    quantityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBody: {
        padding: 20,
    },
    modalImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    modalProductName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalProductDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalProductPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#4CAF50',
    },
    additionalInfo: {
        marginTop: 10,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 4,
        opacity: 0.8,
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    modalButton: {
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeModalButton: {
        backgroundColor: '#6c757d',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});