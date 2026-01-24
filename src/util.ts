// @ts-ignore
/* eslint-disable */

import Cookies from 'js-cookie';
import { MenuDataItem } from '@ant-design/pro-layout';
import moment from 'moment-timezone';

export function getFormData(object: any) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}

export function getQueryString(object: any) {
  const params = new URLSearchParams();
  Object.keys(object).forEach((key) => params.append(key, object[key]));
  return params.toString();
}

// 根据key值获取cookie
export function getCookie(key: string) {
  return Cookies.get(key);
}

export function setCookie(key: string, value: string) {
  Cookies.set(key, value);
}

export function removeCookie(key: string) {
  Cookies.remove(key);
}

export function saveLoginDto(object: any) {
  localStorage.setItem('loginDto', JSON.stringify(object));
}

export function getLoginDto() {
  let json = localStorage.getItem('loginDto');
  if (!json) return null;
  return JSON.parse(json);
}

export function removeLoginDto() {
  localStorage.removeItem('loginDto');
}

export function saveUserMenus(menus: MenuDataItem[]) {
  localStorage.setItem('userMenus', JSON.stringify(menus));
}

export function getUserMenus() {
  let json = localStorage.getItem('userMenus');
  if (!json) return null;
  return JSON.parse(json);
}

export function removeUserMenus() {
  localStorage.removeItem('userMenus');
}

export function timeZoneConverter(date: Date | undefined) {
  if (date === null || date === undefined) return '';
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.tz(date, timeZone).format('YYYY-MM-DD HH:mm:ss');
}

export function formatZoneConverter(date: Date | undefined, formatPattern: string) {
  if (date === null || date === undefined) return '';
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.tz(date, timeZone).format(formatPattern);
}

export function formatUTCDate(date: Date | undefined, formatPattern: string) {
  if (date === null || date === undefined) return '';
  return moment.tz(date, 'UTC').format(formatPattern);
}

export function timeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
