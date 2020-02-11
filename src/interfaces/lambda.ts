import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export interface ValidateBasicAuth {
  (userName: string, password: string, event: APIGatewayProxyEvent): boolean;
}

export interface WithBasicAuth {
  (userName: () => string, password: () => string, handler: APIGatewayProxyHandler): APIGatewayProxyHandler;
}

export interface Lambda {
  (event: APIGatewayProxyEvent, context: Context, callback?: LambdaCallback): Promise<APIGatewayProxyResult>;
}

export type LambdaEvent = APIGatewayProxyEvent;
export type LambdaContext = Context;
export type LambdaCallback = APIGatewayProxyCallback;
export type LambdaResult = APIGatewayProxyResult;
