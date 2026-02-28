"use client"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getCurrentUser, getFollowCounts } from '@/lib/auth'
import { ImageIcon, ImagesIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { JarType, PinType, ProfileType } from '@/lib/types'
import EditProfile from '@/components/sections/profile/EditProfile'

const ProfilePage = () => {

    const [profile, setProfile] = React.useState<ProfileType | null>(null)
    const [user, setUser] = React.useState(null)

    const [pfpUrl, setPfpUrl] = useState<string | null>(null)

    const [pins, setPins] = useState<PinType[]>([])
    const [jars, setJars] = useState<JarType[]>([])

    const [counts, setCounts] = useState({ followers: 0, following: 0, friends: 0 })

    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            //@ts-expect-error data;profile doesn't exist on return type of data;user
            const { data, user } = await getCurrentUser() // data is the row from the profiles table, user is the user object from supabase auth
            setUser(user)
            setProfile(data)

            const { followers, following, friends } = await getFollowCounts(user.id)

            // Getting jars and Pins
            const { data: jars, error: jarsError } = await supabase
                .from('jars')
                .select('*')
                .eq('user_id', user.id)
            setJars(jars || [])

            const { data: pins, error: pinsError } = await supabase
                .from('pins')
                .select('*')
                .eq('user_id', user.id)
            setPins(pins || [])

            const { data: pfpData } = await supabase
                .storage
                .from('profile-photos')
                .getPublicUrl(`${user.id}.jpg`)

            setPfpUrl(pfpData?.publicUrl)

            //@ts-expect-error number is not assignable to type number | null
            setCounts({ followers, following, friends })
        }

        fetchUser()
    }, [])

    return (
        <div className='p-12 w-full min-h-screen max-h-screen h-screen'>
            <Card className='w-full h-full'>
                <CardHeader className='w-full h-fit flex items-center justify-between max-h-65 '>
                    <div className='rounded-full overflow-hidden max-h-full aspect-square'>
                        <Image className='w-full h-full object-cover'
                            src={pfpUrl || "/no-pfp.jpg"} alt="Profile Image" width={50} height={50} />
                    </div>
                    <div className='w-full h-fit flex flex-col items-start justify-center ml-4'>
                        <h1 className='h-9 text-3xl font-bold'>{profile?.username}</h1>
                        <p className='text-sm text-gray-500'>
                            Joined on {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
                        </p>
                        <div className='mt-4 w-fit h-fit flex items-start text-xs gap-2'>
                            <span>{counts.friends || 0} Friends</span>
                            <span>{counts.following || 0} Following</span>
                            <span>{counts.followers || 0} Follower</span>
                        </div>
                        <p className='mt-4 wrap-break-word text-xs max-w-100 h-18 text-wrap'>{profile?.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}</p>
                    </div>
                    <div className='flex items-center justify-end'>
                        <EditProfile pfpUrl={pfpUrl} setOriginalProfile={setProfile} originalProfile={profile}/>
                        <Button className='ml-2' variant='outline'>Logout</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className=''>
                        <Button className='text-black' variant={"link"}>
                            <span>{pins.length || 0} Pins</span>
                            <ImageIcon />
                        </Button>
                        <Button className='text-black' variant={"link"}>
                            <span>{jars.length || 0} Jars</span>
                            <ImagesIcon />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfilePage