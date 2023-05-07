import request from "@/utils/request";

export function getPersonnelList(params) {
  return request({
    url: "/api/getpersonnellist",
    method: "get",
    params,
  });
}

export function getPersonnelPhone(params) {
  return request({
    url: "/api/getpersonnelphone",
    method: "get",
    params,
  });
}

export function getPersonnelName(params) {
  return request({
    url: "/api/getpersonnelname",
    method: "get",
    params,
  });
}
