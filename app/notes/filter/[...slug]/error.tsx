"use client";

export default function Error({ error }: { error: Error }) {
  return <p>Could not load notes: {error.message}</p>;
}
