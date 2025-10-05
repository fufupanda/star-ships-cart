import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  FlatList,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  removeItem,
  updateQuantity,
  clearCart,
  updatePaymentMethod,
  PAYMENT_METHODS_TYPE,
} from "../store/cartSlice";
import {
  EXCHANGE_RATE_ONE_AED,
  getCurrencyConversion,
} from "../utils/currencyExchange";
import { formatNumber } from "../utils/formatNumber";
import QuantityController from "../components/QuantityController";
import { useNavigation } from "@react-navigation/native";

const bgImage = require("../assets/starship-bg.png") as ImageSourcePropType;

const EmptyCart = () => {
  return (
    <ImageBackground source={bgImage} style={{ height: "100%", width: "100%" }}>
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="cart-variant" size={80} color="white" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some star ships to get started!
        </Text>
      </View>
    </ImageBackground>
  );
};

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation()
  const { items, total, itemCount, paymentMethod } = useAppSelector((state) => state.cart);
  const [showPaymentMethodOptions, setShowPaymentMethodOptions] = useState(false);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  // Calculate order summary values
  const subtotal = getCurrencyConversion(total, EXCHANGE_RATE_ONE_AED);
  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const totalWithTax = subtotal + taxAmount;

  // Get items to display (show 2 by default, show all if showAllItems is true)
  const itemsToShow = showAllItems ? items : items.slice(0, 2);
  const hasMoreItems = items.length > 2;

  const handleRemoveItem = (name: string) => {
    dispatch(removeItem(name));
  };

  const handleUpdateQuantity = (name: string, quantity: number) => {
    dispatch(updateQuantity({ name, quantity }));
  };

  const handleClearCart = useCallback(() => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  }, []);

  const handlePlaceOrderPress = useCallback(() => {
    setShowOrderSummaryModal(false);
    dispatch(clearCart());
    navigation.navigate("Home" as never);
    Alert.alert("🎉 Order placed successfully!", "", [{ text: "OK" }]);
  }, []);

  const handleCheckOutPress = useCallback(() => {
    setShowAllItems(false);
    setShowOrderSummaryModal(true);
  }, []);

  const handlePaymentMethodSelection = (
    paymentMethodType: PAYMENT_METHODS_TYPE
  ) => {
    dispatch(updatePaymentMethod(paymentMethodType));
    setShowPaymentMethodOptions(false);
  };

  // Render function for main cart items
  const renderCartItem = ({ item, index }: { item: any; index: number }) => (
    <View key={index} style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemPriceContainer}>
          <MaterialCommunityIcons
            name="space-invaders"
            size={20}
            color="purple"
          />
          <Text style={styles.itemPrice}>
            {formatNumber(Number(item.cost_in_credits))} per unit
          </Text>
        </View>
        <Text style={styles.maxQuantityText}>
          Max: {item.maxQuantity} units
        </Text>
        <QuantityController
          quantity={item.quantity}
          maxQuantity={item.maxQuantity}
          onQuantityChange={(newQuantity) => handleUpdateQuantity(item.name, newQuantity)}
        />
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          AED{" "}
          {getCurrencyConversion(
            Number(item.cost_in_credits) * item.quantity,
            EXCHANGE_RATE_ONE_AED
          ).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.name)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render function for order summary items
  const renderSummaryItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.summaryItem,
        { borderBottomWidth: itemsToShow.length - 1 === index ? 0 : 1 },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.summaryItemImage} />
      <View style={styles.summaryItemDetails}>
        <Text style={styles.summaryItemName}>{item.name}</Text>
        <Text style={styles.summaryItemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.summaryItemPrice}>
        AED{" "}
        {getCurrencyConversion(
          Number(item.cost_in_credits) * item.quantity,
          EXCHANGE_RATE_ONE_AED
        ).toFixed(2)}
      </Text>
    </View>
  );

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <ImageBackground source={bgImage} style={{ height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.itemCount}>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Text>
        </View>

        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item, index) => `cart-${item.name}-${index}`}
          contentContainerStyle={styles.itemsContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          {showPaymentMethodOptions ? (
            <View style={{ height: 70, justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() =>
                  handlePaymentMethodSelection(PAYMENT_METHODS_TYPE.NET_BANKING)
                }
                style={styles.paymentMethodSelection}
              >
                <MaterialCommunityIcons
                  name="bank"
                  size={24}
                  color="#d2d8e0ff"
                />
                <Text style={styles.paymentMethodText}>Net Banking</Text>
                {paymentMethod === PAYMENT_METHODS_TYPE.NET_BANKING && (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color="white"
                    style={{ position: "absolute", right: 0 }}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handlePaymentMethodSelection(PAYMENT_METHODS_TYPE.COD)
                }
                style={styles.paymentMethodSelection}
              >
                <MaterialCommunityIcons name="cash" size={24} color="green" />
                <Text style={styles.paymentMethodText}>Cash on delivery</Text>
                {paymentMethod === PAYMENT_METHODS_TYPE.COD && (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color="white"
                    style={{ position: "absolute", right: 0 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() =>
                setShowPaymentMethodOptions(!showPaymentMethodOptions)
              }
              style={styles.paymentMethodContainer}
            >
              {paymentMethod === PAYMENT_METHODS_TYPE.NET_BANKING ? (
                <View style={styles.paymentMethodContainer}>
                  <MaterialCommunityIcons
                    name="bank"
                    size={24}
                    color="#d2d8e0ff"
                  />
                  <Text style={styles.paymentMethodText}>Net Banking</Text>
                </View>
              ) : (
                <View style={styles.paymentMethodContainer}>
                  <MaterialCommunityIcons name="cash" size={24} color="green" />
                  <Text style={styles.paymentMethodText}>Cash on delivery</Text>
                </View>
              )}
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#d2d8e0ff"
              />
            </TouchableOpacity>
          )}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
              AED{" "}
              {getCurrencyConversion(total, EXCHANGE_RATE_ONE_AED).toFixed(2)}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handleCheckOutPress}
            >
              <Text style={styles.checkoutButtonText}>Check Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary Modal */}
        <Modal
          visible={showOrderSummaryModal}
          animationType="slide"
          onRequestClose={() => setShowOrderSummaryModal(false)}
          backdropColor={"rgba(0, 0, 0, 0)"}
          statusBarTranslucent
          navigationBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Order Summary</Text>
                <TouchableOpacity
                  onPress={() => setShowOrderSummaryModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
              >
                <Text style={styles.sectionTitle}>Items ({itemCount})</Text>
                <FlatList
                  data={itemsToShow}
                  renderItem={renderSummaryItem}
                  keyExtractor={(item, index) => `${item.name}-${index}`}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />

                {hasMoreItems && (
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => setShowAllItems(!showAllItems)}
                  >
                    <Text style={styles.viewMoreText}>
                      {showAllItems
                        ? `View Less`
                        : `View More (${items.length - 2} more)`}
                    </Text>
                    <MaterialCommunityIcons
                      name={showAllItems ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                )}

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>
                    AED {subtotal.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax (5%):</Text>
                  <Text style={styles.summaryValue}>
                    AED {taxAmount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalValue}>
                    AED {totalWithTax.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.paymentMethodSummary}>
                  <Text style={styles.sectionTitle}>Payment Method</Text>
                  <View style={styles.selectedPaymentMethod}>
                    {paymentMethod === PAYMENT_METHODS_TYPE.NET_BANKING ? (
                      <>
                        <MaterialCommunityIcons
                          name="bank"
                          size={20}
                          color="grey"
                        />
                        <Text style={styles.paymentMethodSummaryText}>
                          Net Banking
                        </Text>
                      </>
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="cash"
                          size={20}
                          color="green"
                        />
                        <Text style={styles.paymentMethodSummaryText}>
                          Cash on Delivery
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.placeOrderModalButton}
                  onPress={handlePlaceOrderPress}
                >
                  <Text style={styles.placeOrderModalButtonText}>
                    Place Order
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 50
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    marginTop:20
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  itemCount: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  itemsContainer: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: "#ffffffd6",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  itemPriceContainer: {
    flexDirection: "row",
    alignItems:"center",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#444",
    marginLeft: 4,
  },
  maxQuantityText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 10,
    fontStyle: "italic",
  },
  itemActions: {
    alignItems: "flex-end",
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  footer: {
    backgroundColor: "#00000049",
    padding: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#d2d8e0ff"
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  placeOrderButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethodSelection: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d2d8e0ff",
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    flex: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryItemDetails: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  summaryItemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27ae60",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#2c3e50",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  summaryTotalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  paymentMethodSummary: {
    marginTop: 10,
  },
  selectedPaymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  paymentMethodSummaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 8,
  },
  modalFooter: {
    padding: 20,
  },
  placeOrderModalButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  placeOrderModalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 5,
  },
  modalContentContainer: {
    paddingTop: 20,
  },
});
