// TODO カスタムフックというよりutilsとかに入れた方が良さそうです
// 日付を日本時間のYYYY年MM月DD日に変換
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.toLocaleString('ja-JP', { year: 'numeric' });
  const month = date.toLocaleString('ja-JP', { month: '2-digit' });
  const day = date.toLocaleString('ja-JP', { day: '2-digit' });

  return `${year}${month}${day}`;
}
