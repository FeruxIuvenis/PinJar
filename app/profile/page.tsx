"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { CircuitBoardIcon, ImageIcon, ImagesIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProfilePage = () => {

    const [profile, setProfile] = React.useState(null)
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        const fetchUser = async () => {
            //@ts-expect-error data;profile doesn't exist on return type of data;user
            const { data, user } = await getCurrentUser() // data is the row from the profiles table, user is the user object from supabase auth
            setUser(user)
            setProfile(data)
        }

        fetchUser()
    }, [])

    return (
        <div className='p-12 w-full min-h-screen max-h-screen h-screen'>
            <Card className='w-full h-full'>
                <CardHeader className='w-full h-fit flex items-center justify-between max-h-65 '>
                    <div className='rounded-full overflow-hidden max-h-full aspect-square'>
                        <Image className='w-full h-full object-cover'
                            src={profile?.pfp_url || "/no-pfp.jpg"} alt="Profile Image" width={50} height={50} />
                    </div>
                    <div className='w-full h-fit flex flex-col items-start justify-center ml-4'>
                        <h1 className='text-3xl font-bold'>{profile?.username}</h1>
                        <p className='text-sm text-gray-500'>
                            Joined on {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
                        </p>
                        <div className='mt-4 w-fit h-fit flex items-start text-xs gap-2'>
                            <span>23 Friends</span>
                            <span>34 Following</span>
                            <span>23 Follower</span>
                        </div>
                        <p className='mt-4 text-xs max-w-100 h-18'>{profile?.bio || "No bio"}</p>
                    </div>
                    <div className='flex items-center justify-end'>
                        <Button className=''>Edit Profile</Button>
                        <Button className='ml-2' variant='outline'>Logout</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className=''>
                        <Button className='text-black' variant={"link"}>
                            <span>23 Pins</span>
                            <ImageIcon/>
                        </Button>
                        <Button className='text-black' variant={"link"}>
                            <span>3 Jars</span>
                            <ImagesIcon />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfilePage