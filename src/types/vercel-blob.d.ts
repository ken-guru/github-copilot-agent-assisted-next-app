declare module '@vercel/blob' {
  export type PutBlobResult = {
    id?: string;
    url?: string;
    // allow other fields
    [key: string]: unknown;
  };

  export function put(name: string, body: BodyInit, opts?: { access?: 'public' | 'private' } & Record<string, unknown>): Promise<PutBlobResult>;

  const _default: { put: typeof put };
  export default _default;
}
