import { useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/theme";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: any;
}

export default function Carrito() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [productos, setProductos] = useState<Producto[]>([
        {
            id: 1,
            nombre: "Pixel 10 PRO XL",
            descripcion: "Descripción detallada del primer producto",
            precio: 30000.000,
            imagen: require("../../assets/pixel10.jpg")
        },
        {
            id: 2,
            nombre: "Nest Hub 2da Gen",
            descripcion: "Descripción detallada del segundo producto",
            precio: 4900.50,
            imagen: require("../../assets/nesthub.jpg")
        },
        {
            id: 3,
            nombre: "Google Buds",
            descripcion: "Descripción detallada del tercer producto",
            precio: 2000.99,
            imagen: require("../../assets/audifonos.jpg")
        }
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    const eliminarProducto = (id: number) => {
        Alert.alert(
            "Eliminar producto",
            "¿Estás seguro de que deseas eliminar este producto del carrito?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        setProductos(productos.filter(producto => producto.id !== id));
                    }
                }
            ]
        );
    };

    const mostrarDetalles = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setProductoSeleccionado(null);
    };

    const calcularTotal = () => {
        return productos.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
    };

    return (
        <>
            <ScrollView style={{ backgroundColor: colors.background }}>
                <View style={styles.ViewTop}>
                    <Text style={{ color: colors.text, fontSize: 52 }}>Carrito de compras</Text>
                    {productos.length > 0 && (
                        <Text style={{ color: colors.text, fontSize: 18, marginTop: 10}}>
                            Total: ${calcularTotal()}
                        </Text>
                    )}
                </View>

                {productos.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center'}}>
                            Tu carrito está vacío
                        </Text>
                    </View>
                ) : (
                    productos.map((producto) => (
                        <View key={producto.id} style={[styles.viewCard, { backgroundColor: colors.background}]}>
                            <View style={styles.imageContainer}>
                                <Image source={producto.imagen} style={styles.productImage}/>
                            </View>
                            <View style={styles.productDetails}>
                                <Text style={[styles.productName, { color: colors.text }]}>
                                    {producto.nombre}
                                </Text>
                                <Text style={[styles.productDescription, { color: colors.text}]}>
                                    {producto.descripcion}
                                </Text>
                                <Text style={[styles.productPrice, { color: colors.text}]}>
                                    ${producto.precio.toFixed(2)}
                                </Text>

                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? "#4aa4f3ff" : "#36b5f4ff"}
                                        ]}
                                        onPress={() => mostrarDetalles(producto)}
                                    >
                                        <Text style={styles.deleteIcon}>👁️</Text>
                                        <Text style={styles.buttonText}>Ver Detalles</Text>
                                    </Pressable>
                                    <Pressable
                                        style={({pressed}) => [
                                            styles.buttonDelete,
                                            { backgroundColor: pressed ? "#d32f2f" : "#f44336"}
                                        ]}
                                        onPress={() => eliminarProducto(producto.id)}
                                    >
                                        <Text style={styles.deleteIcon}>🗑</Text>
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
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
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                                        Detalles del Producto
                                    </Text>
                                    <Pressable
                                        style={styles.closeButton}
                                        onPress={cerrarModal}
                                    >
                                        <Text style={styles.closeButtonText}>✕</Text>
                                    </Pressable>
                                </View>

                                <ScrollView style={styles.modalBody}>
                                    <View style={styles.modalImageContainer}>
                                        <Image
                                            source={productoSeleccionado.imagen}
                                            style={styles.modalImage}
                                        />
                                    </View>

                                    <Text style={[styles.modalProductName, { color: colors.text }]}>
                                        {productoSeleccionado.nombre}
                                    </Text>

                                    <Text style={[styles.modalProductDescription, { color: colors.text }]}>
                                        {productoSeleccionado.descripcion}
                                    </Text>

                                    <Text style={[styles.modalProductPrice, { color: colors.text }]}>
                                        Precio: ${productoSeleccionado.precio.toFixed(2)}
                                    </Text>

                                    <View style={styles.additionalInfo}>
                                        <Text style={[styles.infoTitle, { color: colors.text }]}>
                                            Información adicional:
                                        </Text>
                                        <Text style={[styles.infoText, { color: colors.text }]}>
                                            • Disponible en stock
                                        </Text>
                                        <Text style={[styles.infoText, { color: colors.text }]}>
                                            • Envío gratuito
                                        </Text>
                                        <Text style={[styles.infoText, { color: colors.text }]}>
                                            • Garantía de 30 días
                                        </Text>
                                    </View>
                                </ScrollView>

                                <View style={styles.modalFooter}>
                                    <Pressable
                                        style={[styles.modalButton, styles.closeModalButton]}
                                        onPress={cerrarModal}
                                    >
                                        <Text style={styles.modalButtonText}>Cerrar</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>

    )
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