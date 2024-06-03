export enum PAYLOAD_STATUS {
  FAIL = 'FAIL',
  SUCCESS = 'SUCCESS',
}

export interface IPayload<T> {
  status: PAYLOAD_STATUS;
  message: string | null;
  data: T;
}
