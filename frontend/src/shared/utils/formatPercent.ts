export const formatPercent = (value: number) => {
  if (value === null || value === undefined) return "-";
  return `${(value / 100).toFixed(2)}%`;
};