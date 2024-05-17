export enum PAYLOAD_STATUS {
  FAIL = 'FAIL',
  SUCCESS = 'SUCCESS',
}

export interface Payload<T> {
  status: PAYLOAD_STATUS;
  message: string | null;
  data: T;
}
