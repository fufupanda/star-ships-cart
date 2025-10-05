import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../hooks/redux";

const FloatingCartInfoButton = () => {
  const navigation = useNavigation();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  const handleCartNavigation = useCallback(() => {
    navigation.navigate("Cart" as never);
  }, []);

  if (cartItemCount === 0) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleCartNavigation} style={styles.cartButton}>
      <Text style={styles.cartItemCountText}>{cartItemCount}</Text>
      <MaterialCommunityIcons name="cart-arrow-right" size={28} color="white" />
    </TouchableOpacity>
  );
};

export default FloatingCartInfoButton;

const styles = StyleSheet.create({
  cartButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75, 0, 130, 0.8)",
    height: 70,
    width: 70,
    borderRadius: 100,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  cartItemCountText: {
    fontSize: 16,
    color: "white",
    fontWeight: "800",
    backgroundColor: "#007AFF",
    borderRadius: 100,
    height: 24,
    width: 24,
    textAlign: "center",
    top: -5,
    right: 2,
    position: "absolute",
  },
});
