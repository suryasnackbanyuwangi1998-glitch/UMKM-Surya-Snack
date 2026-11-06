// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToDrive } from '@/lib/googleDrive';

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
    const mainImageFile = formData.get('image');

    // 1. Upload gambar utama ke Google Drive jika ada
    let mainImageUrl = "";
    if (mainImageFile && mainImageFile instanceof File && mainImageFile.size > 0) {
      mainImageUrl = await uploadFileToDrive(mainImageFile);
    }

    // 2. Simpan produk utama ke Supabase
    const { data: productData, error: productError } = await supabase
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
          image_url: mainImageUrl,
        },
      ])
      .select('id')
      .single();

    if (productError) throw productError;
    const productId = productData.id;

    // 3. Tangani Varian & Upload Gambar Varian secara PARALEL (PROMISE.ALL)
    const rawVariants = formData.get('variants');
    if (rawVariants) {
      const variantsList = JSON.parse(rawVariants);

      const variantPromises = variantsList.map(async (v, index) => {
        const variantImageFile = formData.get(`variant_image_${index}`);
        let variantImageUrl = v.image_url || "";

        if (variantImageFile && variantImageFile instanceof File && variantImageFile.size > 0) {
          variantImageUrl = await uploadFileToDrive(variantImageFile);
        }

        return {
          product_id: productId,
          name: v.name,
          price: v.price ? parseFloat(v.price) : 0,
          stock: parseInt(v.stock) || 0,
          weight: v.weight || weight || "250 gram",
          origin: v.origin || origin || "Banyuwangi",
          image_url: variantImageUrl,
          description: v.description || "",
          ingredients: v.ingredients || "",
          key_features: v.key_features || "",
          packaging_standard: v.packaging_standard || "",
          is_popular: v.is_popular || false,
        };
      });

      const processedVariants = await Promise.all(variantPromises);

      if (processedVariants.length > 0) {
        const { error: variantError } = await supabase
          .from('variant_products')
          .insert(processedVariants);

        if (variantError) throw variantError;
      }
    }

    return NextResponse.json({ success: true, message: "Produk & varian berhasil disimpan!" });
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
    const oldImageUrl = formData.get('old_image_url');
    const mainImageFile = formData.get('image');

    let mainImageUrl = oldImageUrl;
    if (mainImageFile && mainImageFile instanceof File && mainImageFile.size > 0) {
      mainImageUrl = await uploadFileToDrive(mainImageFile);
    }

    // Update produk utama
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
        image_url: mainImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Kelola ulang varian (Hapus yang lama, masukkan yang baru secara paralel)
    const rawVariants = formData.get('variants');
    if (rawVariants) {
      await supabase.from('variant_products').delete().eq('product_id', id);

      const variantsList = JSON.parse(rawVariants);

      const variantPromises = variantsList.map(async (v, index) => {
        const variantImageFile = formData.get(`variant_image_${index}`);
        let variantImageUrl = v.image_url || "";

        if (variantImageFile && variantImageFile instanceof File && variantImageFile.size > 0) {
          variantImageUrl = await uploadFileToDrive(variantImageFile);
        }

        return {
          product_id: id,
          name: v.name,
          price: v.price ? parseFloat(v.price) : 0,
          stock: parseInt(v.stock) || 0,
          weight: v.weight || weight || "250 gram",
          origin: v.origin || origin || "Banyuwangi",
          image_url: variantImageUrl,
          description: v.description || "",
          ingredients: v.ingredients || "",
          key_features: v.key_features || "",
          packaging_standard: v.packaging_standard || "",
          is_popular: v.is_popular || false,
        };
      });

      const processedVariants = await Promise.all(variantPromises);

      if (processedVariants.length > 0) {
        const { error: variantInsertError } = await supabase
          .from('variant_products')
          .insert(processedVariants);

        if (variantInsertError) throw variantInsertError;
      }
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui!" });
  } catch (error) {
    console.error("Error PUT /api/products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}