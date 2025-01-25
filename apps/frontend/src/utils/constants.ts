export const GATEWAYS = {
    arweave: 'arweave.net',
    goldsky: 'arweave-search.goldsky.com',
};
export const PAGINATORS = {
    default: 100,
    version: 8,
    assetTable: 10,
};

export const CURSORS = {
    p1: 'P1',
    end: 'END',
};

export const AO = {
    ucm: 'U3TjJAZWJjlWBB4KAXSHKzuky81jtyh0zqH8rUL4Wd0',
    ucmActivity: 'SNDvAf2RF-jhPmRrGUcs_b1nKlzU6vamN9zl0e9Zi4c',
    profileRegistry: 'SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY',
};

export const SUPPORT_TOKENS = {
    wAR: 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10'
}

export const TAGS = {
    keys: {
        ans110: {
            title: 'Title',
            description: 'Description',
            topic: 'Topic:*',
            type: 'Type',
            implements: 'Implements',
            license: 'License',
        },
        appName: 'App-Name',
        avatar: 'Avatar',
        banner: 'Banner',
        channelTitle: 'Channel-Title',
        collectionId: 'Collection-Id',
        collectionName: 'Collection-Name',
        contentLength: 'Content-Length',
        contentType: 'Content-Type',
        contractManifest: 'Contract-Manifest',
        contractSrc: 'Contract-Src',
        creator: 'Creator',
        currency: 'Currency',
        dataProtocol: 'Data-Protocol',
        dataSource: 'Data-Source',
        dateCreated: 'Date-Created',
        handle: 'Handle',
        initState: 'Init-State',
        initialOwner: 'Initial-Owner',
        license: 'License',
        name: 'Name',
        profileCreator: 'Profile-Creator',
        profileIndex: 'Profile-Index',
        protocolName: 'Protocol-Name',
        renderWith: 'Render-With',
        smartweaveAppName: 'App-Name',
        smartweaveAppVersion: 'App-Version',
        target: 'Target',
        thumbnail: 'Thumbnail',
        topic: (topic: string) => `topic:${topic}`,
        udl: {
            accessFee: 'Access-Fee',
            commercialUse: 'Commercial-Use',
            dataModelTraining: 'Data-Model-Training',
            derivations: 'Derivations',
            paymentAddress: 'Payment-Address',
            paymentMode: 'Payment-Mode',
        },
    },
    values: {
        ansVersion: 'ANS-110',
        collection: 'AO-Collection',
        comment: 'comment',
        document: 'Document',
        followDataProtocol: 'Follow',
        license: 'dE0rmDfl9_OWjkDznNEXHaSO_JohJkRolvMzaCroUdw',
        licenseCurrency: 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10',
        profileVersions: {
            '1': 'Account-0.3',
        },
        ticker: 'ATOMIC ASSET',
        title: (title: string) => `${title}`,
    },
};