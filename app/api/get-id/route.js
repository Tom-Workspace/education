import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../lib/User';

export async function POST(request) {
    await dbConnect();

    try {
        const { apiKey, username } = await request.json();

        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user._id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
