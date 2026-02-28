export type PinType = {
    id: number,
    title: string,
    description: string,
    image_url: string,
    like_count: number,
    collection_id: number,
    is_deleted: boolean,
    deleted_at: string | null,
    created_at: string,
    comments_enabled: boolean,
}

export type JarType = {
    id: number,
    owner_id: number,
    name: string,
    created_at: string,
    jar_image_url: string,
    jar_pins: PinType[],
}

export type ProfileType = {
    id: number,
    user_id: number,
    is_private: boolean,
    username: string,
    bio: string | null,
    pfp_url: string | null,
    email: string,
}
