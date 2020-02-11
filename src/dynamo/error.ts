export class DynamoDBError extends Error {
  public code?: string;
  constructor(message: string, code?: string) {
    super(message);
    if (code) {
      this.code = code;
    }
    this.name = 'DynamoDBError';
  }
}
