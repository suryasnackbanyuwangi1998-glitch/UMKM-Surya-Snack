// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

async function parsePayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const formData = await request.formData();
  const variantsRaw = formData.get("variants");
  return {
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price") ? parseFloat(formData.get("price")) : null,
    category: formData.get("category"),
    weight: formData.get("weight"),
    origin: formData.get("origin"),
    stock: formData.get("stock") ? parseInt(formData.get("stock")) : 0,
    badge: formData.get("badge"),
    description: formData.get("description"),
    ingredients: formData.get("ingredients"),
    packaging_standard: formData.get("packaging_standard"),
    key_features: formData.get("key_features"),
    is_popular: formData.get("is_popular") === "true",
    image_url: formData.get("image_url"),
    variants: variantsRaw ? JSON.parse(variantsRaw) : [],
  };
}

export async function POST(request) {
  try {
    const body = await parsePayload(request);
    const {
      name,
      price = null,
      category,
      weight,
      origin,
      stock = 0,
      badge,
      description,
      ingredients,
      packaging_standard,
      key_features,
      is_popular = false,
      image_url = "",
      variants = [],
    } = body;

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: price !== null && price !== "" ? Number(price) : null,
          category,
          weight,
          origin,
          stock: Number(stock) || 0,
          badge,
          description,
          ingredients,
          packaging_standard,
          key_features,
          is_popular: Boolean(is_popular),
          image_url,
        },
      ])
      .select("id")
      .single();

    if (productError) throw productError;

    const validVariants = Array.isArray(variants)
      ? variants.filter((v) => v && String(v.name || "").trim() !== "")
      : [];

    if (validVariants.length > 0) {
      const variantsToInsert = validVariants.map((v) => ({
        product_id: productData.id,
        name: v.name,
        price: v.price ? Number(v.price) : 0,
        stock: v.stock ? Number(v.stock) : 0,
        weight: v.weight,
        origin: v.origin,
        image_url: v.image_url,
        description: v.description,
        ingredients: v.ingredients,
        key_features: v.key_features,
        packaging_standard: v.packaging_standard,
        is_popular: Boolean(v.is_popular),
      }));

      const { error: variantError } = await supabase
        .from("variant_products")
        .insert(variantsToInsert);

      if (variantError) throw variantError;
    }

    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin/produk");

    return NextResponse.json({
      success: true,
      id: productData.id,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    console.error("API Error (POST):", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await parsePayload(request);
    const {
      id,
      name,
      price = null,
      category,
      weight,
      origin,
      stock = 0,
      badge,
      description,
      ingredients,
      packaging_standard,
      key_features,
      is_popular = false,
      image_url = "",
      variants = [],
    } = body;

    // Jalankan update produk utama dan hapus varian lama secara paralel
    const [updateRes, deleteVarRes] = await Promise.all([
      supabase
        .from("products")
        .update({
          name,
          price: price !== null && price !== "" ? Number(price) : null,
          category,
          weight,
          origin,
          stock: Number(stock) || 0,
          badge,
          description,
          ingredients,
          packaging_standard,
          key_features,
          is_popular: Boolean(is_popular),
          image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id),
      supabase.from("variant_products").delete().eq("product_id", id),
    ]);

    if (updateRes.error) throw updateRes.error;
    if (deleteVarRes.error) throw deleteVarRes.error;

    const validVariants = Array.isArray(variants)
      ? variants.filter((v) => v && String(v.name || "").trim() !== "")
      : [];

    if (validVariants.length > 0) {
      const variantsToInsert = validVariants.map((v) => ({
        product_id: id,
        name: v.name,
        price: v.price ? Number(v.price) : 0,
        stock: v.stock ? Number(v.stock) : 0,
        weight: v.weight,
        origin: v.origin,
        image_url: v.image_url,
        description: v.description,
        ingredients: v.ingredients,
        key_features: v.key_features,
        packaging_standard: v.packaging_standard,
        is_popular: Boolean(v.is_popular),
      }));

      const { error: variantError } = await supabase
        .from("variant_products")
        .insert(variantsToInsert);

      if (variantError) throw variantError;
    }

    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath(`/katalog/${id}`);
    revalidatePath("/admin/produk");

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui" });
  } catch (error) {
    console.error("API Error (PUT):", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}