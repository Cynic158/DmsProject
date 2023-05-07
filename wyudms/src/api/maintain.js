import request from "@/utils/request";

export function getmaintainlist(data) {
  return request({
    url: "/api/getmaintainlist",
    method: "post",
    data,
  });
}

export function getstumaintainlist(data) {
  return request({
    url: "/api/getstumaintainlist",
    method: "post",
    data,
  });
}

export function getmaintainbyid(params) {
  return request({
    url: "/api/getmaintainbyid",
    method: "get",
    params,
  });
}

export function acceptmaintain(data) {
  return request({
    url: "/api/acceptmaintain",
    method: "post",
    data,
  });
}

export function donemaintain(params) {
  return request({
    url: "/api/donemaintain",
    method: "get",
    params,
  });
}

export function studonemaintain(params) {
  return request({
    url: "/api/studonemaintain",
    method: "get",
    params,
  });
}

export function cancelmaintain(params) {
  return request({
    url: "/api/cancelmaintain",
    method: "get",
    params,
  });
}

export function stucancelmaintain(params) {
  return request({
    url: "/api/stucancelmaintain",
    method: "get",
    params,
  });
}

export function deletemaintain(data) {
  return request({
    url: "/api/deletemaintain",
    method: "post",
    data,
  });
}

export function getmaintainhistory(data) {
  return request({
    url: "/api/getmaintainhistory",
    method: "post",
    data,
  });
}

export function addmaintain(data) {
  return request({
    url: "/api/addmaintain",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
