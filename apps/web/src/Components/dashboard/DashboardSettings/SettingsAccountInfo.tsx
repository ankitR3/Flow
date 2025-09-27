'use client'

import { GET_USERNAME_URL, UPDATE_USERNAME_URL } from '@/routes/api-routes';
import { useUserSessionStore } from '@/src/store/useUserSessionStore'
import UserInfoDisplay from '@/src/utility/UserInfoDisplay';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function SettingsAccountInfo() {
    const { session } = useUserSessionStore();

    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsername = async () => {
            if (!session?.user?.id) {
                return;
            }

            try {
                const response = await axios.get(GET_USERNAME_URL, {
                    params: { userId: session.user.id},
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                })

                const fetchedUsername = response.data.username;
                setUsername(fetchedUsername);
                setNewUsername(fetchedUsername);
            } catch (err) {
                console.error('Failed to fetch username: ', err);
            }
        };

        fetchUsername();
    }, [session]);

    const handleUpdateUsername = async () => {
        if (!session || !newUsername || newUsername === username) {
            return;
        }

        try {
            const response = await axios.post(
                UPDATE_USERNAME_URL,
                {
                    userId: session.user.id,
                    username: newUsername,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }
            );

            const resUsername = response.data.updateUsername;
            setUsername(resUsername);
            setNewUsername(resUsername);
            setEditing(false);
        } catch (err) {
            console.error('Username update failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setNewUsername(username);
        setEditing(false);
    };

    return (
        <div>
            <UserInfoDisplay
                session={session}
                username={username}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                editing={editing}
                setEditing={setEditing}
                loading={loading}
                handleUpdateUsername={handleUpdateUsername}
                handleCancelEdit={handleCancelEdit}
            />
        </div>
    );
}