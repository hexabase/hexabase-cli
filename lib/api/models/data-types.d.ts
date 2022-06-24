declare type DataType = {
    name: string;
    dataType: string;
    unique: boolean;
    asTitle: boolean;
    search: boolean;
    fullText: boolean;
    showList: boolean;
};
export declare const defaults: {
    [key: string]: DataType;
};
export {};
