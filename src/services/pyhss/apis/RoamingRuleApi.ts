import http from "../http-common";
import {ListQueryParams, RoamingRule} from '@app/types/pyhss';

class RoamingRuleApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/roaming/rule/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/roaming/rule/${id}`);
  }

  create(data: RoamingRule) {
    return http.put("/roaming/rule/", data);
  }

  update(id: number, data: Partial<RoamingRule>) {
    return http.patch(`/roaming/rule/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/roaming/rule/${id}`);
  }
}

export default new RoamingRuleApi();
