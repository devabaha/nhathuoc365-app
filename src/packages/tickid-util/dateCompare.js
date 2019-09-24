/**
 * this function is good for dates > 01/01/1970
 * @param Date DateA
 * @param Date DateB
 */
export default function dateCompare(DateA, DateB) {
  const a = new Date(DateA);
  const b = new Date(DateB);

  const msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
  const msDateB = Date.UTC(b.getFullYear(), b.getMonth() + 1, b.getDate());

  if (parseFloat(msDateA) < parseFloat(msDateB)) return -1;
  // lt
  else if (parseFloat(msDateA) == parseFloat(msDateB)) return 0;
  // eq
  else if (parseFloat(msDateA) > parseFloat(msDateB)) return 1;
  // gt
  else return null; // error
}
