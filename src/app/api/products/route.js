import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToDrive } from '@/lib/googleDrive';

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

    // 1. Upload Gambar Utama ke Google Drive jika ada
    let mainImageId = "";
    const mainImageFile = formData.get('mainImage');
    if (mainImageFile && typeof mainImageFile === 'object' && mainImageFile.size > 0) {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      mainImageId = await uploadFileToDrive(buffer, mainImageFile.name, mainImageFile.type);
    }

    // 2. Simpan produk utama ke Supabase
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
          image_url: mainImageId, // Menyimpan Google Drive File ID
        },
      ])
      .select('id')
      .single();

    if (productError) throw productError;
    const productId = insertedProduct.id;

    // 3. Tangani Varian & Upload Gambar Varian ke Google Drive
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
      const formattedVariants = await Promise.all(
        variantsList.map(async (v, index) => {
          let variantImgId = v.image_url || "";
          const variantFile = formData.get(`variantImage_${index}`);
          
          if (variantFile && typeof variantFile === 'object' && variantFile.size > 0) {
            const bytes = await variantFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            variantImgId = await uploadFileToDrive(buffer, variantFile.name, variantFile.type);
          }

          return {
            product_id: productId,
            name: v.name || "Varian",
            price: v.price ? parseFloat(v.price) : 0,
            stock: parseInt(v.stock) || 0,
            weight: v.weight || weight || "250 gram",
            origin: v.origin || origin || "Banyuwangi",
            image_url: variantImgId,
            description: v.description || "",
            ingredients: v.ingredients || "",
            key_features: v.key_features || "",
            packaging_standard: v.packaging_standard || "",
            is_popular: v.is_popular || false,
          };
        })
      );

      const { error: variantError } = await supabase
        .from('variant_products')
        .insert(formattedVariants);

      if (variantError) throw variantError;
    }

    return NextResponse.json({ success: true, message: "Produk & varian berhasil disimpan ke Google Drive!" });
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
    const existingImageUrl = formData.get('existing_image_url') || "";

    if (!id) {
      return NextResponse.json({ success: false, message: "ID produk tidak ditemukan untuk update." }, { status: 400 });
    }

    // 1. Upload Gambar Utama Baru atau Pertahankan yang Lama
    let mainImageId = existingImageUrl;
    const mainImageFile = formData.get('mainImage');
    if (mainImageFile && typeof mainImageFile === 'object' && mainImageFile.size > 0) {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      mainImageId = await uploadFileToDrive(buffer, mainImageFile.name, mainImageFile.type);
    } else if (!mainImageId) {
      const { data: oldProd } = await supabase.from('products').select('image_url').eq('id', id).single();
      if (oldProd) mainImageId = oldProd.image_url || "";
    }

    // 2. Update produk utama di Supabase
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
        image_url: mainImageId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Ambil data varian lama untuk mapping gambar jika tidak diganti
    const { data: oldVariants } = await supabase
      .from('variant_products')
      .select('name, image_url')
      .eq('product_id', id);

    const oldVariantMap = new Map();
    if (oldVariants) {
      oldVariants.forEach(ov => {
        if (ov.name) oldVariantMap.set(ov.name.trim().toLowerCase(), ov.image_url);
      });
    }

    // 3. Hapus varian lama
    const { error: deleteError } = await supabase
      .from('variant_products')
      .delete()
      .eq('product_id', id);

    if (deleteError) throw deleteError;

    // 4. Proses varian baru & upload gambarnya ke Drive jika ada file baru
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
      const formattedVariants = await Promise.all(
        variantsList.map(async (v, index) => {
          let variantImgId = v.image_url || "";
          const variantFile = formData.get(`variantImage_${index}`);

          if (variantFile && typeof variantFile === 'object' && variantFile.size > 0) {
            const bytes = await variantFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            variantImgId = await uploadFileToDrive(buffer, variantFile.name, variantFile.type);
          } else if (!variantImgId || variantImgId.startsWith("blob:")) {
            const matchKey = v.name ? v.name.trim().toLowerCase() : "";
            if (oldVariantMap.has(matchKey)) {
              variantImgId = oldVariantMap.get(matchKey);
            }
          }

          return {
            product_id: id,
            name: v.name || "Varian",
            price: v.price ? parseFloat(v.price) : 0,
            stock: parseInt(v.stock) || 0,
            weight: v.weight || weight || "250 gram",
            origin: v.origin || origin || "Banyuwangi",
            image_url: variantImgId,
            description: v.description || "",
            ingredients: v.ingredients || "",
            key_features: v.key_features || "",
            packaging_standard: v.packaging_standard || "",
            is_popular: v.is_popular || false,
          };
        })
      );

      const { error: variantInsertError } = await supabase
        .from('variant_products')
        .insert(formattedVariants);

      if (variantInsertError) throw variantInsertError;
    }

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui dengan Google Drive!" });
  } catch (error) {
    console.error("Error PUT /api/products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}