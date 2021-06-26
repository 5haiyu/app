// eslint-disable-next-line import/no-cycle
import request from '../request'
import request2 from '../request-prod'

// submit
export function thridDomainApi(params) {
  return request2({
    url: '/jf/api/thridDomain/list',
    method: 'get',
    params
  })
}
// 机具入库
export function machineImportApi(data) {
  return request({
    url: '/pay/machine/machineImport',
    method: 'post',
    data: data
  })
}
// 获取机具类型列表
export function getMachineConfigListApi(params) {
  return request({
    url: '/pay/machine/getMachineConfigList',
    method: 'get',
    params
  })
}