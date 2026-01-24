// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { getQueryString } from '@/util';

/** 获取小说列表 POST /novel/admin/novel/list */
export async function novelList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  categoryId?: string,
  tagId?: string,
  hot?: number,
  recommend?: number,
  top?: number,
  adults?: number,
  gender?: number,
  finished?: number,
  status?: number,
  sort?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      categoryId: categoryId,
      tagId: tagId,
      hot: hot,
      recommend: recommend,
      top: top,
      adults: adults,
      gender: gender,
      finished: finished,
      status: status,
      sort: sort,
    }),
    processData: false,
  });
}

/** 随机平台搬山人 GET /novel/admin/novel/random/employee/bsr */
export async function randomEmployeeBsr() {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/random/employee/bsr`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 查询搬山人 GET /novel/admin/novel/search/bsr */
export async function searchBsr(keyword: string) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/search/bsr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取作品简介 GET /novel/admin/novel/brief */
export async function novelBrief(novelId: string) {
  return request<DTO.Resp<string>>(`${API_URL}/novel/admin/novel/brief/` + novelId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取卷信息 GET /novel/admin/novel/volume */
export async function novelVolume(novelId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/volume/` + novelId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    processData: false,
  });
}

/** 获取小说章节列表 POST /novel/admin/novel/chapter/list */
export async function novelChapterList(
  menuId: string,
  novelId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/chapter/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      novelId: novelId,
      page: page,
      rows: rows,
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取所有小说 GET /novel/admin/novel/load */
export async function loadNovel(keyword: string) {
  return request<any[]>(`${API_URL}/novel/admin/novel/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      keyword: keyword,
    }),
    processData: false,
  });
}

/** 获取小说 GET /novel/admin/novel/{id} */
export async function getNovel(id: string) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/` + id, {
    method: 'GET',
    processData: false,
  });
}

/** 获取小说章节内容 GET /novel/admin/novel/chapter/content */
export async function getChapterContent(novelId: string, chapterId: string) {
  return request<DTO.Resp<any>>(`${API_URL}/novel/admin/novel/chapter/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      novelId: novelId,
      chapterId: chapterId,
    }),
    processData: false,
  });
}

/** 获取漫画评论列表 POST /comic/admin/comic/comment/list */
export async function comicCommentList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/comment/list`, {
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

/** 获取漫画热门和推荐列表 POST /comic/admin/comic/popular/list */
export async function comicPopularList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
  type?: number,
  host?: number,
) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/popular/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: getQueryString({
      menuId: menuId,
      page: page,
      rows: rows,
      keyword: keyword,
      type: type,
      host: host,
    }),
    processData: false,
  });
}

/** 获取浏览记录列表 POST /comic/admin/comic/read/record/list */
export async function readRecordList(menuId: string, page: number, rows: number, keyword?: string) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/read/record/list`, {
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

/** 获取浏览统计列表 POST /comic/admin/comic/read/record/count/list */
export async function readRecordCountList(
  menuId: string,
  page: number,
  rows: number,
  keyword?: string,
) {
  return request<DTO.Resp<any>>(`${API_URL}/comic/admin/comic/read/record/count/list`, {
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
