// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取封面列表 POST /app/console/admin/coupon/list */
export async function couponList(menuId: string, page: number, rows: number, keyword?: string) {
  return request<DTO.Resp<any>>(`${API_URL}/console/admin/coupon/list`, {
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
