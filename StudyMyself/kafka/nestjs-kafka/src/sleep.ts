import { time } from 'console';
import { resolve } from 'path';

export const sleep = (timeout: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout   ));
};
