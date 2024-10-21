export function calculateEstimatedCompletion(months: number): Date {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + months);
  return currentDate;
}
