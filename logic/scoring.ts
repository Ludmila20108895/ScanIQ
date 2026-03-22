function nutriscoreToPoints(grade?: string): number {
  switch (grade?.toLowerCase()) {
    case "a":
      return 90;
    case "b":
      return 75;
    case "c":
      return 55;
    case "d":
      return 35;
    case "e":
      return 15;
    default:
      return 50;
  }
}
export function calculateScore(p: any): number {
  let score = nutriscoreToPoints(p.nutriscore_grade);

  const additiveCount = (p.additives_tags ?? []).length;
  if (additiveCount >= 5) score -= 20;
  else if (additiveCount >= 2) score -= 10;

  const sugars = p.nutriments?.["sugars_100g"];
  if (sugars >= 20) score -= 15;
  else if (sugars >= 10) score -= 7;

  const salt = p.nutriments?.["salt_100g"];
  if (salt >= 1.5) score -= 10;

  const fiber = p.nutriments?.["fiber_100g"];
  if (fiber >= 3) score += 5;

  if ((p.labels_tags ?? []).includes("en:organic")) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}
