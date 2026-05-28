export const formatDateTime = (ts: bigint | number) => {
  const d = new Date(Number(ts) * 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    timestamp: String(ts),
  };
};