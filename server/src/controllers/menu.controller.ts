import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getMenuItems = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("name");

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  return res.json({
    success: true,
    data,
  });
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;

    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          name,
          description,
          price,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, is_active } = req.body;

    const { data, error } = await supabase
      .from("menu_items")
      .update({
        name,
        description,
        price,
        is_active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await supabase
      .from("recipes")
      .delete()
      .eq("menu_item_id", id);

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};