export declare class Poller {
    private _attempts;
    private _maxAttempts;
    constructor(maxAttempts: number);
    poll(fn: any, retryCondition: (arg: any) => boolean, ms: number): Promise<any>;
}
