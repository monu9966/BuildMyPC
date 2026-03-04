export function getEstimatedDelivery(days = 5) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function getDeliveryRange() {
  const start = new Date();
  const end = new Date();

  start.setDate(start.getDate() + 1);
  end.setDate(end.getDate() + 5);

  const options = { day: "numeric", month: "short" };

  return `${start.toLocaleDateString("en-IN", options)} - ${end.toLocaleDateString("en-IN", options)}`;
}