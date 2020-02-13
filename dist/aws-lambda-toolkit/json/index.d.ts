import StatusCode from 'status-code-enum';
export declare const isParseable: (json: string) => boolean;
export declare const invalidJsonError: {
    statusCode: StatusCode;
    body: string;
};
