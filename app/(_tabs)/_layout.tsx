import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
            ),
        }}
      />
        <Tabs.Screen
            name="cart"
            options={{
                title: 'Carrito',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="cart" color={color} size={size} />
                ),
            }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
            ),
        }}
      />
    </Tabs>
  );
}