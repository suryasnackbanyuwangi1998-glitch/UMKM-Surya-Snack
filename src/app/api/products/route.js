import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Server Client (gunakan Service Role Key jika ada di env untuk operasi admin)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 1. METHOD POST: TAMBAH PRODUK BARU & VARIAN
// ==========================================
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Ambil data form utama produk
    const name = formData.get('name');
    const price = formData.get('price');
    const category = formData.get('category');
    const weight = formData.get('weight');
    const origin = formData.get('origin');
    const stock = formData.get('stock');
    const badge = formData.get('badge');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const packaging_standard = formData.get('packaging_standard');
    const key_features = formData.get('key_features');
    const is_popular = formData.get('is_popular') === 'true';
    const image_url = formData.get('image_url');
    const variantsRaw = formData.get('variants');

    // Validasi data wajib
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Nama produk wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Insert ke tabel produk utama ('products')
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: price ? parseFloat(price) : null,
          category: category || 'Makanan',
          weight: weight || '250 gram',
          origin: origin || 'Banyuwangi',
          stock: stock ? parseInt(stock) : 0,
          badge: badge || 'Best Seller',
          description: description || '',
          ingredients: ingredients || '',
          packaging_standard: packaging_standard || '',
          key_features: key_features || '',
          is_popular,
          image_url: image_url || '',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (productError) {
      throw new Error('Gagal menyimpan produk ke Supabase: ' + productError.message);
    }

    const newProductId = productData.id;

    // 2. Jika ada varian, parse dan insert ke tabel 'variant_products'
    if (variantsRaw) {
      const variants = JSON.parse(variantsRaw);
      if (Array.isArray(variants) && variants.length > 0) {
        const variantsToInsert = variants.map((v) => ({
          product_id: newProductId,
          name: v.name || '',
          price: v.price ? parseFloat(v.price) : 0,
          stock: v.stock ? parseInt(v.stock) : 0,
          weight: v.weight || '250 gram',
          origin: v.origin || 'Banyuwangi',
          image_url: v.image_url || '',
          description: v.description || '',
          ingredients: v.ingredients || '',
          key_features: v.key_features || '',
          packaging_standard: v.packaging_standard || '',
          is_popular: v.is_popular || false,
        }));

        const { error: variantError } = await supabase
          .from('variant_products')
          .insert(variantsToInsert);

        if (variantError) {
          throw new Error('Gagal menyimpan varian produk: ' + variantError.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Produk dan varian berhasil ditambahkan!',
      data: productData,
    });
  } catch (error) {
    console.error('API Error (POST Product):', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. METHOD PUT: UPDATE PRODUK & VARIAN
// ==========================================
export async function PUT(request) {
  try {
    const formData = await request.formData();

    const id = formData.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID produk tidak ditemukan untuk pembaruan.' },
        { status: 400 }
      );
    }

    const name = formData.get('name');
    const price = formData.get('price');
    const category = formData.get('category');
    const weight = formData.get('weight');
    const origin = formData.get('origin');
    const stock = formData.get('stock');
    const badge = formData.get('badge');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const packaging_standard = formData.get('packaging_standard');
    const key_features = formData.get('key_features');
    const is_popular = formData.get('is_popular') === 'true';
    const image_url = formData.get('image_url');
    const variantsRaw = formData.get('variants');

    // 1. Update data utama produk
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        price: price ? parseFloat(price) : null,
        category: category || 'Makanan',
        weight: weight || '250 gram',
        origin: origin || 'Banyuwangi',
        stock: stock ? parseInt(stock) : 0,
        badge: badge || 'Best Seller',
        description: description || '',
        ingredients: ingredients || '',
        packaging_standard: packaging_standard || '',
        key_features: key_features || '',
        is_popular,
        ...(image_url ? { image_url } : {}), // Hanya update gambar jika ada URL baru
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      throw new Error('Gagal memperbarui produk: ' + updateError.message);
    }

    // 2. Perbarui Varian (Strategi: Hapus varian lama, lalu insert ulang varian baru yang dikirim)
    if (variantsRaw) {
      const variants = JSON.parse(variantsRaw);

      // Hapus varian lama berdasarkan product_id
      await supabase.from('variant_products').delete().eq('product_id', id);

      // Jika ada data varian baru, masukkan kembali
      if (Array.isArray(variants) && variants.length > 0) {
        const variantsToInsert = variants.map((v) => ({
          product_id: id,
          name: v.name || '',
          price: v.price ? parseFloat(v.price) : 0,
          stock: v.stock ? parseInt(v.stock) : 0,
          weight: v.weight || '250 gram',
          origin: v.origin || 'Banyuwangi',
          image_url: v.image_url || '',
          description: v.description || '',
          ingredients: v.ingredients || '',
          key_features: v.key_features || '',
          packaging_standard: v.packaging_standard || '',
          is_popular: v.is_popular || false,
        }));

        const { error: variantInsertError } = await supabase
          .from('variant_products')
          .insert(variantsToInsert);

        if (variantInsertError) {
          throw new Error('Gagal memperbarui varian produk: ' + variantInsertError.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Produk dan varian berhasil diperbarui!',
    });
  } catch (error) {
    console.error('API Error (PUT Product):', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}