import { DayOfWeek } from '../types';

export function formatLKR(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount).replace('LKR', 'රු.');
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('si-LK').format(amount);
}

export const SINHALA_MONTHS = [
  'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
  'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
];

export const SINHALA_DAYS: Record<DayOfWeek, string> = {
  Sunday: 'ඉරිදා (Sunday)',
  Monday: 'සඳුදා (Monday)',
  Tuesday: 'අඟහරුවාදා (Tuesday)',
  Wednesday: 'බදාදා (Wednesday)',
  Thursday: 'බ්‍රහස්පතින්දා (Thursday)',
  Friday: 'සිකුරාදා (Friday)',
  Saturday: 'සෙනසුරාදා (Saturday)'
};

export const SINHALA_DAYS_SHORT: Record<DayOfWeek, string> = {
  Sunday: 'ඉරිදා',
  Monday: 'සඳුදා',
  Tuesday: 'අඟහ',
  Wednesday: 'බදාදා',
  Thursday: 'බ්‍රහස්',
  Friday: 'සිකු',
  Saturday: 'සෙන'
};

export function formatSinhalaDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const year = date.getFullYear();
  const month = SINHALA_MONTHS[date.getMonth()];
  const day = date.getDate();
  return `${year} ${month} ${day}`;
}

export function formatSinhalaDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr;

  const year = date.getFullYear();
  const month = SINHALA_MONTHS[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'ප.ව.' : 'පෙ.ව.';
  const displayHours = hours % 12 || 12;

  return `${year} ${month} ${day} ${displayHours}:${minutes} ${period}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthNameSinhala(yearMonth: string): string {
  if (!yearMonth) return '';
  const parts = yearMonth.split('-');
  if (parts.length < 2) return yearMonth;
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${parts[0]} ${SINHALA_MONTHS[monthIdx] || parts[1]}`;
}
