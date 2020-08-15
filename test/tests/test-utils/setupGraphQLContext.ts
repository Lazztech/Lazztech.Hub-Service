import { IMyContext } from 'test/tests/test-utils/context.interface';

export const contextSetup = (): IMyContext => {
  const cookies: { [key: string]: any } = [];
  const myContext = {
    req: {
      cookies,
    } as any,
    res: {
      cookie(cookieName: string, cookie: any) {
        cookies[cookieName] = cookie;
      },
    } as any,
  };
  return myContext;
};
