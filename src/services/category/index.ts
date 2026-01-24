// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取小说分类列表 POST /novel/admin/novel/category/list */
export async function novelCategoryList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  hot?: number,
  gender?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/category/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      hot: hot,
      gender: gender,
    }),
    processData: false,
  });
}

/** 获取小说分类列表 POST /novel/admin/novel/categories */
export async function novelCategories() {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}
