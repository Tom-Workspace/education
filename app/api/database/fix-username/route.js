import { NextResponse } from 'next/server';
import dropUsernameIndex from '@/app/lib/dropUsernameIndex';

export async function GET() {
  try {
    await dropUsernameIndex();
    return NextResponse.json({ success: true, message: 'تم إصلاح مؤشر اسم المستخدم بنجاح' });
  } catch (error) {
    console.error('خطأ في إصلاح مؤشر اسم المستخدم:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إصلاح مؤشر اسم المستخدم' },
      { status: 500 }
    );
  }
}
