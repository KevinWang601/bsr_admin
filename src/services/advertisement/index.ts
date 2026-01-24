// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取广告列表 POST /console/admin/advertisement/list */
export async function advertisementList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  host?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/advertisement/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      host: host,
    }),
    processData: false,
  });
}

/** 获取栏目 GET /console/admin/advertisement/sections */
export async function loadSection() {
  return request<any[]>(`${API_URL}/console/admin/advertisement/sections`, {
    method: 'POST',
    processData: false,
  });
}

/** 获取类型 GET /console/admin/advertisement/types */
export async function loadType() {
  return request<any[]>(`${API_URL}/console/admin/advertisement/types`, {
    method: 'POST',
    processData: false,
  });
}
