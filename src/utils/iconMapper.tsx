import {
  Landmark,
  MapPin,
  Utensils,
  ShoppingBag,
  Plane,
  Bed,
} from "lucide-react";

// Define a type-safe mapping from string categories to icon-rendering functions
export const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sightseeing: Landmark,
  travel: Plane,
  food: Utensils,
  shopping: ShoppingBag,
  stay: Bed,
  location: MapPin,
};