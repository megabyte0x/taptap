import { createDataItemSigner, message, spawn, result } from "@permaweb/aoconnect";
import { GATEWAYS, PAGINATORS, CURSORS, assetTags, aaStandard, SUPPORT_TOKENS } from "../utils";
import { QueryArgs, GQLResponse, Status, ProfileHeaderType, MessageResult } from "../types";
import { getProfileByWalletAddress } from "./getProfile";
import indexHtml from '../utils/index.html?raw'
import COUNTER from "../constants/counter_process";

function getQuery(args: QueryArgs) {
    const paginator = args.paginator ? args.paginator : PAGINATORS.default;
    const ids = args.ids ? JSON.stringify(args.ids) : null;
    const tagFilters = args.tagFilters
        ? JSON.stringify(args.tagFilters)
            .replace(/"([^"]+)":/g, '$1:')
            .replace(/"FUZZY_OR"/g, 'FUZZY_OR')
        : null;
    const owners = args.owners ? JSON.stringify(args.owners) : null;
    const cursor = args.cursor && args.cursor !== CURSORS.end ? `"${args.cursor}"` : null;

    const fetchCount = `first: ${paginator}`;
    let txCount = '';
    const nodeFields = `data { size type } owner { address } block { height timestamp }`;
    const order = '';

    switch (args.gateway) {
        case GATEWAYS.arweave:
            break;
        case GATEWAYS.goldsky:
            txCount = `count`;
            break;
    }

    const query = {
        query: `
        query {
          transactions(
            ids: ${ids},
            tags: ${tagFilters},
            ${fetchCount}
            owners: ${owners},
            after: ${cursor},
            ${order}
          ) {
            ${txCount}
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                tags {
                  name 
                  value 
                }
                ${nodeFields}
              }
            }
          }
        }
      `,
    };

    return JSON.stringify(query);
}

