export function generateUniqueName(prefix: string): string {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const uniqueName = `${prefix}_${day}${month}${hours}${minutes}${seconds}`;
  return uniqueName;
}
export default generateUniqueName;
