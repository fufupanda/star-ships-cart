import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface IQuantityControllerProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
  disabled?: boolean;
}

const QuantityController: FC<IQuantityControllerProps> = (props) => {
  const { quantity, maxQuantity, onQuantityChange, disabled = false } = props;
  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const isDecrementDisabled = disabled || quantity <= 1;
  const isIncrementDisabled = disabled || quantity >= maxQuantity;

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          isDecrementDisabled && styles.quantityButtonDisabled,
        ]}
        onPress={handleDecrement}
        disabled={isDecrementDisabled}
      >
        <Text
          style={[
            styles.quantityButtonText,
            isDecrementDisabled && styles.quantityButtonTextDisabled,
          ]}
        >
          -
        </Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          isIncrementDisabled && styles.quantityButtonDisabled,
        ]}
        onPress={handleIncrement}
        disabled={isIncrementDisabled}
      >
        <Text
          style={[
            styles.quantityButtonText,
            isIncrementDisabled && styles.quantityButtonTextDisabled,
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantityController;

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: "#717171ff",
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  quantityButtonTextDisabled: {
    color: "#fff",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
  },
});