async function getGQLData(args: QueryArgs): Promise<GQLResponse> {
    const paginator = args.paginator ? args.paginator : PAGINATORS.default;

    let data = [];
    let count = 0;
    let nextCursor = null;

    if (args.ids && !args.ids.length) {
        return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
    }

    try {
        const response = await fetch(`https://${args.gateway}/graphql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: getQuery(args),
        });
        const responseJson = await response.json();
        if (responseJson.data.transactions.edges.length) {
            data = [...responseJson.data.transactions.edges];
            count = responseJson.data.transactions.count ?? 0;

            const lastResults = data.length < paginator || !responseJson.data.transactions.pageInfo.hasNextPage;

            if (lastResults) nextCursor = CURSORS.end;
            else nextCursor = data[data.length - 1].cursor;

            return {
                data: data,
                count: count,
                nextCursor: nextCursor,
                previousCursor: null,
            };
        } else {
            return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
        }
    } catch (e) {
        console.error(e);
        return { data: data, count: count, nextCursor: nextCursor, previousCursor: null };
    }
}


async function runGQLQuery(processId: string): Promise<GQLResponse> {
    try {
        const gqlResponse = await getGQLData({
            gateway: GATEWAYS.goldsky,
            ids: [processId],
            tagFilters: null,
            owners: null,
            cursor: null,
            reduxCursor: null,
            cursorObjectKey: null,
        });

        // console.log('GraphQL Query Response:', JSON.stringify(gqlResponse, null, 2));
        return gqlResponse;

    } catch (error) {
        console.error('Error running GraphQL query:', error);
        return { data: [], count: 0, nextCursor: null, previousCursor: null };
    }
}

export async function mintAA(walletAddress: string, score: number): Promise<Status> {
    console.log("Start");
    const signer = createDataItemSigner(globalThis.arweaveWallet);
    const status: Status = { success: false, processId: null, message: '' };

    let profile: ProfileHeaderType | null = null;
    try {
        // Step 1: Get Profile
        profile = await getProfileByWalletAddress({ address: walletAddress });
        console.log("Profile:", profile);
    } catch (error: unknown) {
        status.message = "Error while getting profile";
        status.success = false;
        return status;
    }

    if (profile && profile.id && profile.id !== "") {

        const modifiedHtml = indexHtml.replace(
            /\{\{SCORE\}\}/g,  // Added escaping for curly braces
            String(score)
        );

        let processId: string | null = null;

        try {
            // Step 2: Spawn the process
            processId = await spawn({
                module: "bkjb55i07GUCUSWROtKK4HU1mBS_X0TyH3M5jMV6aPg",
                scheduler: "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY",
                signer: signer,
                data: modifiedHtml,
                tags: assetTags(profile.id),
            });

            status.processId = processId;
            status.message = 'Process spawned successfully';

            // Step 2: Poll for process status
            let processFound = false;
            let retryCount = 0;
            const maxRetries = 25;

            while (!processFound && retryCount < maxRetries) {
                console.log(`Checking process status (Attempt ${retryCount + 1}/${maxRetries})...`);
                const gqlResponse = await runGQLQuery(processId);

                if (gqlResponse.data.length > 0) {
                    processFound = true;
                    console.log("Process found in AO.");
                } else {
                    retryCount++;
                    console.log("Process not found. Retrying in 3 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            // If process not found after retries
            if (!processFound) {
                status.message = 'Process creation failed - timeout';
                status.success = false;
                return status;
            }

            console.log("AA spawned: ", processId);

        } catch (error: unknown) {
            console.error("Error while spawning process: ", error);
            status.message = "Error while spawning process";
            status.success = false;
            return status;
        }

        if (processId) {
            let evalResult: MessageResult | null = null;
            try {
                // Step 3: Execute the message (Evaluation)
                const evalMessage = await message({
                    process: processId,
                    signer: signer,
                    tags: [{ name: 'Action', value: 'Eval' }],
                    data: aaStandard(profile.id),
                });

                console.log("Message Executed: ", evalMessage);

                // Step 4: Get the result of the evaluation
                evalResult = await result({
                    message: evalMessage,
                    process: processId,
                });
                console.log("Eval Result:", evalResult);

            } catch (error: unknown) {
                console.error("Error while executing message: ", error);
                status.message = "Error while executing message";
                status.success = false;
                return status;
            }

            try {
                const finalMessage = await message({
                    process: processId,
                    signer: signer,
                    tags: [
                        { name: 'Action', value: 'Add-Asset-To-Profile' },
                        { name: 'ProfileProcess', value: profile.id },
                        { name: 'Quantity', value: "1" },
                    ],
                    data: JSON.stringify({ Id: processId, Quantity: "1" }),
                });
                console.log("Profile Added:", finalMessage);

                status.success = true;
                status.message = 'Process completed successfully';
                return status;
            } catch (error: unknown) {
                console.error("Error while adding profile: ", error);
                status.message = "Error while adding profile";
                status.success = false;
                return status;
            }
        }

        return status;

    } else {
        console.log("Bazaar profile not found");
        status.success = false;
        status.message = 'Bazaar profile not found';
        return status;
    }
}

export async function mintToken(): Promise<string> {
    const signer = createDataItemSigner(globalThis.arweaveWallet);

    const processId = COUNTER;

    const tapMessage = await message({
        process: processId,
        signer: signer,
        tags: [{ name: 'Action', value: 'Increase' }],
    });

    console.log("Tap Message:", tapMessage);
    return tapMessage.toString();
}

export async function support() {
    const signer = createDataItemSigner(globalThis.arweaveWallet);
    const wAR = SUPPORT_TOKENS.wAR;

    const supportMessage = await message({
        process: wAR,
        signer: signer,
        tags: [
            { name: 'Action', value: 'Transfer' },
            { name: 'Recipient', value: "NeViM_xeDSvAloNXLzHDp3qPD5s3XDLu5OGhdt7dW84" },
            { name: 'Quantity', value: "100000000000" }
        ],
        data: "Thanks for supporting!",
    });

    const supportResult = await result({
        message: supportMessage,
        process: wAR,
    });
    console.log("Support Result:", supportResult);
}