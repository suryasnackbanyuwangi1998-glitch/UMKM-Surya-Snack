// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const maxDuration = 120; 

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const price = formData.get('price');
    const category = formData.get('category');
    const weight = formData.get('weight');
    const origin = formData.get('origin');
    const stock = formData.get('stock');
    const badge = formData.get('badge');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const packagingStandard = formData.get('packaging_standard');
    const keyFeatures = formData.get('key_features');
    const isPopular = formData.get('is_popular') === 'true';
    const imageUrl = formData.get('image_url') || "";

    // 1. Simpan produk utama ke Supabase
    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: price ? parseFloat(price) : null,
          category,
          weight: weight || "250 gram",
          origin: origin || "Banyuwangi",
          stock: stock ? parseInt(stock) : 0,
          badge: badge || "Best Seller",
          description,
          ingredients,
          packaging_standard: packagingStandard,
          key_features: keyFeatures || "",
          is_popular: isPopular,
          image_url: imageUrl,
        },
      ])
      .select('id')
      .single();

    if (productError) throw productError;
    const productId = insertedProduct.id;

    // 2. Tangani Varian dari FormData
    const rawVariants = formData.get('variants');
    let variantsList = [];

    if (rawVariants && typeof rawVariants === 'string' && rawVariants.trim() !== '' && rawVariants !== '-') {
      try {
        variantsList = JSON.parse(rawVariants);
      } catch (e) {
        console.error("Gagal parse variants JSON:", e);
      }
    }

    if (variantsList.length > 0) {
      const formattedVariants = variantsList.map((v) => ({
        product_id: productId,
        name: v.name || "Varian",
        price: v.price ? parseFloat(v.price) : 0,
        stock: parseInt(v.stock) || 0,
        weight: v.weight || weight || "250 gram",
        origin: v.origin || origin || "Banyuwangi",
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
    const formData = await request.formData();
    
    const id = formData.get('id');
    const name = formData.get('name');
    const price = formData.get('price');
    const category = formData.get('category');
    const weight = formData.get('weight');
    const origin = formData.get('origin');
    const stock = formData.get('stock');
    const badge = formData.get('badge');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const packagingStandard = formData.get('packaging_standard');
    const keyFeatures = formData.get('key_features');
    const isPopular = formData.get('is_popular') === 'true';
    const imageUrl = formData.get('image_url') || "";

    if (!id) {
      return NextResponse.json({ success: false, message: "ID produk tidak ditemukan untuk update." }, { status: 400 });
    }

    // 1. Update produk utama
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        price: price ? parseFloat(price) : null,
        category,
        weight: weight || "250 gram",
        origin: origin || "Banyuwangi",
        stock: stock ? parseInt(stock) : 0,
        badge,
        description,
        ingredients,
        packaging_standard: packagingStandard,
        key_features: keyFeatures || "",
        is_popular: isPopular,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // 2. Hapus varian lama, lalu masukkan varian baru
    const { error: deleteError } = await supabase
      .from('variant_products')
      .delete()
      .eq('product_id', id);

    if (deleteError) throw deleteError;

    const rawVariants = formData.get('variants');
    let variantsList = [];

    if (rawVariants && typeof rawVariants === 'string' && rawVariants.trim() !== '' && rawVariants !== '-') {
      try {
        variantsList = JSON.parse(rawVariants);
      } catch (e) {
        console.error("Gagal parse variants JSON pada PUT:", e);
      }
    }

    if (variantsList.length > 0) {
      const formattedVariants = variantsList.map((v) => ({
        product_id: id,
        name: v.name || "Varian",
        price: v.price ? parseFloat(v.price) : 0,
        stock: parseInt(v.stock) || 0,
        weight: v.weight || weight || "250 gram",
        origin: v.origin || origin || "Banyuwangi",
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