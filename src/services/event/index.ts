// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取封面列表 POST /comic/admin/comic/gift/event/list */
export async function giftEventList(menuId: string, page: number, rows: number, keyword?: string) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/gift/event/list`, {
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
