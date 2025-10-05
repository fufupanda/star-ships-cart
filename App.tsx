import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CartScreen from './screens/CartScreen';

const Tab = createBottomTabNavigator();

// Tab icon configuration
const TAB_ICONS = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Search: { focused: 'search', unfocused: 'search-outline' },
  Cart: { focused: 'cart', unfocused: 'cart-outline' },
} as const;

// Helper function for tab bar icons
const getTabBarIcon = ({ route, focused, color, size }: {
  route: { name: keyof typeof TAB_ICONS | string };
  focused: boolean;
  color: string;
  size: number;
}) => {
  const routeName = route.name as keyof typeof TAB_ICONS;
  const iconName = TAB_ICONS[routeName]
    ? TAB_ICONS[routeName][focused ? 'focused' : 'unfocused']
    : 'help-outline';

  return <Ionicons name={iconName} size={size} color={color} />;
};

// App Navigator component
const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon({ route, focused, color, size }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
    <StatusBar style="auto" />
  </NavigationContainer>
);

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
