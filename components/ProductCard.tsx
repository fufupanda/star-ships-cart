import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IStarShip } from '../store/productsSlice';
import { formatNumber } from '../utils/formatNumber';
import QuantityController from './QuantityController';

interface IProductCardProps {
  item: IStarShip;
  index: number;
  cartQuantity: number;
  maxQuantity: number;
  onAddToCart: (product: IStarShip, maxQuantity: number, imageUrl: string) => void;
  onUpdateQuantity: (productName: string, newQuantity: number) => void;
}

const ProductCard: FC<IProductCardProps> = (props) => {
  const {
    item,
    index,
    cartQuantity,
    maxQuantity,
    onAddToCart,
    onUpdateQuantity,
  } = props;
  const imageUrl = `https://picsum.photos/30${index}/200`;

  return (
    <View style={styles.productCard}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productName}>
        {item?.name}
      </Text>

      {item?.cost_in_credits !== "unknown" && (
        <View style={styles.priceContainer}>
          <MaterialCommunityIcons
            name="space-invaders"
            size={20}
            color="purple"
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.productPrice}
          >
            {formatNumber(Number(item?.cost_in_credits))}
          </Text>
        </View>
      )}

      {item?.cost_in_credits === "unknown" ? (
        <View style={styles.soldOut}>
          <Text style={styles.addButtonText}>Sold out</Text>
        </View>
      ) : cartQuantity === 0 ? (
        // Show Add to Cart button when quantity is 0
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddToCart(item, maxQuantity, imageUrl)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        // Show quantity controls when quantity > 0
        <View style={styles.addToCartContainer}>
          <QuantityController
            quantity={cartQuantity}
            maxQuantity={maxQuantity}
            onQuantityChange={(newQuantity) => onUpdateQuantity(item.name, newQuantity)}
          />
        </View>
      )}
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#ffffffd6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    width: "48%",
    height: 230,
    alignItems: "center",
  },
  productImage: {
    height: 80,
    width: 80,
    borderRadius: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 5,
    color: "#2c3e50",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "90%",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 4,
  },
  addToCartContainer: {
    position: "absolute",
    bottom: 16,
    alignItems: "center",
    width: "90%",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    position: "absolute",
    bottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  soldOut: {
    backgroundColor: "#969899ff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    bottom: 16,
    position: "absolute",
  },
});
