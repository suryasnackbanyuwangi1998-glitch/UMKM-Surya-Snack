// src/app/api/settings/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const payload = {
      id: "main",
      store_name: "Surya Snack",
      store_label: body.store_label || "Oleh - Oleh Khas Banyuwangi",
      heritage_title: body.heritage_title || "",
      heritage_subtitle: body.heritage_subtitle || "",
      heritage_desc: body.heritage_desc || "",
      heritage_image_url: body.heritage_image_url || "",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("store_settings")
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Berhasil disimpan", data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}