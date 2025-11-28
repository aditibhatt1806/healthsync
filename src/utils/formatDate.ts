export function formatDate(
  date: Date | number | string | null | undefined,
  format: 'full' | 'short' | 'date' | 'time' | 'relative' | 'iso' | 'custom' = 'full'
): string {
  if (!date) return 'N/A';

  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return 'Invalid date';
  }

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case 'full':
      // "January 15, 2024 at 3:30 PM"
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'short':
      // "Jan 15, 2024"
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

    case 'date':
      // "01/15/2024"
      return dateObj.toLocaleDateString('en-US');

    case 'time':
      // "3:30 PM"
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case 'relative':
      // "2 hours ago"
      return getRelativeTime(dateObj);

    case 'iso':
      // "2024-01-15T15:30:00.000Z"
      return dateObj.toISOString();

    default:
      return dateObj.toString();
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to compare
 * @param baseDate - Base date for comparison (default: now)
 * @returns Relative time string
 */
export function getRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diffMs = baseDate.getTime() - date.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  
  const diffSec = Math.floor(absDiffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const format = (value: number, unit: string) => {
    const plural = value !== 1 ? 's' : '';
    return isFuture 
      ? `in ${value} ${unit}${plural}`
      : `${value} ${unit}${plural} ago`;
  };

  if (diffSec < 10) {
    return 'Just now';
  } else if (diffSec < 60) {
    return format(diffSec, 'second');
  } else if (diffMin < 60) {
    return format(diffMin, 'minute');
  } else if (diffHour < 24) {
    return format(diffHour, 'hour');
  } else if (diffDay < 7) {
    return format(diffDay, 'day');
  } else if (diffWeek < 4) {
    return format(diffWeek, 'week');
  } else if (diffMonth < 12) {
    return format(diffMonth, 'month');
  } else {
    return format(diffYear, 'year');
  }
}

/**
 * Format time in 12-hour format
 * @param time - Time string (HH:MM) or Date object
 * @returns Formatted time (h:MM AM/PM)
 */
export function formatTime12Hour(time: string | Date): string {
  let hours: number;
  let minutes: number;

  if (typeof time === 'string') {
    const [h, m] = time.split(':').map(Number);
    hours = h;
    minutes = m;
  } else {
    hours = time.getHours();
    minutes = time.getMinutes();
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes.toString().padStart(2, '0');

  return `${hour12}:${minuteStr} ${period}`;
}

/**
 * Format time in 24-hour format
 * @param time - Time string or Date object
 * @returns Formatted time (HH:MM)
 */
export function formatTime24Hour(time: string | Date): string {
  if (typeof time === 'string') {
    return time;
  }
  
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Check if date is today
 * @param date - Date to check
 * @returns True if today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Check if date is yesterday
 * @param date - Date to check
 * @returns True if yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * Check if date is tomorrow
 * @param date - Date to check
 * @returns True if tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/**
 * Check if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Get friendly date label (Today, Yesterday, or formatted date)
 * @param date - Date to format
 * @returns Friendly label
 */
export function getFriendlyDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const diffDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  return formatDate(date, 'short');
}

/**
 * Get start of day (00:00:00)
 * @param date - Date object (default: today)
 * @returns Date at start of day
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get end of day (23:59:59.999)
 * @param date - Date object (default: today)
 * @returns Date at end of day
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add hours to a date
 * @param date - Starting date
 * @param hours - Number of hours to add
 * @returns New date
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get day name from date
 * @param date - Date object
 * @param format - 'long' or 'short'
 * @returns Day name
 */
export function getDayName(date: Date, format: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', { weekday: format });
}

/**
 * Get month name from date
 * @param date - Date object
 * @param format - 'long' or 'short'
 * @returns Month name
 */
export function getMonthName(date: Date, format: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', { month: format });
}

/**
 * Get array of last N days
 * @param days - Number of days
 * @returns Array of date strings
 */
export function getLastNDays(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(getDayName(date, 'short'));
  }
  
  return dates;
}

/**
 * Get week number of the year
 * @param date - Date object
 * @returns Week number
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Parse date string in various formats
 * @param dateString - Date string
 * @returns Date object or null
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Format duration in human-readable format
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns True if in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns True if in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if date is within a range
 * @param date - Date to check
 * @param start - Range start
 * @param end - Range end
 * @returns True if within range
 */
export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Get age from birth date
 * @param birthDate - Birth date
 * @returns Age in years
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDateForInput(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time for input field (HH:MM)
 * @param date - Date object
 * @returns Formatted time string
 */
export function formatTimeForInput(date: Date = new Date()): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get calendar month data
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Array of weeks with day objects
 */
export function getCalendarMonth(year: number, month: number): Array<Array<Date | null>> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  
  const weeks: Array<Array<Date | null>> = [];
  let week: Array<Date | null> = [];
  
  // Fill in days before the first of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    week.push(null);
  }
  
  // Fill in the days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    week.push(new Date(year, month, day));
    
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  
  // Fill in remaining days
  while (week.length < 7 && week.length > 0) {
    week.push(null);
  }
  
  if (week.length > 0) {
    weeks.push(week);
  }
  
  return weeks;
}

/**
 * Check if a year is a leap year
 * @param year - Year to check
 * @returns True if leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get number of days in a month
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Number of days
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Format timestamp to countdown (e.g., "5m 30s")
 * @param targetDate - Target date/time
 * @returns Countdown string
 */
export function formatCountdown(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) return '00:00';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get next medication time from schedule
 * @param medicationTimes - Array of time strings (HH:MM)
 * @returns Next medication date/time
 */
export function getNextMedicationTime(medicationTimes: string[]): Date | null {
  if (!medicationTimes || medicationTimes.length === 0) return null;
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  // Find next time today
  for (const time of medicationTimes.sort()) {
    const [hours, minutes] = time.split(':').map(Number);
    
    if (hours > currentHours || (hours === currentHours && minutes > currentMinutes)) {
      const nextTime = new Date();
      nextTime.setHours(hours, minutes, 0, 0);
      return nextTime;
    }
  }
  
  // If no time today, return first time tomorrow
  const [hours, minutes] = medicationTimes[0].split(':').map(Number);
  const nextTime = new Date();
  nextTime.setDate(nextTime.getDate() + 1);
  nextTime.setHours(hours, minutes, 0, 0);
  return nextTime;
}