import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useCart } from '../../context/CartContext';

const API_BASE_URL = 'htttp://192.168.1.52:3000';
const STRIPE_TEST_TOKEN = 'tok_visa';
const DUMMY_ORDER_ID = 1;

export default function Carrito() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const { items, remove, checkout } = useCart();
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

    const doCheckout = async () => {
        if (items.length === 0) return;
        setLoadingPayment(true);

        const totalAmount = calcularTotal();

        try {
            const url = `${API_BASE_URL}/api/payments/process`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: DUMMY_ORDER_ID,
                    token: STRIPE_TEST_TOKEN,
                    currency: `usd`,
                    totalAmount: totalAmount
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                Alert.alert('Pago exitoso', 'Tu pago ha sido procesado correctamente.');
                checkout();
            } else {
                Alert.alert('Error en el pago', result.message || 'Hubo un problema al procesar tu pago.');
            }

        } catch (err) {
            console.error('Error de red/servidor:', err);
            Alert.alert('Error de conexión', 'No se pudo conectar al servidor de pagos. Por favor, intenta nuevamente más tarde.');
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
                        <Text style={{ color: colors.text, fontSize: 18, marginTop: 10}}>
                            Total: ${calcularTotal()}
                        </Text>
                    )}
                </View>

                {items.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center'}}>
                            Tu carrito está vacío
                        </Text>
                    </View>
                ) : (
                    items.map((producto) => (
                        <View key={String(producto.productId)} style={[styles.viewCard, { backgroundColor: colors.background }]}> 
                            <View style={styles.imageContainer}>
                                {producto.image ? <Image source={{ uri: producto.image }} style={styles.productImage}/> : null}
                            </View>
                            <View style={styles.productDetails}>
                                <Text style={[styles.productName, { color: colors.text }]}>
                                    {producto.name || `Producto ${producto.productId}`}
                                </Text>
                                <Text style={[styles.productPrice, { color: colors.text }]}>${(Number(producto.price) || 0).toFixed(2)}</Text>

                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? '#4aa4f3ff' : '#36b5f4ff' }
                                        ]}
                                        onPress={() => mostrarDetalles(producto)}
                                    >
                                        <Text style={styles.deleteIcon}>👁️</Text>
                                        <Text style={styles.buttonText}>Ver Detalles</Text>
                                    </Pressable>
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? '#d32f2f' : '#f44336' }
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
                        <Pressable onPress={doCheckout} style={[styles.modalButton, { backgroundColor: '#28a745' }]}> 
                            <Text style={styles.modalButtonText}>Pagar ahora</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    buttonDelete: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 8,
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
        marginRight: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },
    buttonAdd: {
        height: 40,
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
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