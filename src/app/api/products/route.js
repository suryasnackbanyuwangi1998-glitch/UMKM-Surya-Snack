// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToDrive } from '@/lib/googleDrive';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
export const maxDuration = 60;

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let body;
    let mainImageUrl = "";
    let variantsList = [];

    // Mendukung pengiriman via JSON (Sangat direkomendasikan untuk banyak varian)
    if (contentType.includes('application/json')) {
      body = await request.json();
      var { productData, variants } = body;
      mainImageUrl = productData.image_url || "";
      variantsList = variants || [];
    } else {
      // Fallback jika masih menggunakan FormData untuk produk utama
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
      const mainImageFile = formData.get('image');

      if (mainImageFile && mainImageFile instanceof File && mainImageFile.size > 0) {
        mainImageUrl = await uploadFileToDrive(mainImageFile);
      }

      const rawVariants = formData.get('variants');
      variantsList = rawVariants ? JSON.parse(rawVariants) : [];

      var productData = {
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
        image_url: mainImageUrl,
      };
    }

    // 1. Simpan produk utama ke Supabase
    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select('id')
      .single();

    if (productError) throw productError;
    const productId = insertedProduct.id;

    // 2. Simpan daftar varian secara langsung (karena image_url sudah berupa link teks)
    if (variantsList.length > 0) {
      const formattedVariants = variantsList.map((v) => ({
        product_id: productId,
        name: v.name,
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

    // Hapus varian lama dan masukkan kembali varian baru
    await supabase.from('variant_products').delete().eq('product_id', id);

    if (variants && variants.length > 0) {
      const formattedVariants = variants.map((v) => ({
        product_id: id,
        name: v.name,
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