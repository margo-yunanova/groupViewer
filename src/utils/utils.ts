export const getResponseAfterDelay = <T>(res: T, ms: number): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(res), ms);
  });
