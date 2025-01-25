export type TagType = { name: string; value: string };

export type AOProfileType = {
    id: string;
    walletAddress: string;
    displayName: string | null;
    username: string | null;
    bio: string | null;
    avatar: string | null;
    banner: string | null;
    version: string | null;
};

export type ProfileHeaderType = AOProfileType;