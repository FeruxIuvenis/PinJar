"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { profile } from 'console'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const EditProfile = ({ pfpUrl, originalProfile, setOriginalProfile }) => {
    const [open, setOpen] = useState(false);
    const [editedProfile, setEditedProfile] = useState(originalProfile);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

    useEffect(() => {
        setEditedProfile(originalProfile);
        setPreviewUrl(null);
        setProfilePicFile(null);
    }, [originalProfile]);

    const handleChange = (field, value) => {
        setEditedProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const supabase = createClient();

        try {
            if (profilePicFile) {
                const { user } = await getCurrentUser();
                const fileName = `${user.id}.jpg`;

                const { data: deleteData, error: deleteError } = await supabase.storage
                    .from('profile-photos')
                    .remove([fileName]);

                if (deleteError) {
                    toast.error("Failed to delete old profile picture. Please try again.");
                    return;
                }

                // Insert new file
                const { error: uploadError } = await supabase.storage
                    .from('profile-photos')
                    .upload(fileName, profilePicFile, {
                        contentType: profilePicFile.type,
                    });

                if (uploadError) {
                    toast.error("Failed to upload profile picture. Please try again.");
                    return;
                }

                const { data: publicUrlData } = supabase.storage
                    .from('profile-photos')
                    .getPublicUrl(fileName);

                editedProfile.pfp_url = publicUrlData.publicUrl;
            }

            if (JSON.stringify(editedProfile) !== JSON.stringify(originalProfile)) {
                const { error } = await supabase
                    .from('profiles')
                    .update(editedProfile)
                    .eq('id', editedProfile.id);

                if (error) {
                    toast.error("Failed to update profile. Please try again.");
                    return;
                }
            }

            toast.success("Profile updated successfully!");
            setOriginalProfile(editedProfile);
            setOpen(false);
            setPreviewUrl(null);
            setProfilePicFile(null);

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full'>
                <DialogTitle>
                    Edit Profile
                </DialogTitle>
                <form onSubmit={handleSubmit} className='max-w-full h-fit flex flex-col gap-4'>
                    <div className='w-full h-fit flex items-center justify-start gap-4'>
                        <ProfilePicture
                            currentPfp={pfpUrl}
                            previewUrl={previewUrl}
                            setPreviewUrl={setPreviewUrl}
                            setProfilePicFile={setProfilePicFile}
                        />
                        <div className='w-full flex flex-col items-start gap-4'>
                            <div className='flex flex-col max-w-full h-fit gap-2'>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={editedProfile?.username}
                                    onChange={e => handleChange('username', e.target.value)}
                                    autoFocus={false}
                                />
                            </div>
                            <div className='flex flex-col max-w-full h-fit gap-2'>
                                <Label htmlFor="Private"><span className='w-12'>{!editedProfile?.is_private ? "Private" : "Public"}</span></Label>
                                <SwitchPrimitive.Root
                                    data-slot="switch"
                                    className={cn(
                                        'cursor-pointer h-8 w-14 peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                                    )}
                                    checked={editedProfile?.is_private}
                                    onCheckedChange={val => handleChange('is_private', val)}
                                >
                                    <SwitchPrimitive.Thumb
                                        data-slot="switch-thumb"
                                        className={
                                            'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+2px)] data-[state=unchecked]:translate-x-1'
                                        }
                                    />
                                </SwitchPrimitive.Root>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col max-w-full h-fit gap-2'>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            maxLength={335}
                            value={editedProfile?.bio || ''}
                            onChange={e => handleChange('bio', e.target.value)}
                            className="w-full min-w-0 break-all whitespace-pre-wrap h-30"
                        />
                    </div>
                    <div className=''>
                        <Button type='submit' className='ml-auto'>Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditProfile

const ProfilePicture = ({ currentPfp, previewUrl, setPreviewUrl, setProfilePicFile }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setPreviewUrl(ev.target.result as string);
            reader.readAsDataURL(file);
        }
    };

    // previewUrl (newly chosen) takes priority, then existing DB photo, then fallback
    const displayImage = previewUrl ?? currentPfp ?? "/no-pfp.jpg";

    return (
        <div className='shrink-0 w-24 h-24 relative overflow-hidden rounded-full'>
            <input
                type="file"
                id="pfp_url"
                className='hidden'
                accept="image/*"
                onChange={handleFileChange}
            />
            <Label htmlFor="pfp_url" className='shrink-0 cursor-pointer flex w-24 h-24 relative items-center justify-center group'>
                <Image
                    src={displayImage}
                    fill
                    alt='Profile Picture'
                    className='object-cover w-24 h-24'
                />
                <div className="shrink-0 absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center w-24 h-24">
                    <span className="text-white text-xs text-center font-semibold">Change</span>
                </div>
            </Label>
        </div>
    );
};