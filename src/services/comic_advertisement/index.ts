// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取广告列表 POST /comic/admin/comic/advertisement/list */
export async function comicAdvertisementList(
  menuId: string,
  page: number,
  rows: number,
  scope?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/advertisement/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      scope: scope,
    }),
    processData: false,
  });
}
