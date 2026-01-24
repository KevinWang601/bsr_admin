// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** APP网络列表 POST /console/admin/version/list */
export async function appVersionList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  platform?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/version/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      platform: platform,
    }),
    processData: false,
  });
}
