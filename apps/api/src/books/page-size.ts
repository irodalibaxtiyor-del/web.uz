/**
 * The book's page size: the most common page size, not the first page's. A first page is often
 * an odd one (a landscape wrap-around cover, a scanned approval sheet), and the reader lays every
 * page out in this size. Sizes within 2 pt are treated as the same; a tie goes to the earlier.
 */
export function dominantPageSize(sizes: readonly { width: number; height: number }[]): {
  width: number;
  height: number;
} {
  const groups: { width: number; height: number; count: number }[] = [];
  for (const s of sizes) {
    const g = groups.find(
      (x) => Math.abs(x.width - s.width) <= 2 && Math.abs(x.height - s.height) <= 2,
    );
    if (g) g.count++;
    else groups.push({ width: s.width, height: s.height, count: 1 });
  }
  let best = groups[0];
  for (const g of groups) if (best && g.count > best.count) best = g;
  return best ? { width: best.width, height: best.height } : { width: 0, height: 0 };
}
