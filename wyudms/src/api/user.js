import request from "@/utils/request";

export function login(data) {
  // 返回了promise对象
  return request({
    url: "/api/login",
    method: "post",
    data, // body参数体位于data
  });
}

export function forget(data) {
  // 返回了promise对象
  return request({
    url: "/api/forget",
    method: "post",
    data, // body参数体位于data
  });
}

export function reqemailcode(params) {
  return request({
    url: "/api/reqemailcode",
    method: "get",
    params,
  });
}

export function getStuList(data) {
  return request({
    url: "/api/getstuinfo",
    method: "post",
    data,
  });
}

export function getStuById(data) {
  return request({
    url: "/api/getstubyid",
    method: "post",
    data,
  });
}

export function demoexcel(data) {
  return request({
    url: "/api/impexcel",
    method: "post",
    data,
  });
}

export function updatestuinfo(data) {
  return request({
    url: "/api/updatestuinfo",
    method: "post",
    data,
  });
}

export function deletestuinfo(data) {
  return request({
    url: "/api/deletestuinfo",
    method: "post",
    data,
  });
}

export function addstu(data) {
  return request({
    url: "/api/addstu",
    method: "post",
    data,
  });
}

export function expstu(data) {
  return request({
    url: "/api/expstu",
    method: "post",
    data,
  });
}

export function searchstu(params) {
  return request({
    url: "/api/searchstu",
    method: "get",
    params,
  });
}

export function gethomedata() {
  return request({
    url: "/api/gethomedata",
    method: "get",
  });
}

export function updatephone(data) {
  return request({
    url: "/api/updatephone",
    method: "post",
    data,
  });
}

export function updateemail(data) {
  return request({
    url: "/api/updateemail",
    method: "post",
    data,
  });
}
