import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Asegúrate de tener react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Header: React.FC = () => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.locationContainer}>
                <Icon name="map-pin" size={16} color="#555" />
                <Text style={styles.locationText}>La Tejona, Cotaxtla.</Text>
                <Icon name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity>
                <IonIcon name="notifications-outline" size={24} color="#000" />
                <View style={styles.notificationDot} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginHorizontal: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationDot: {
        position: 'absolute',
        top: 0,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
});

export default Header;