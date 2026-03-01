// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取小说类型列表 POST /novel/admin/novel/tag/list */
export async function novelTagList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  adults?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/tag/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      adults: adults,
    }),
    processData: false,
  });
}

/** 获取小说标签列表 POST /novel/admin/novel/tags */
export async function novelTags(gender: number, adults: number) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      gender: gender,
      adults: adults,
    }),
    processData: false,
  });
}

/** 获取小说标签列表 POST /novel/admin/novel/tagids/ */
export async function novelTagIds(novelId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/tagids/` + novelId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}
