import http from "../http-common";
import {Eir, ListQueryParams} from '@app/types/pyhss';

class EirApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/eir/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  getHistory(params: ListQueryParams = {}) {
    return http.get("/eir/eir_history/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/eir/${id}`);
  }

  create(data: Eir) {
    return http.put("/eir/", data);
  }

  update(id: number, data: Partial<Eir>) {
    return http.patch(`/eir/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/eir/${id}`);
  }
}

export default new EirApi();
