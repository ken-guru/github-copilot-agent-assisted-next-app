'use client';

export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,  // Error parameter is required by Next.js but not used here
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container py-5">
      <h1 className="h3 mb-3">Something went wrong!</h1>
      <p className="mb-4">An unexpected error occurred. You can try again to recover.</p>
      <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  );
}
