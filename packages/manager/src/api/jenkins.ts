import request from '@/axios/request'

// 获取构建任务列表
export function getJobs() {
  return request<any, any>({
    url: '/jenkins/jobs',
    method: 'get',
  })
}

// 创建任务
export function createJob(data: {
  name: string
  gitUrl: string
  branch: string
  type: string
}) {
  return request<any, any>({
    url: `/jenkins/createJob`,
    method: 'post',
    data,
  })
}

// 触发构建任务
export function triggerJob(data: { name: string }) {
  return request<any, any>({
    url: `/jenkins/buildJob`,
    method: 'post',
    data,
  })
}

// 获取job详情
export function getJobDetail(data: { name: string }) {
  return request<any, any>({
    url: `/jenkins/jobs`,
    method: 'get',
    params: data,
  })
}

// 更新job
export function updateJob(data: {
  name: string
  gitUrl: string
  branch: string
  type: string
}) {
  return request<any, any>({
    url: `/jenkins/updateJob`,
    method: 'post',
    data,
  })
}

// 删除job
export function deleteJob(data: { name: string }) {
  return request<any, any>({
    url: `/jenkins/deleteJob`,
    method: 'post',
    data,
  })
}

// 获取构建进度
export function getJobBuildProgress(data: { name: string }) {
  return request<any, any>({
    url: `/jenkins/jobBuildProgress`,
    method: 'get',
    params: data,
  })
}
