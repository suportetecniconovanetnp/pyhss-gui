import http from "../http-common";
import {ListQueryParams, RoamingNetwork} from '@app/types/pyhss';

class RoamingNetworkApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/roaming/network/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/roaming/network/${id}`);
  }

  create(data: RoamingNetwork) {
    return http.put(`/roaming/network/`, data);
  }

  update(id: number, data: Partial<RoamingNetwork>) {
    return http.patch(`/roaming/network/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/roaming/network/${id}`);
  }
}

export default new RoamingNetworkApi();
