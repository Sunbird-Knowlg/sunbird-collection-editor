export interface ContextBase {
    programId?: string;
    contributionOrgId?: string;
    user: User;
    identifier: string;
    mode: string;
    authToken?: string;
    sid: string;
    did: string;
    uid: string;
    channel: string;
    pdata: Pdata;
    contextRollup: ContextRollup;
    tags: string[];
    cdata?: Cdata[];
    timeDiff?: number;
    objectRollup?: ObjectRollup;
    host?: string;
    endpoint?: string;
    userData?: {
        firstName: string;
        lastName: string;
    };
    env: string;
    defaultLicense?: any;
    topic?: any;
    framework: string;
    cloudStorageUrls: string[];
    additionalCategories: any[];
    labels?: any;
    actor?: any;
    channelData?: any;
    correctionComments?: any;
    sourcingResourceStatus?: string;
    sourcingResourceStatusClass?: string;
    collectionIdentifier?: string;
    unitIdentifier?: string;
    collectionObjectType?: string;
    collectionPrimaryCategory?: string;
    targetFWIds?: string[];
    cloudStorage?: any;
}
export interface Context extends ContextBase {
    [key: string]: any;
}
export interface User {
    id: string;
    name: string;
    orgIds: string[];
}
export interface Pdata {
    id: string;
    pid: string;
    ver: string;
}

export interface ContextRollup {
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
}

export interface Cdata {
    type: string;
    id: string;
}

export interface ObjectRollup {
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
}

export interface IEditorConfig {
    context: Context;
    config: any;
    metadata?: any;
    data?: any;
}
