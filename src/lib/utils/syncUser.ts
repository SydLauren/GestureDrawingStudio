// utils/syncUser.ts
export async function syncUser(user: { id: string; email?: string | null }) {
  await fetch('/api/users/sync', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      email: user.email,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}
