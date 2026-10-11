import { SearchParamValue } from '@/lib/shared/searchParam.types';

export function getFirstParam(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export function validatePage(page: number) {
  return !Number.isFinite(page) || page < 1 ? 1 : page;
}
