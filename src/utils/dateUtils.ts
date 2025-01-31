export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    const suffix =diffInSeconds > 1 ? 'seconds': 'second'
    return `${diffInSeconds} ${suffix}`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  
  if (diffInMinutes < 60) {
    const suffix = diffInMinutes > 1 ? 'minutes': 'minute'
    return `${diffInMinutes} ${suffix}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const suffix =diffInHours > 1 ? 'hours': 'hour'
    return `${diffInHours} ${suffix}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    const suffix =diffInDays > 1 ? 'days': 'day'
    return `${diffInDays} ${suffix}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  const suffix =diffInWeeks > 1 ? 'weeks': 'week'
  return `${diffInWeeks} ${suffix}`;
}