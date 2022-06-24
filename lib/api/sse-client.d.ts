import EventSource from 'eventsource';
export declare class SSEClient {
    baseUrl: string;
    source: EventSource | null;
    constructor(baseUrl: string);
    connect(url: string): void;
}
