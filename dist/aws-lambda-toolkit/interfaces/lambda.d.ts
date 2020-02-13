import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
export interface ValidateBasicAuth {
    (userName: string, password: string, event: APIGatewayProxyEvent): boolean;
}
export interface WithBasicAuth {
    (userName: () => string, password: () => string, handler: APIGatewayProxyHandler): APIGatewayProxyHandler;
}
export interface Lambda {
    (event: APIGatewayProxyEvent, context: Context, callback?: LambdaCallback): Promise<APIGatewayProxyResult>;
}
export declare type LambdaEvent = APIGatewayProxyEvent;
export declare type LambdaContext = Context;
export declare type LambdaCallback = APIGatewayProxyCallback;
export declare type LambdaResult = APIGatewayProxyResult;
