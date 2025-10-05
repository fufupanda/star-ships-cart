export const formatNumber = (num: number) => {
  const suffixes = ["", "K", "M", "B", "T"]; // K = Thousand, M = Million, B = Billion, T = Trillion
  let suffixIndex = 0;

  while (num >= 1000 && suffixIndex < suffixes.length - 1) {
    num /= 1000;
    suffixIndex++;
  }

  // Format the number with one decimal place
  return num.toFixed(1) + suffixes[suffixIndex];
};
