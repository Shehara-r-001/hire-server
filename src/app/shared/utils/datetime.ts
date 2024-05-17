import { DateTime } from 'luxon';

export const getCurrentTime = () => DateTime.local();

export const getZonedTime = (datetime: string, zone = 'utc+5:30') => {
  const dt = DateTime.fromISO(datetime, { zone });
  return dt.toFormat('yyyy-MM-dd HH:mm:ss.SSSZZ');
};
