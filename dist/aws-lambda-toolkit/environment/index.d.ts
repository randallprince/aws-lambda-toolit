declare class Environment {
    getEnvironmentVar: (name: string) => string;
    setEnvironmentVar: (name: string, value: string) => boolean;
    apiBaseUrl: () => string;
    tableName: () => string;
    serviceName: () => string;
    eventName: () => string;
    isOffline: () => boolean;
}
export declare const env: Environment;
export {};
