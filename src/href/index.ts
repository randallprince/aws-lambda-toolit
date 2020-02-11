import { env } from '../environment';

class Href {
  private readonly UUID_REGEX: RegExp;
  private readonly API_BASE_URL: () => string;
  private readonly EVENT_NAME: () => string;

  constructor() {
    this.UUID_REGEX = new RegExp(/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i);
    this.API_BASE_URL = (): string => env.apiBaseUrl();
    this.EVENT_NAME = (): string => env.eventName();
  }

  public buildHref = (urlType: string, guid: string): string => {
    if (typeof urlType !== 'string') {
      throw new Error(`Type is not a valid string`);
    }

    if (typeof guid !== 'string') {
      throw new Error(`GUID is not a valid string`);
    }
    return `${this.API_BASE_URL()}/${urlType}/${guid}`;
  };

  public buildHrefWithService = (urlType: string, guid: string): string => {
    if (typeof urlType !== 'string') {
      throw new Error(`Type is not a valid string`);
    }

    if (typeof guid !== 'string') {
      throw new Error(`GUID is not a valid string`);
    }
    return `${this.API_BASE_URL()}${this.EVENT_NAME()}/${urlType}/${guid}`;
  };

  public buildIdHref = (urlType: string, guid: string): string => {
    if (typeof urlType !== 'string') {
      throw new Error(`Type is not a valid string`);
    }

    if (typeof guid !== 'string') {
      throw new Error(`guid is not a valid string`);
    }

    return `${this.API_BASE_URL()}/${urlType}/id/${guid}`;
  };

  public extractId = (href: string): string | undefined => {
    if (typeof href !== 'string') {
      throw new Error(`Href is not a valid string`);
    }

    const match = this.UUID_REGEX.exec(href);

    return match ? match[1] : undefined;
  };

  public getStringId = (href: string): string => {
    if (typeof href !== 'string') {
      throw new Error(`Href is not a valid string`);
    }
    const match = this.UUID_REGEX.exec(href);

    return match ? match?.[1] : '';
  };

  // if the regex fails and the pattern is not found (result === null), the function fails and returns false
  public validateHref = (uri: string): boolean => {
    const regex = new RegExp('([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$', 'i');

    const urlSplit = uri.split(/\//).pop();

    if (urlSplit !== undefined) {
      const result = regex.exec(urlSplit);

      if (result === null) {
        return false;
      }
    }

    return true;
  };

  // if the regex fails and the pattern is not found (result === null), the function fails and returns false
  public validateTypeGuid = (urlType: string, uri: string): boolean => {
    const regex = new RegExp(`(.*)/${urlType.replace('/', '/')}/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$`, 'i');

    return regex.exec(uri) !== null;
  };

  public validateUUID = (uuid: string): boolean => {
    return this.UUID_REGEX.exec(uuid) !== null;
  };
}

export const href = new Href();
