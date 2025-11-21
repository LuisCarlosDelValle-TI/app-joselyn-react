import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PRIMARY_COLOR = '#8B5A33';
const INACTIVE_COLOR = '#F3F3F3'; // Un gris más claro

const SearchBar: React.FC = () => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
                <Icon name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                />
            </View>
            <TouchableOpacity style={styles.filterButton}>
                <Icon name="sliders" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA', // Fondo más claro
        borderWidth: 1,
        borderColor: '#E0E0E0', // Borde sutil
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        marginLeft: 12,
        backgroundColor: PRIMARY_COLOR,
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchBar;