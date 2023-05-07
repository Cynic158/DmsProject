import request from "@/utils/request";

export function getAppealList(params) {
  return request({
    url: "/api/getappeallist",
    method: "get",
    params,
  });
}

export function getAppealListbyid(params) {
  return request({
    url: "/api/getappeallistbyid",
    method: "get",
    params,
  });
}

export function getAppealinfo(params) {
  return request({
    url: "/api/getappealinfo",
    method: "get",
    params,
  });
}

export function getAppealinfobyid(params) {
  return request({
    url: "/api/getappealinfobyid",
    method: "get",
    params,
  });
}

export function clearappeal() {
  return request({
    url: "/api/clearappeal",
    method: "get",
  });
}

export function deleteappeal(params) {
  return request({
    url: "/api/deleteappeal",
    method: "get",
    params,
  });
}

export function updateappeal(data) {
  return request({
    url: "/api/updateappeal",
    method: "post",
    data,
  });
}

export function addappeal(data) {
  return request({
    url: "/api/addappeal",
    method: "post",
    data,
  });
}
