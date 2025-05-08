import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';

export async function GET() {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.email !== 'ahmedmohamedmmm39@gmail.com') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get all users
    const users = await User.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
