/**
 * Format a Date object to YYYY-MM-DD string
 */
export const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a Date object to YYYY-MM-DDTHH:mm:ss string
 */
export const formatDateTimeISO = (date: Date): string => {
  const isoDate = formatDateISO(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${isoDate}T${hours}:${minutes}:${seconds}`;
};

/**
 * Get next N days starting from today
 */
export const getNextDays = (days: number): Date[] => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
};

/**
 * Format for display: "Thứ 2, 01/01"
 */
export const formatDisplayDate = (date: Date): string => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${dayName}, ${day}/${month}`;
};
