import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToDrive } from '@/lib/googleDrive';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const productId = formData.get('product_id');
    const id = formData.get('id');
    const name = formData.get('name');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const description = formData.get('description');

    const imageFile = formData.get('image');
    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadFileToDrive(imageFile);
    }

    const { data, error } = await supabase
      .from('variant_products')
      .insert([
        {
          id,
          product_id: productId,
          name,
          price: price ? parseFloat(price) : null,
          stock: stock ? parseInt(stock) : 0,
          description,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Varian berhasil ditambahkan & gambar masuk ke Google Drive!',
      data: data[0],
    });
  } catch (error) {
    console.error('Error API Variants:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}