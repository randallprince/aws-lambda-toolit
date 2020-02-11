export interface CreateResponse {
  createdHref: string;
}

interface TablenameRequestService<T = any, U = any> {
  (tableName: string, request: T): Promise<U>;
}

interface TablenameIdService<T = boolean> {
  (tableName: string, id: string): Promise<T>;
}

interface TablenameUnitidService<T = any> {
  (tableName: string, unitId: string): Promise<T>;
}

interface FullObjectService<T = any, U = any> {
  (tableName: string, id: string, request: T, unitId?: string): Promise<U>;
}

export type DeleteService<T = boolean> = TablenameIdService<T>;
export type UpdateService<T = any, U = any> = FullObjectService<T, U>;
export type CreateService<T = any, U = CreateResponse> = TablenameRequestService<T, U>;
export type GetByIdService<T = any> = TablenameIdService<T>;
export type GetByUnitIdService<T = any> = TablenameUnitidService<T>;
