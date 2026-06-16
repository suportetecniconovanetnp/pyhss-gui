import http from "../http-common";
import {ListQueryParams, Tft} from '@app/types/pyhss';

class TftApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/tft/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/tft/${id}`);
  }

  create(data: Tft) {
    return http.put("/tft/", data);
  }

  update(id: number, data: Partial<Tft>) {
    return http.patch(`/tft/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/tft/${id}`);
  }
}

export default new TftApi();
