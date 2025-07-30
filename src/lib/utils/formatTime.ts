// lib/utils/formatTime.ts
export function formatSecondsToColon(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatSecondsVerbose(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const parts = [];

  if (mins > 0) parts.push(`${mins} ${mins === 1 ? 'minute' : 'minutes'}`);
  if (secs > 0) parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);

  return parts.join(', ');
}
