export function objectKeys<O>(o: O) {
  return Object.keys(o) as (keyof O)[];
}
