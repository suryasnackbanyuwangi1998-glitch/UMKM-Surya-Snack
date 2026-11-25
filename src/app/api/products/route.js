// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper pembentuk ID inisial huruf depan (sama persis dengan aturan SQL di Supabase)
function generateAcronymBase(productName) {
  const words = (productName || "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "prd";
  return words.map((w) => w[0]).join("");
}

// Cari ID unik jika akronim baru sudah dipakai produk lain
async function getUniqueProductId(productName, currentId) {
  const base = generateAcronymBase(productName);

  // Jika ID saat ini sudah sesuai pola akronim nama baru (misal "ogm" atau "ogm-2"), pertahankan ID lama
  if (currentId === base || currentId?.startsWith(`${base}-`)) {
    return currentId;
  }

  let candidate = base;
  let counter = 2;

  while (true) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${base}-${counter}`;
    counter++;
  }
}

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

    const oldId = formData.get("id");
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

    // Hitung ID baru berdasarkan inisial huruf depan nama produk yang diedit
    const newId = await getUniqueProductId(name, oldId);

    // 1. Hapus varian lama dulu agar tidak bentrok dengan foreign key jika ID berubah
    await supabase.from("variant_products").delete().eq("product_id", oldId);

    // 2. Update data produk utama (termasuk ID baru jika nama berubah)
    const { error: updateError } = await supabase
      .from("products")
      .update({
        id: newId,
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
      .eq("id", oldId);

    if (updateError) throw updateError;

    // 3. Masukkan kembali varian dengan product_id yang terbaru (newId)
    if (variants.length > 0) {
      const variantsToInsert = variants.map((v) => ({
        product_id: newId,
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

    return NextResponse.json({
      success: true,
      id: newId,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("API Error (PUT):", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}