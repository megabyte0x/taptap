import { dryrun } from "@permaweb/aoconnect";
import { TagType, ProfileHeaderType } from "../types";
import { AO } from "../utils/constants";

async function readHandler(args: {
    processId: string;
    action: string;
    tags?: TagType[];
    data?: any;
}): Promise<any> {
    const tags = [{ name: 'Action', value: args.action }];
    if (args.tags) tags.push(...args.tags);
    const data = JSON.stringify(args.data || {});

    const response = await dryrun({
        process: args.processId,
        tags: tags,
        data: data,
    });

    if (response.Messages && response.Messages.length) {
        if (response.Messages[0].Data) {
            return JSON.parse(response.Messages[0].Data);
        } else {
            if (response.Messages[0].Tags) {
                return response.Messages[0].Tags.reduce((acc: any, item: any) => {
                    acc[item.name] = item.value;
                    return acc;
                }, {});
            }
        }
    }
}

export async function getProfileByWalletAddress(args: { address: string }): Promise<ProfileHeaderType | null> {
    const emptyProfile: ProfileHeaderType = {
        id: "",
        walletAddress: args.address,
        displayName: "",
        username: "",
        bio: "",
        avatar: "",
        banner: "",
        version: "",
    };

    try {
        const profileLookup = await readHandler({
            processId: AO.profileRegistry,
            action: 'Get-Profiles-By-Delegate',
            data: { Address: args.address },
        });

        let activeProfileId: string | null = null;
        if (profileLookup && profileLookup.length > 0 && profileLookup[0].ProfileId) {
            activeProfileId = profileLookup[0].ProfileId;
        }

        if (activeProfileId) {
            const fetchedProfile = await readHandler({
                processId: activeProfileId,
                action: 'Info',
                data: null,
            });

            if (fetchedProfile) {
                return {
                    id: activeProfileId,
                    walletAddress: fetchedProfile.Owner || null,
                    displayName: fetchedProfile.Profile.DisplayName || null,
                    username: fetchedProfile.Profile.UserName || null,
                    bio: fetchedProfile.Profile.Description || null,
                    avatar: fetchedProfile.Profile.ProfileImage || null,
                    banner: fetchedProfile.Profile.CoverImage || null,
                    version: fetchedProfile.Profile.Version || null,
                };
            } else return emptyProfile;
        } else return emptyProfile;
    } catch (e: any) {
        throw new Error(e);
    }
}