import { dryrun } from "@permaweb/aoconnect";

import { COUNTER } from "../utils/constants";
import { TagType } from "../types";

const counter = process.env.NODE_ENV === 'production' ? COUNTER.production : COUNTER.dev;

export async function totalTaps(): Promise<string> {
    const tags = [{ name: 'Action', value: 'Info' }];

    const response = await dryrun({
        process: counter,
        tags: tags,
    });

    if (response.Messages && response.Messages.length && response.Messages[0].Tags) {
        const Tags: TagType[] = response.Messages[0].Tags;
        const totalTaps = Tags.find((tag: TagType) => tag.name === 'TotalTaps')?.value;
        return totalTaps || "Error Fetching Taps";
    } else {
        return "Error Fetching Taps";
    }
}