import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

router.get("/supabase", async (_req, res) => {
  try {
    const { error } = await supabase
      .from("_non_existing_table_")
      .select("*");

    return res.json({
      success: true,
      connected: true,
      message: "Successfully connected to Supabase.",
      supabaseResponse: error?.message ?? "No error",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export default router;