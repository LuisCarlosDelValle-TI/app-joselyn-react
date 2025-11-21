import React, { useEffect, useState } from 'react';
import {View, Image, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Button, Modal, TouchableOpacity, FlatList, Pressable} from 'react-native';
import Header from '../../components/home/Header';
import SearchBar from '../../components/home/SearchBar';
import PromoBanner from '../../components/home/PromoBanner';
import CategoryList from '../../components/home/CategoryList';
import FlashSale from '../../components/home/FlashSale';
import { useCart } from '../../context/CartContext';

export type Category = {
    id: string;
    name: string;
    image?: string;
    categoryId?: string;
}

export type Product = {
    id: string;
    name: string;
    image?: string;
    price?: number;
    stock?: number;
    description?: string;
}

const categorias: Category[] = [
  { id: '1', name: 'Cadenas', image: "https://i.pinimg.com/736x/6a/35/2c/6a352cf162ed576bc91f0f0e0deecd7a.jpg" },
  { id: '2', name: 'Pulseras', image: "https://i.pinimg.com/736x/e4/37/c0/e437c07cc6848d7c0968b43bf26f1cf4.jpg" },
  { id: '3', name: 'Aretes', image: "https://i.pinimg.com/1200x/2c/28/67/2c2867093d784bf1a75edb6e8b38172d.jpg" },
    { id: '4', name: 'Cadenas', image: "https://i.pinimg.com/736x/6a/35/2c/6a352cf162ed576bc91f0f0e0deecd7a.jpg" },
    { id: '5', name: 'Pulseras', image: "https://i.pinimg.com/736x/e4/37/c0/e437c07cc6848d7c0968b43bf26f1cf4.jpg" },
];

const productosInitial: Product[] = [];

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.52:3000';

const ListHeader = ({ fetchProducts }) => (
    <>
        <Header />
        <SearchBar />
        <PromoBanner />
        <CategoryList data={categorias} />
        <FlashSale />
        <View style={{ padding: 12 }}>
            <View style={{ marginTop: 8 }}>
                <Button title="Actualizar" onPress={fetchProducts} />
            </View>
        </View>
    </>
);
export default function HomeScreen(): JSX.Element {
    const [productos, setProductos] = useState<Product[]>(productosInitial);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastStatus, setLastStatus] = useState<string | null>(null);
    const [lastBody, setLastBody] = useState<any>(null);
    const [selected, setSelected] = useState<Product | null>(null);

    const { add } = useCart();

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        setLastStatus(null);
        setLastBody(null);

        const url = `${API_BASE}/api/products`;
        console.log('Fetching products from', url);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch(url, { signal: controller.signal });
            console.log('Fetch status', res.status);
            setLastStatus(String(res.status));
            if (!res.ok) {
                const txt = await res.text().catch(() => null);
                setLastBody(txt);
                throw new Error(`HTTP ${res.status} ${txt || ''}`);
            }
            const data = await res.json().catch(() => null);
            console.log('Products response body:', data);
            setLastBody(data);

            const items = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
            const mapped = items.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                image: p.image_url || undefined,
                price: Number(p.price ?? 0),
                stock: Number(p.stock ?? 0),
                description: p.description ?? null,
            }));
            setProductos(mapped);
        } catch (err: any) {
            console.error('fetch products error', err);
            if (err.name === 'AbortError') setError('Tiempo de espera agotado al conectar con la API.');
            else setError(err.message ? String(err.message) : 'Error al cargar los productos.');
            setProductos([]);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <View style={{padding: 16, alignItems: 'center'}}>
                    <Text>Cargando productos...</Text>
                    </View>
            );
        }

    return (      
                <>
                    <FlatList
                        data={productos}
                        keyExtractor={(i) => i.id}
                        numColumns={2}
                        contentContainerStyle={styles.grid}
                        ListHeaderComponent={<ListHeader fetchProducts={fetchProducts} />}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => setSelected(item)}>
                                {item.image ? <Image source={{ uri: item.image }} style={styles.cardImage} /> : <View style={[styles.cardImage, styles.placeholder]} />}
                                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                                <Text style={styles.cardPrice}>${(item.price ?? 0).toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <Modal visible={!!selected} animationType="slide" transparent={true} onRequestClose={() => setSelected(null)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{selected?.name}</Text>
                                {selected?.image ? <Image source={{ uri: selected.image }} style={styles.modalImage} /> : null}
                                <Text style={styles.modalPrice}>Precio: ${((selected?.price) ?? 0).toFixed(2)}</Text>
                                <Text style={styles.modalDesc}>{selected?.description ?? 'Sin descripción.'}</Text>
                                <Text style={styles.modalStock}>{(selected?.stock ?? 0) > 0 ? `Disponible: ${selected?.stock}` : 'Agotado'}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                                    <Pressable style={styles.modalButton} onPress={() => { if (selected) add({ productId: selected.id, name: selected.name, image: selected.image, price: selected.price ?? 0, quantity: 1 }); setSelected(null); }}>
                                        <Text style={styles.modalButtonText}>Agregar al carrito</Text>
                                    </Pressable>
                                    <Pressable style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setSelected(null)}>
                                        <Text style={[styles.modalButtonText, { color: '#000' }]}>Cerrar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            );
};

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderContent()}
            <View style={{height: 120}} />
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    grid: {
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 120,
        borderRadius: 6,
        backgroundColor: '#f2f2f2',
        marginBottom: 8,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    cardPrice: {
        marginTop: 6,
        fontSize: 13,
        color: '#333',
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    modalImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
    modalPrice: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    modalDesc: { fontSize: 14, color: '#444', marginBottom: 6 },
    modalStock: { fontSize: 13, marginBottom: 8 },
    modalButton: { backgroundColor: '#0a84ff', padding: 10, borderRadius: 6, minWidth: 140, alignItems: 'center' },
    modalButtonText: { color: '#fff', fontWeight: '700' },
});