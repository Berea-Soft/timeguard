/**
 * Shared locale utilities for duration formatting
 * Extracted from DiffResult and DurationResult to avoid duplication
 */

/**
 * Duration unit labels for different locales
 * Format: [singular, plural]
 */
export const DURATION_UNIT_LABELS: Record<
  string,
  Record<string, [string, string]>
> = {
  en: {
    year: ['year', 'years'],
    month: ['month', 'months'],
    week: ['week', 'weeks'],
    day: ['day', 'days'],
    hour: ['hour', 'hours'],
    minute: ['minute', 'minutes'],
    second: ['second', 'seconds'],
    millisecond: ['millisecond', 'milliseconds'],
  },
  es: {
    year: ['año', 'años'],
    month: ['mes', 'meses'],
    week: ['semana', 'semanas'],
    day: ['día', 'días'],
    hour: ['hora', 'horas'],
    minute: ['minuto', 'minutos'],
    second: ['segundo', 'segundos'],
    millisecond: ['milisegundo', 'milisegundos'],
  },
  fr: {
    year: ['année', 'années'],
    month: ['mois', 'mois'],
    week: ['semaine', 'semaines'],
    day: ['jour', 'jours'],
    hour: ['heure', 'heures'],
    minute: ['minute', 'minutes'],
    second: ['seconde', 'secondes'],
    millisecond: ['milliseconde', 'millisecondes'],
  },
};

/**
 * Conjunction words for joining duration parts
 */
export const CONJUNCTION_LABELS: Record<string, string> = {
  en: 'and',
  es: 'y',
  fr: 'et',
  de: 'und',
  it: 'e',
  pt: 'e',
};

/**
 * Get duration unit label for a specific locale
 */
export function getDurationUnitLabel(
  unit: string,
  locale: string,
  value: number,
): string {
  const langLabels = DURATION_UNIT_LABELS[locale] || DURATION_UNIT_LABELS.en;
  const label = langLabels[unit] || [unit, unit + 's'];
  return label[value === 1 ? 0 : 1];
}

/**
 * Get conjunction word for a specific locale
 */
export function getConjunctionLabel(locale: string): string {
  return CONJUNCTION_LABELS[locale] || 'and';
}

/**
 * Format a duration value with its unit label
 */
export function formatDurationPart(
  value: number,
  unit: string,
  locale: string,
): string {
  if (value === 0) {
    return '';
  }
  const label = getDurationUnitLabel(unit, locale, value);
  return `${value} ${label}`;
}

/**
 * Join formatted duration parts with locale-appropriate conjunctions
 */
export function joinDurationParts(parts: string[], locale: string): string {
  if (parts.length === 0) {
    return '';
  }
  if (parts.length === 1) {
    return parts[0];
  }

  const conjunction = getConjunctionLabel(locale);

  if (parts.length === 2) {
    return `${parts[0]} ${conjunction} ${parts[1]}`;
  }

  return (
    parts.slice(0, -1).join(', ') + ` ${conjunction} ${parts[parts.length - 1]}`
  );
}

/**
 * Format a zero duration for display
 */
export function formatZeroDuration(locale: string): string {
  const zeroLabels: Record<string, string> = {
    en: '0 seconds',
    es: '0 segundos',
    fr: '0 secondes',
  };
  return zeroLabels[locale] || '0 seconds';
}
