import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addItem, updateQuantity } from "../store/cartSlice";
import {
  fetchProducts,
  loadMoreProducts,
  IStarShip,
} from "../store/productsSlice";
import ProductCard from "../components/ProductCard";
import FloatingCartInfoButton from "../components/FloatingCartInfoButton";

const bgImage = require('../assets/starship-bg.png') as ImageSourcePropType

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const {
    data: apiData,
    loading,
    error,
    loadingMore,
    maxQuantities,
  } = useAppSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const handleAddToCart = (
    product: IStarShip,
    maxQuantity: number,
    imageUrl: string
  ) => {
    dispatch(
      addItem({
        name: product.name,
        cost_in_credits: product.cost_in_credits,
        image: imageUrl,
        maxQuantity,
      })
    );
  };

  const handleUpdateQuantity = (productName: string, newQuantity: number) => {
    dispatch(updateQuantity({ name: productName, quantity: newQuantity }));
  };

  const handleLoadMore = () => {
    if (apiData?.next && !loadingMore) {
      dispatch(loadMoreProducts(apiData.next));
    }
  };

  const getMaxQuantity = (productName: string): number => {
    return maxQuantities[productName] || 10;
  };

  const getCartQuantity = (productName: string): number => {
    const cartItem = cartItems.find((item) => item.name === productName);
    return cartItem ? cartItem.quantity : 0;
  };

  const renderProducts = ({
    item,
    index,
  }: {
    item: IStarShip;
    index: number;
  }) => {
    const cartQuantity = getCartQuantity(item.name);
    const maxQuantity = getMaxQuantity(item.name);

    return (
      <ProductCard
        item={item}
        index={index}
        cartQuantity={cartQuantity}
        maxQuantity={maxQuantity}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    );
  };

  const renderFooter = () => {
    if (!apiData?.next && !loading) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.endOfListText}>
            🎉 You've seen all starships!
          </Text>
        </View>
      );
    }

    if (loadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingMoreText}>Loading more starships...</Text>
        </View>
      );
    }
  };

  return (
    <ImageBackground source={bgImage} style={{ height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Star Ship Cart</Text>
          <Text style={styles.subtitle}>
            Your spacecraft shopping destination
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <AntDesign name="api" size={80} color="white" />
            <Text style={styles.errorTitle}>{error}</Text>
          </View>
        )}

        <FloatingCartInfoButton />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : apiData?.results && apiData.results.length > 0 ? (
          <FlatList
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.productsContainer}
            data={apiData?.results}
            renderItem={renderProducts}
            numColumns={2}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
          />
        ) : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    fontWeight:'medium',
    color: "#fff",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
  },
  productsContainer: {
    padding: 16,
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingMoreText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  endOfListText: {
    fontSize: 16,
    fontWeight:'600',
    color: "#fff",
    textAlign: "center",
    fontStyle: "italic",
    flexWrap: 'wrap',
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    top: -40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
    textAlign: 'center',
    marginTop: 20,
  },
});
