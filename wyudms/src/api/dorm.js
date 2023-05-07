import request from "@/utils/request";

export function getbuildinglist(params) {
  return request({
    url: "/api/getbuildinglist",
    method: "get",
    params,
  });
}

export function getroomlist(params) {
  return request({
    url: "/api/getroomlist",
    method: "get",
    params,
  });
}

export function getroomstuinfo(params) {
  return request({
    url: "/api/getroomstuinfo",
    method: "get",
    params,
  });
}

export function getremainlist(params) {
  return request({
    url: "/api/getremainlist",
    method: "get",
    params,
  });
}

export function getadjustlist(params) {
  return request({
    url: "/api/getadjustlist",
    method: "get",
    params,
  });
}

export function getadjustdetail(params) {
  return request({
    url: "/api/getadjustdetail",
    method: "get",
    params,
  });
}

export function getadjuststatus(params) {
  return request({
    url: "/api/getadjuststatus",
    method: "get",
    params,
  });
}

export function nopassadjust(params) {
  return request({
    url: "/api/nopassadjust",
    method: "get",
    params,
  });
}

export function passadjust(params) {
  return request({
    url: "/api/passadjust",
    method: "get",
    params,
  });
}

export function deleteadjust(params) {
  return request({
    url: "/api/deleteadjust",
    method: "get",
    params,
  });
}

export function startadjust(params) {
  return request({
    url: "/api/startadjust",
    method: "get",
    params,
  });
}

export function canceladjust(params) {
  return request({
    url: "/api/canceladjust",
    method: "get",
    params,
  });
}

export function finishadjust(params) {
  return request({
    url: "/api/finishadjust",
    method: "get",
    params,
  });
}

export function roomexist(params) {
  return request({
    url: "/api/roomexist",
    method: "get",
    params,
  });
}

export function getadjustbyroom(params) {
  return request({
    url: "/api/getadjustbyroom",
    method: "get",
    params,
  });
}

export function changedormjob(params) {
  return request({
    url: "/api/changedormjob",
    method: "get",
    params,
  });
}

export function confirmstep(params) {
  return request({
    url: "/api/confirmstep",
    method: "get",
    params,
  });
}

export function addadjust(params) {
  return request({
    url: "/api/addadjust",
    method: "get",
    params,
  });
}

export function stucanceladjust(params) {
  return request({
    url: "/api/stucanceladjust",
    method: "get",
    params,
  });
}
