import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, updateQuantity } from "../store/cartSlice";
import { searchProducts, clearSearchResults } from "../store/productsSlice";
import ProductCard from "../components/ProductCard";
import FloatingCartInfoButton from "../components/FloatingCartInfoButton";

const bgImage = require("../assets/starship-bg.png") as ImageSourcePropType;

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const { searchData, searchLoading, searchError, maxQuantities } = useAppSelector((state) => state.products);

  const getMaxQuantity = (productName: string): number => {
    return maxQuantities[productName] || 10;
  };

  const getCartQuantity = (productName: string): number => {
    const cartItem = cartItems.find((item) => item.name === productName);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (
    product: any,
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

  const handleCartNavigation = useCallback(() => {
    navigation.navigate("Cart" as never);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        dispatch(searchProducts(searchQuery.trim()));
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearchResults());
    }
  }, [searchQuery, dispatch]);

  const renderProduct = ({ item, index }: { item: any; index: number }) => {
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

  return (
    <ImageBackground source={bgImage} style={{ height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Starships</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for starships..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <FloatingCartInfoButton cartItemCount={cartItemCount} onPress={handleCartNavigation}/>

        <View style={styles.resultsContainer}>
          {!searchQuery.trim() ? (
            <View style={styles.initialState}>
              <Text style={styles.initialStateEmoji}>🔍</Text>
              <Text style={styles.initialStateText}>
                Start typing to search
              </Text>
              <Text style={styles.initialStateSubtext}>
                Search for starships by name
              </Text>
            </View>
          ) : searchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchError ? (
            <View style={styles.errorContainer}>
              <AntDesign name="api" size={80} color="white" />
              <Text style={styles.errorSubtext}>{searchError}</Text>
            </View>
          ) : !searchData?.results || searchData.results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsEmoji}>🤷‍♂️</Text>
              <Text style={styles.noResultsText}>No products found</Text>
              <Text style={styles.noResultsSubtext}>
                Try a different search term
              </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={(item) => item.name}
              contentContainerStyle={styles.productsContainer}
              data={searchData.results}
              renderItem={renderProduct}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  resultsContainer: {
    flex: 1,
  },
  productsContainer: {
    padding: 16,
  },
  initialState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  initialStateEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  initialStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  initialStateSubtext: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  errorSubtext: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  noResultsEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
