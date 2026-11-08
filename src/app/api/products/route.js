// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const maxDuration = 120; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { productData, variants } = body;

    // 1. Simpan produk utama ke Supabase
    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select('id')
      .single();

    if (productError) throw productError;
    const productId = insertedProduct.id;

    // 2. Simpan daftar varian (karena image_url sudah berupa link teks dari frontend)
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const formattedVariants = variants.map((v) => ({
        product_id: productId,
        name: v.name || "Varian",
        price: v.price ? parseFloat(v.price) : 0,
        stock: parseInt(v.stock) || 0,
        weight: v.weight || productData.weight || "250 gram",
        origin: v.origin || productData.origin || "Banyuwangi",
        image_url: v.image_url || "",
        description: v.description || "",
        ingredients: v.ingredients || "",
        key_features: v.key_features || "",
        packaging_standard: v.packaging_standard || "",
        is_popular: v.is_popular || false,
      }));

      const { error: variantError } = await supabase
        .from('variant_products')
        .insert(formattedVariants);

      if (variantError) throw variantError;
    }

    return NextResponse.json({ success: true, message: "Produk & seluruh varian berhasil disimpan!" });
  } catch (error) {
    console.error("Error POST /api/products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, productData, variants } = body;

    // Update produk utama
    const { error: updateError } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Hapus varian lama, lalu masukkan varian baru
    await supabase.from('variant_products').delete().eq('product_id', id);

    if (variants && Array.isArray(variants) && variants.length > 0) {
      const formattedVariants = variants.map((v) => ({
        product_id: id,
        name: v.name || "Varian",
        price: v.price ? parseFloat(v.price) : 0,
        stock: parseInt(v.stock) || 0,
        weight: v.weight || productData.weight || "250 gram",
        origin: v.origin || productData.origin || "Banyuwangi",
        image_url: v.image_url || "",
        description: v.description || "",
        ingredients: v.ingredients || "",
        key_features: v.key_features || "",
        packaging_standard: v.packaging_standard || "",
        is_popular: v.is_popular || false,
      }));

      const { error: variantInsertError } = await supabase
        .from('variant_products')
        .insert(formattedVariants);

      if (variantInsertError) throw variantInsertError;
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui!" });
  } catch (error) {
    console.error("Error PUT /api/products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}