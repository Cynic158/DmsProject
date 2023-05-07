import request from "@/utils/request";

export function getmajorlist() {
  return request({
    url: "/api/getmajorlist",
    method: "get",
  });
}
