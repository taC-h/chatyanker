type effect = () => void;

export type KeyShortCut = {
    up: effect;
    down: effect;
    enter: effect;
};
export type Stack = {
    pointer: number;
    texts: string[];
};

/**
 * Definition of message Signature
 */
export type ipcMsg = {
    del: undefined;
    push: string;
    point: number;
    sync: Stack;
};

/**
 * datatype in the request
 */
/**
 * interface to handle message
 */
export type Recipient<M> = {
    [K in keyof M]: (arg: M[K]) => void;
};
/**
 * send this type by ipcSender
 */
export type Msg<M, K extends keyof M> = {
    request: K;
    data: M[K];
}
/**
 * constructor of Msg
 */
export function msg<M, K extends keyof M>(request: K, data: M[K]): Msg<M, K> {
    return { request, data };
}
type KeyType = string | number | symbol;
export type MsgTypeGurds<M> = {
    [K in KeyType | keyof M]:
        K extends keyof M
            ? ((arg: any) => arg is M[K])
            : undefined;
};

export class isImplMsg<M>{
    constructor(public gurd: MsgTypeGurds<M>) { }
    isImpl(arg: any): arg is Msg<M, keyof M> {
        const ty = typeof arg.request;
        if (ty !== "string" && ty !== "number" && ty !== "symbol") return false;
        const req: KeyType | keyof M = arg.request;
        const gurd = this.gurd[req];
        if (!gurd) return false;
        return gurd(arg.data);
    }
    is<K extends keyof M>(arg: any, k:K): arg is Msg<M,K>{
        if(arg.request!==k) return false;
        return (this.gurd[k] as (arg: any) => arg is M[K])(arg.data);
    }
}

/**
 * helper function to handle Msg
 * @param msg Msg received
 * @param recipient Msg recipient
 */
export function messageHandler<M>(msg: Msg<M, keyof M>, recipient: Recipient<M>) {
    type req = typeof msg.request;
    //safe downcast
    (recipient[msg.request] as (arg: M[req]) => void)(msg.data);
}
