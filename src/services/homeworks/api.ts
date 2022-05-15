// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取作业列表 GET /api/homework/list */
export async function homework(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sort?: { [key: string]: any },
  filter?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<API.HomeworkList>('/api/homework/list', {
    method: 'GET',
    params: {
      ...params,
      sort,
      filter,
    },
    ...(options || {}),
  });
}

/** 请求作业数据 POST /api/homework/query */
export async function queryHomework(
  params: {
    key: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ success: boolean; data: API.HomeworkDataType }>('/api/homework/query', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建作业 POST /api/homework/add */
export async function addHomework(body: API.HomeworkDataType, options?: { [key: string]: any }) {
  return request<API.fixHomeworkResult>('/api/homework/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改作业 POST /api/homework/update */
export async function updateHomework(body: API.HomeworkDataType, options?: { [key: string]: any }) {
  return request<API.fixHomeworkResult>('/api/homework/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除作业 POST /api/homework/delete */
export async function deleteHomework(body: { key: string }, options?: { [key: string]: any }) {
  return request<API.fixHomeworkResult>('/api/homework/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取提交记录列表 GET /api/homework/record */
export async function record(
  key: string,
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  sort?: { [key: string]: any },
  filter?: { [key: string]: any },
  options?: { [key: string]: any },
) {
  return request<API.RecordList>('/api/homework/record', {
    method: 'GET',
    params: {
      key,
      ...params,
      sort,
      filter,
    },
    ...(options || {}),
  });
}

/** 获取单个文件下载链接 GET /api/homework/getfileurl */
export async function getFileUrl(
  key: string,
  id: number,
  step: number,
  filename: string,
  options?: { [key: string]: any },
) {
  return request<{ success: boolean; data: string }>('/api/homework/getfileurl', {
    method: 'GET',
    params: {
      key,
      id,
      step,
      filename,
    },
    ...(options || {}),
  });
}

/** 批量获取所有最后提交的文件下载链接 GET /api/homework/getlastfilesurl */
export async function getLastFileUrls(key: string, options?: { [key: string]: any }) {
  return request<{ success: boolean; data: API.FileUrlType[]; errorMessage?: string }>(
    '/api/homework/getlastfileurls',
    {
      method: 'GET',
      params: {
        key,
      },
      ...(options || {}),
    },
  );
}
