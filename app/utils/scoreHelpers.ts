export const getScoreLabel = (value: number) => {
  if (value <= 25) return "Bad";
  if (value <= 50) return "Poor";
  if (value <= 75) return "Good";
  return "Excellent";
};

export const getScoreMessage = (value: number) => {
  // provide a user-friendly message based on the score
  if (value <= 25) {
    return "This product is not a healthy choice.";
  }
  if (value <= 50) {
    return "This product is rated as poor and should be consumed only occasionally.";
  }
  if (value <= 75) {
    return "This product is a good choice! It contains essential nutrients and has a balanced profile.";
  }
  return "This product has an excellent score and is a very good choice overall.";
};
