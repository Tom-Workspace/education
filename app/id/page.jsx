"use client"

import { useState } from 'react';
import axios from 'axios';

export default function GetId() {
    const [apiKey, setApiKey] = useState('');
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const handleGetId = async () => {
        try {
            setError('');
            const response = await axios.post('/api/get-id', {
                apiKey,
                username,
            });

            setUserId(response.data.data);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Something went wrong');
            } else {
                setError('Failed to fetch user ID');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Get User ID</h1>
            <div className="mb-4">
                <label className="block mb-2">API Key:</label>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <button
                onClick={handleGetId}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Get ID
            </button>
            {userId && (
                <div className="mt-4 p-4 bg-green-100">
                    <strong>User ID:</strong> {userId}
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
