// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name");
    const price = formData.get("price") ? parseFloat(formData.get("price")) : null;
    const category = formData.get("category");
    const weight = formData.get("weight");
    const origin = formData.get("origin");
    const stock = formData.get("stock") ? parseInt(formData.get("stock")) : 0;
    const badge = formData.get("badge");
    const description = formData.get("description");
    const ingredients = formData.get("ingredients");
    const packaging_standard = formData.get("packaging_standard");
    const key_features = formData.get("key_features");
    const is_popular = formData.get("is_popular") === "true";
    const image_url = formData.get("image_url");
    const variantsRaw = formData.get("variants");
    const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

    // 1. Simpan produk utama ke tabel "products"
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name,
          price,
          category,
          weight,
          origin,
          stock,
          badge,
          description,
          ingredients,
          packaging_standard,
          key_features,
          is_popular,
          image_url,
        },
      ])
      .select()
      .single();

    if (productError) throw productError;

    const productId = productData.id;

    // 2. Simpan varian ke tabel "variant_products" jika ada
    if (variants.length > 0) {
      const variantsToInsert = variants.map((v) => ({
        product_id: productId,
        name: v.name,
        price: v.price ? parseFloat(v.price) : 0,
        stock: v.stock ? parseInt(v.stock) : 0,
        weight: v.weight,
        origin: v.origin,
        image_url: v.image_url,
        description: v.description,
        ingredients: v.ingredients,
        key_features: v.key_features,
        packaging_standard: v.packaging_standard,
        is_popular: v.is_popular,
      }));

      const { error: variantError } = await supabase
        .from("variant_products")
        .insert(variantsToInsert);

      if (variantError) throw variantError;
    }

    return NextResponse.json({ success: true, message: "Produk berhasil ditambahkan" });
  } catch (error) {
    console.error("API Error (POST):", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id");
    const name = formData.get("name");
    const price = formData.get("price") ? parseFloat(formData.get("price")) : null;
    const category = formData.get("category");
    const weight = formData.get("weight");
    const origin = formData.get("origin");
    const stock = formData.get("stock") ? parseInt(formData.get("stock")) : 0;
    const badge = formData.get("badge");
    const description = formData.get("description");
    const ingredients = formData.get("ingredients");
    const packaging_standard = formData.get("packaging_standard");
    const key_features = formData.get("key_features");
    const is_popular = formData.get("is_popular") === "true";
    const image_url = formData.get("image_url");
    const variantsRaw = formData.get("variants");
    const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

    // 1. Update data produk utama
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        price,
        category,
        weight,
        origin,
        stock,
        badge,
        description,
        ingredients,
        packaging_standard,
        key_features,
        is_popular,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 2. Refresh varian: Hapus varian lama, lalu masukkan varian yang baru
    await supabase.from("variant_products").delete().eq("product_id", id);

    if (variants.length > 0) {
      const variantsToInsert = variants.map((v) => ({
        product_id: id,
        name: v.name,
        price: v.price ? parseFloat(v.price) : 0,
        stock: v.stock ? parseInt(v.stock) : 0,
        weight: v.weight,
        origin: v.origin,
        image_url: v.image_url,
        description: v.description,
        ingredients: v.ingredients,
        key_features: v.key_features,
        packaging_standard: v.packaging_standard,
        is_popular: v.is_popular,
      }));

      const { error: variantError } = await supabase
        .from("variant_products")
        .insert(variantsToInsert);

      if (variantError) throw variantError;
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui" });
  } catch (error) {
    console.error("API Error (PUT):", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}