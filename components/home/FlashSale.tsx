import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PRIMARY_COLOR = '#6D4C41'; // Un marrón más oscuro
const INACTIVE_COLOR = '#FAFAFA';

const FlashSaleHeader: React.FC = () => {
    return (
        <View style={styles.flashSaleSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Flash Sale</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Cierra en: </Text>
                    <Text style={styles.timerBox}>02</Text>
                    <Text style={styles.timerSeparator}>:</Text>
                    <Text style={styles.timerBox}>12</Text>
                    <Text style={styles.timerSeparator}>:</Text>
                    <Text style={styles.timerBox}>56</Text>
                </View>
            </View>


            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
            >
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                    <Text style={styles.tabTextActive}>Newest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Popular</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Trendy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Women</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Men</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    flashSaleSection: {
        marginTop: 24,
        // El padding se lo damos al ScrollView
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16, // Padding solo para el header
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 14,
        color: '#555',
    },
    timerBox: {
        backgroundColor: '#F5F5F5',
        color: '#333',
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
        fontWeight: 'bold',
        fontSize: 14,
        marginHorizontal: 2,
    },
    timerSeparator: {
        fontWeight: 'bold',
        color: '#333',
    },
    tabsContainer: {
        // Padding para que inicie en el borde y tenga espacio al final
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: INACTIVE_COLOR,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tabActive: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    tabText: {
        color: '#333',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default FlashSaleHeader;