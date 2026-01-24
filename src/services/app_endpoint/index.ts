// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** APP网络列表 POST /console/admin/endpoint/list */
export async function appEndpointList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/endpoint/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}
