import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATING_KEY = '@rating_asked';

export async function maybeAskForRating() {
  try {
    const asked = await AsyncStorage.getItem(RATING_KEY);
    if (asked) return;
    const available = await StoreReview.isAvailableAsync();
    if (!available) return;
    await AsyncStorage.setItem(RATING_KEY, '1');
    await StoreReview.requestReview();
  } catch (_) {}
}
