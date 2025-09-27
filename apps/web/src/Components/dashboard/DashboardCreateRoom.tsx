'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { CREATE_ROOM_URL } from '@/routes/api-routes';
import { useUserSessionStore } from '@/src/store/useUserSessionStore';
import { useWebSocket } from '@/src/hooks/useSocket';

export default function DashboardCreateRoom() {
    const { session, isLoading, setSession } = useUserSessionStore();
    const { subscribe } = useWebSocket();

    // useEffect(() => {
    //     // Temporary mock session for testing
    //     const mockSession = {
    //         user: {
    //             id: 'test-user-id',
    //             name: 'Test User',
    //             email: 'test@example.com',
    //             token: 'mock-token'
    //         },
    //         expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    //     };
        
    //     setSession(mockSession);
    // }, [setSession]);

    // console.log('Session state:', { session, isLoading });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPrivate: false,
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('session is: ', session);
        e.preventDefault();

        if (!session?.user?.id) {
            return;
        }

        console.log('session id is: ', session.user.id);
        try {
            const payload = {
                userId: session.user.id,
                ...formData
            };

            console.log('before post');
            const response = await axios.post(CREATE_ROOM_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.token}`
                },
            });

            console.log('room data is: ', response);
            const roomId = response.data.room.id;
            console.log('room-id is: ', roomId);
            subscribe(roomId, session.user.id);

        } catch (err: any) {
            console.log('Error creating room: ', err);
        }
    };

    if (isLoading || !session?.user?.id) {
        return (
            <div className='h-full w-full flex justify-center items-center p-4'>
                <Card className='w-full max-w-md p-6 text-center'>
                    <p className='text-muted-foregroud'>Loading session...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex justify-center items-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Create a Room</CardTitle>
                                <CardDescription className="mt-2 mb-5">
                                    Enter details to create your own chat room
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="private">Private</Label>
                                <Switch
                                    id="private"
                                    checked={formData.isPrivate}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, isPrivate: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Room Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter room name"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Optional description"
                            />
                        </div>

                        {formData.isPrivate && (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter room password"
                                    required
                                />
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="mt-6 justify-center">
                        <Button
                            className="font-sans font-light text-md hover:-translate-y-0.5"
                            type="submit"
                        >
                            <span className="px-2">Create Room</span>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}