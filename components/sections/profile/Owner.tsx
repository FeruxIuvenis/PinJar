import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import React from 'react'

const Owner = ({ profile, user}) => {
    return (
        <Card className='w-full h-full'>
            <CardHeader className='w-full h-fit flex items-center justify-between max-h-65 bg-red-100'>
                <div className='rounded-full overflow-hidden max-h-full aspect-square'>
                    <Image className='w-full h-full object-cover'
                        src={profile?.pfp_url || "/no-pfp.jpg"} alt="Profile Image" width={50} height={50} />
                </div>
                <div className='w-full h-fit flex flex-col items-start justify-center ml-4'>
                    <h1 className='text-3xl font-bold'>{profile?.username}</h1>
                    <p className='text-sm text-gray-500'>
                        Joined on {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
                    </p>
                    <div className='w-fit h-fit flex gap-2 items-center'>
                        <span>56 Pins</span>
                        <span>5 Boards</span>
                        <span>2.3k Followers</span>
                    </div>
                </div>
                <div className='flex items-center justify-end'>
                    <Button className=''>Edit Profile</Button>
                    <Button className='ml-2' variant='outline'>Logout</Button>
                </div>
            </CardHeader>
        </Card>
    )
}

export default Owner