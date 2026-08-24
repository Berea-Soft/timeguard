/**
 * Middle Eastern & South Asian Locales
 * ar, he, hi
 */

import type { ILocale } from '../types';

export const AR_LOCALE_DATA: ILocale = {
  name: 'ar',
  months: [
    'كانون الثاني',
    'شباط',
    'آذار',
    'نيسان',
    'أيار',
    'حزيران',
    'تموز',
    'آب',
    'أيلول',
    'تشرين الأول',
    'تشرين الثاني',
    'كانون الأول',
  ],
  monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  weekdays: [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ],
  weekdaysShort: ['أحد', 'اثن', 'ثلا', 'أربع', 'خمس', 'جمع', 'سبت'],
  weekdaysMin: ['ح', 'ن', 'ث', 'ع', 'خ', 'ج', 'س'],
  meridiem: { am: 'ص', pm: 'م' },
  formats: {
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    datetime: 'DD/MM/YYYY HH:mm:ss',
    rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  },
};

export const HE_LOCALE_DATA: ILocale = {
  name: 'he',
  months: [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ],
  monthsShort: [
    'ינו',
    'פבר',
    'מרץ',
    'אפר',
    'מאי',
    'יוני',
    'יולי',
    'אוג',
    'ספט',
    'אוק',
    'נוב',
    'דצמ',
  ],
  weekdays: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  weekdaysShort: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  weekdaysMin: ['ראו', 'שני', 'שלי', 'רבי', 'חמי', 'שיש', 'שבת'],
  meridiem: { am: 'AM', pm: 'PM' },
  formats: {
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    datetime: 'DD/MM/YYYY HH:mm:ss',
    rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  },
};

export const HI_LOCALE_DATA: ILocale = {
  name: 'hi',
  months: [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ],
  monthsShort: [
    'जन',
    'फ़र',
    'मार',
    'अप्र',
    'मई',
    'जून',
    'जुल',
    'अग',
    'सित',
    'अक्ट',
    'नव',
    'दिस',
  ],
  weekdays: [
    'रविवार',
    'सोमवार',
    'मंगलवार',
    'बुधवार',
    'गुरुवार',
    'शुक्रवार',
    'शनिवार',
  ],
  weekdaysShort: ['रवि', 'सोम', 'मंग', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  weekdaysMin: ['र', 'स', 'मं', 'ब', 'गु', 'श', 'श'],
  meridiem: { am: 'AM', pm: 'PM' },
  formats: {
    iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    date: 'DD/MM/YYYY',
    time: 'HH:mm:ss',
    datetime: 'DD/MM/YYYY HH:mm:ss',
    rfc2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  },
};

export const MIDDLE_EASTERN_LOCALES: Record<string, ILocale> = {
  ar: AR_LOCALE_DATA,
  he: HE_LOCALE_DATA,
  hi: HI_LOCALE_DATA,
};
