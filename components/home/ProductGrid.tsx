import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Product } from '../app/(_tabs)/home';
import {Ionicons} from "@expo/vector-icons";

interface Props {
    data: Product[];
    onAdd?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const productCardWidth = (width - 16 * 2 - 12) / 2;

const ProductGrid: React.FC<Props> = ({ data, onAdd }) => {
    return (
        <View style={styles.productGrid}>
            {data.map((item, index) => (
                <View key={item.id ?? index} style={styles.productCard}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <TouchableOpacity style={styles.favoriteIcon}>
                        <Icon name="heart" size={18} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cartIcon} onPress={() => onAdd && onAdd(item)}>
                        <Ionicons name="cart" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    productGrid: {
        marginTop: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        width: productCardWidth,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        marginBottom: 15,
        position: 'relative',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 210,
    },
    favoriteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 6,
        borderRadius: 15,
    },
    cartIcon: {
        position: 'absolute',
        top: 160,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 6,
        borderRadius: 15,
    },
});

export default ProductGrid;