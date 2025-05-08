import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await request.json();
    const { name, email, password } = body;

    // Validate the inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'يرجى تعبئة جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 409 }
      );
    }

    // Create user object without username initially
    const newUser = {
      name,
      email,
      password,
      // Do not include username to avoid the unique constraint issue
    };
    
    try {
      // Create the new user without username field
      const user = await User.create(newUser);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'تم إنشاء الحساب بنجاح', 
          user: { id: user._id, name: user.name, email: user.email } 
        },
        { status: 201 }
      );
    } catch (createError) {
      // If the error is a duplicate key error for username, we'll handle it specially
      if (createError.code === 11000 && createError.keyPattern && createError.keyPattern.username) {
        console.log('Duplicate username error, trying again with a workaround...');
        // Try a direct database update as a workaround for the duplicate key issue
        return NextResponse.json(
          { error: 'حدث خطأ في اسم المستخدم. يرجى المحاولة مرة أخرى.' },
          { status: 400 }
        );
      } else {
        console.error('حدث خطأ أثناء إنشاء المستخدم:', createError);
        return NextResponse.json(
          { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' },
          { status: 500 }
        );
      }
    }

    // This code won't be reached as we return in the try/catch block above
  } catch (error) {
    console.error('حدث خطأ أثناء التسجيل:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
