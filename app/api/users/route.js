import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    await dbConnect();
    
    try {
        const body = await request.json();
        
        // Check required fields
        if (!body.name || !body.email) {
            return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
        }
        
        // Create new user
        const user = await User.create(body);
        
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}



export async function PATCH(request) {
    await dbConnect();

    try {
        const { id, newPassword } = await request.json();

        if (!id || !newPassword) {
            return NextResponse.json({ success: false, message: 'Id and newPassword are required' }, { status: 400 });
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        user.password = newPassword;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}


export async function DELETE(request) {
    await dbConnect();

    try {
        const { id } = await request.json();
        const user = await User.findOneAndDelete({ id });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// // حذف جميع المستخدمين
// export async function DELETE_ALL() {
//     await dbConnect();

//     try {
//         await User.deleteMany({});
//         return NextResponse.json({ success: true, message: 'All users deleted successfully' }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 400 });
//     }
// }
