// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取广告列表 POST /console/admin/seometa/list */
export async function seometaList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  host?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/seometa/list`, {
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
