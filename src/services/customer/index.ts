// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取用户列表 POST /console/admin/customer/list */
export async function customerList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  roleId?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/customer/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      roleId: roleId,
    }),
    processData: false,
  });
}

/** 搜索用户列表 POST /console/admin/customer/search */
export async function search(id: number, keyword: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/customer/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      id: id,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取用户心愿列表 POST /console/admin/customer/wish/list */
export async function customerWishList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  type?: number,
  status?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/customer/wish/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      type: type,
      status: status,
    }),
    processData: false,
  });
}

/** 获取用户催更列表 POST /console/admin/customer/reminder/list */
export async function customerReminderList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  type?: number,
  status?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/customer/reminder/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      type: type,
      status: status,
    }),
    processData: false,
  });
}

/** 获取用户催更列表 POST /console/admin/customer/reminder/item/list */
export async function customerReminderItemList(id: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/customer/reminder/item/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      id: id,
    }),
    processData: false,
  });
}
