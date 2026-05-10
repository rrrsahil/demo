export const calculateTotal = (budget) => {
  if (!budget) return 0;

  return (
    Number(budget.transportCost || 0) +
    Number(budget.hotelCost || 0) +
    Number(budget.activityCost || 0) +
    Number(budget.mealCost || 0) +
    Number(budget.miscCost || 0)
  );
};

export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const calculateAveragePerDay = (
  total,
  startDate,
  endDate
) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff =
    Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

  return Math.round(total / diff);
};

export const getHighestExpenseCategory = (budget) => {
  const categories = [
    {
      label: "Transport",
      value: Number(budget.transportCost || 0),
    },
    {
      label: "Hotel",
      value: Number(budget.hotelCost || 0),
    },
    {
      label: "Activities",
      value: Number(budget.activityCost || 0),
    },
    {
      label: "Meals",
      value: Number(budget.mealCost || 0),
    },
    {
      label: "Misc",
      value: Number(budget.miscCost || 0),
    },
  ];

  return categories.sort((a, b) => b.value - a.value)[0];
};

export const getBudgetAlert = (avgPerDay) => {
  if (avgPerDay >= 15000) {
    return {
      type: "danger",
      message: "High daily spending detected.",
    };
  }

  if (avgPerDay >= 7000) {
    return {
      type: "warning",
      message: "Your daily budget is above average.",
    };
  }

  return {
    type: "success",
    message: "Your trip budget looks balanced.",
  };
};