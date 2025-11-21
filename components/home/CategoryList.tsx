import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';

// Importa el tipo (ajusta la ruta si moviste los tipos)
import { Category } from '../app/(tabs)/home'; // Asumiendo que está en home.tsx

interface Props {
    data: Category[];
}

const PRIMARY_COLOR = '#8B5A33';

const CategoryList: React.FC<Props> = ({ data }) => {
    return (
        <View style={styles.categorySection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categoría</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryItem}>
                        <Image source={{ uri: item.image }} style={styles.categoryImage} />
                        <Text style={styles.categoryName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    categorySection: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        fontSize: 14,
        color: '#888', // Color más sutil
        fontWeight: '500',
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryName: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
        color: '#555',
        textTransform: 'uppercase', // Como en la imagen
    },
});

export default CategoryList;