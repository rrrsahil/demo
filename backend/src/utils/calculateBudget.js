const calculateBudget = (budget) => {
  const {
    transportCost = 0,
    hotelCost = 0,
    activityCost = 0,
    mealCost = 0,
    miscCost = 0,
  } = budget;
  return transportCost + hotelCost + activityCost + mealCost + miscCost;
};

module.exports = calculateBudget;
