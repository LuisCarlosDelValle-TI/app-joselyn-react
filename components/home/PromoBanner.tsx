import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#8B5A33';
const SECONDARY_COLOR = '#F8F0E5';

const PromoBanner: React.FC = () => {
    return (
        <View style={styles.promoContainer}>
            <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>Nueva Colección</Text>
                <Text style={styles.promoSubtitle}>
                    Hasta 50% de descuento {'\n'}
                    en joyería seleccionada
                </Text>
                <TouchableOpacity style={styles.shopNowButton}>
                    <Text style={styles.shopNowText}>Compra Ahora</Text>
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: 'https://i.pinimg.com/1200x/2c/28/67/2c2867093d784bf1a75edb6e8b38172d.jpg' }}
                style={styles.promoImage}
            />
            <View style={styles.paginationDots}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    promoContainer: {
        backgroundColor: SECONDARY_COLOR,
        borderRadius: 20,
        marginHorizontal: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        height: '14%',
    },
    promoTextContainer: {
        flex: 1,
        paddingRight: 10,
        zIndex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#555',
        marginVertical: 8,
    },
    shopNowButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    shopNowText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    promoImage: {
        width: 170,
        height: 200,
        borderRadius: 15,
        position: 'absolute',
        right: -10,
        top: -10,
    },
    paginationDots: {
        position: 'absolute',
        bottom: 12,
        left: 20,
        flexDirection: 'row',
        zIndex: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1C4E9',
        marginHorizontal: 3,
    },
    dotActive: {
        backgroundColor: PRIMARY_COLOR,
        width: 16,
    },
});

export default PromoBanner;