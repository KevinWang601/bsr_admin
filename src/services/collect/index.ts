// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取封面列表 POST /console/admin/collect/list */
export async function collectList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  type?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/collect/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      type: type,
    }),
    processData: false,
  });
}
