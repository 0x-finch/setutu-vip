export function getRandomUniqueIntegers(count: number, max: number): number[] {
  const set = new Set<number>();
  while (set.size < count && set.size < max) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set);
}
