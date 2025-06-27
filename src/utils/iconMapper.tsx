import {
  Landmark,
  MapPin,
  Utensils,
  ShoppingBag,
  Plane,
  Bed,
} from "lucide-react";

// Define a type-safe mapping from string categories to icon-rendering functions
export const categoryIcons: Record<string, () => JSX.Element> = {
  sightseeing: () => <Landmark className="w-6 h-6 text-primary" />,
  travel: () => <Plane className="w-6 h-6 text-primary" />,
  food: () => <Utensils className="w-6 h-6 text-primary" />,
  shopping: () => <ShoppingBag className="w-6 h-6 text-primary" />,
  stay: () => <Bed className="w-6 h-6 text-primary" />,
  location: () => <MapPin className="w-6 h-6 text-primary" />,
};
