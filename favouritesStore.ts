import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "./types/product";

export type FavouriteItem = {
  id: string;
  product: Product;
  savedAt: number;
};

const FAVOURITES_KEY = "scaniq_favourites";

export async function getFavourites(): Promise<FavouriteItem[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function toggleFavourite(product: Product): Promise<void> {
  try {
    const currentFavourites = await getFavourites();
    const existingIndex = currentFavourites.findIndex(
      (fav) => fav.id === product.id,
    );
    let updatedFavourites: FavouriteItem[];
    if (existingIndex !== -1) {
      updatedFavourites = currentFavourites.filter((f) => f.id !== product.id);
    } else {
      updatedFavourites = [
        ...currentFavourites,
        { id: product.id, product, savedAt: Date.now() },
      ];
    }
    await AsyncStorage.setItem(
      FAVOURITES_KEY,
      JSON.stringify(updatedFavourites),
    );
  } catch (error) {
    console.error("Failed to toggle favourite:", error);
  }
}
export async function isFavourite(id: string): Promise<boolean> {
  try {
    const favs = await getFavourites();
    return favs.some((f) => f.id === id);
  } catch {
    return false;
  }
}

export async function removeFavourite(id: string): Promise<void> {
  try {
    const currentFavourites = await getFavourites();
    const updatedFavourites = currentFavourites.filter((f) => f.id !== id);
    await AsyncStorage.setItem(
      FAVOURITES_KEY,
      JSON.stringify(updatedFavourites),
    );
  } catch (error) {
    console.error("Failed to remove favourite:", error);
  }
}
