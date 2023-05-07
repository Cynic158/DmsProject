import request from "@/utils/request";

export function getNoticeList(params) {
  return request({
    url: "/api/getnoticelist",
    method: "get",
    params,
  });
}

export function getNoticeinfo(params) {
  return request({
    url: "/api/getnoticeinfo",
    method: "get",
    params,
  });
}

export function updatenoticeinfo(data) {
  return request({
    url: "/api/updatenoticeinfo",
    method: "post",
    data,
  });
}

export function addnotice(data) {
  return request({
    url: "/api/addnotice",
    method: "post",
    data,
  });
}

export function deletenoticeinfo(params) {
  return request({
    url: "/api/deletenoticeinfo",
    method: "get",
    params,
  });
}
