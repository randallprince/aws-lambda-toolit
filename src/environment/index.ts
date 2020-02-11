class Environment {
  public getEnvironmentVar = (name: string): string => {
    if (typeof name !== 'string') {
      throw new Error(`${name as string} is not a valid environment variable`);
    }

    const variable: string = process.env[name] ?? '';

    return variable;
  };

  public setEnvironmentVar = (name: string, value: string): boolean => {
    if (typeof name !== 'string') {
      throw new Error(`${name as string} is not a valid environment variable`);
    }

    if (typeof value !== 'string') {
      throw new Error(`${value as string} is not a valid environment variable value`);
    }

    process.env[name] = value;
    return this.getEnvironmentVar(name) === value;
  };

  public apiBaseUrl = (): string => {
    return this.getEnvironmentVar('API_BASE_URL');
  };

  public tableName = (): string => {
    return this.getEnvironmentVar('TABLE_NAME');
  };

  public serviceName = (): string => {
    return this.getEnvironmentVar('SERVICE_NAME');
  };

  public eventName = (): string => {
    return this.getEnvironmentVar('SERVICE_NAME').toUpperCase();
  };

  public isOffline = (): boolean => {
    return !!process.env.IS_OFFLINE;
  };
}

export const env = new Environment();
