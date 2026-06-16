import http from "../http-common";
import {ChargingRule, ListQueryParams} from '@app/types/pyhss';

class ChargingRuleApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/charging_rule/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/charging_rule/${id}`);
  }

  create(data: ChargingRule) {
    return http.put("/charging_rule/", data);
  }

  update(id: number, data: Partial<ChargingRule>) {
    return http.patch(`/charging_rule/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/charging_rule/${id}`);
  }
}

export default new ChargingRuleApi();
