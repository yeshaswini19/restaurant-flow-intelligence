import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

/*
GET ALL INGREDIENTS
*/
router.get("/", async (_, res) => {
  try {
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .order("name");

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
CREATE INGREDIENT
*/
router.post("/", async (req, res) => {
  try {
    const { name, unit } = req.body;

    const { data, error } = await supabase
      .from("ingredients")
      .insert([
        {
          name,
          unit,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    await supabase.from("inventory").insert([
      {
        ingredient_id: data.id,
        quantity: 0,
        minimum_quantity: 5,
      },
    ]);

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
UPDATE INGREDIENT
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit } = req.body;

    const { data, error } = await supabase
      .from("ingredients")
      .update({
        name,
        unit,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
DELETE INGREDIENT
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await supabase
      .from("inventory")
      .delete()
      .eq("ingredient_id", id);

    await supabase
      .from("recipes")
      .delete()
      .eq("ingredient_id", id);

    const { error } = await supabase
      .from("ingredients")
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