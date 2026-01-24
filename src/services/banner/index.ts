// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取封面列表 POST /app/console/admin/banner/list */
export async function bannerList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  host?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/banner/list`, {
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
