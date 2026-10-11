export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toFixed(decimals);
}

export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "—";
  }

  return `${(number * 100).toFixed(decimals)}%`;
}

export function formatRisk(risk) {
  if (!risk) {
    return "Unknown";
  }

  return String(risk)
    .charAt(0)
    .toUpperCase() + String(risk).slice(1).toLowerCase();
}

export function getRiskClass(risk) {
  return `risk-${String(risk || "unknown").toLowerCase()}`;
}

export function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString();
}