'use client';

export default function ClientPage({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
