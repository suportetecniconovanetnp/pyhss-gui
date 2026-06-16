import http from "../http-common";
import {Apn, ListQueryParams} from '@app/types/pyhss';

class ApnApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/apn/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/apn/${id}`);
  }

  create(data: Apn) {
    return http.put("/apn/", data);
  }

  update(id: number, data: Partial<Apn>) {
    return http.patch(`/apn/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/apn/${id}`);
  }
}

export default new ApnApi();
