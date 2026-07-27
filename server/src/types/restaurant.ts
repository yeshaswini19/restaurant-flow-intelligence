export interface LowStockIngredient {
  ingredient: string;
  quantity: number;
}

export interface MissingIngredient {
  ingredient: string;
  required: number;
  available: number;
}

export interface UnavailableDish {
  name: string;
  missingIngredients: MissingIngredient[];
}

export interface RestaurantContext {
  restaurant: string;
  totalOrders: number;
  availableDishes: number;
  unavailableDishes: number;

  unavailableMenu: string[];

  unavailableDishDetails: UnavailableDish[];

  lowStockIngredients: LowStockIngredient[];
}