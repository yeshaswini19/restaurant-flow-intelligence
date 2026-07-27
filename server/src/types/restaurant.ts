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

export interface InventoryItem {
  current_quantity: number;
  ingredient_id: string;
  ingredient?: {
    id: string;
    name: string;
  }[] | null;
}
export interface RestaurantContext {
  restaurant: string;

  totalOrders: number;

  inventory: InventoryItem[];

  availableDishes: number;

  unavailableDishes: number;

  unavailableMenu: string[];

  unavailableDishDetails: UnavailableDish[];

  lowStockIngredients: LowStockIngredient[];
}