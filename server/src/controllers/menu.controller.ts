import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getMenuItems = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*");

  if (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }

  return res.json({
    success: true,
    data,
  });
};