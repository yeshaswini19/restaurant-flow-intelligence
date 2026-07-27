import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

/*
GET ALL RECIPES
*/
router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(`
        id,
        quantity_required,
        menu_items(name),
        ingredients(name)
      `)
      .order("id");

    if (error) throw error;

    const recipes =
      data?.map((recipe: any) => ({
        id: recipe.id,
        quantity_required: recipe.quantity_required,
        menu_item_name: recipe.menu_items?.name,
        ingredient_name: recipe.ingredients?.name,
      })) || [];

    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
CREATE RECIPE
*/
router.post("/", async (req, res) => {
  try {
    const {
      menu_item_id,
      ingredient_id,
      quantity_required,
    } = req.body;

    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          menu_item_id,
          ingredient_id,
          quantity_required,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
DELETE RECIPE
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;