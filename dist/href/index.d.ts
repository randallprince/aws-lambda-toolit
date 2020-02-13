declare class Href {
    private readonly UUID_REGEX;
    private readonly API_BASE_URL;
    private readonly EVENT_NAME;
    constructor();
    buildHref: (urlType: string, guid: string) => string;
    buildHrefWithService: (urlType: string, guid: string) => string;
    buildIdHref: (urlType: string, guid: string) => string;
    extractId: (href: string) => string | undefined;
    getStringId: (href: string) => string;
    validateHref: (uri: string) => boolean;
    validateTypeGuid: (urlType: string, uri: string) => boolean;
    validateUUID: (uuid: string) => boolean;
}
export declare const href: Href;
export {};
