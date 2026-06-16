import http from "../http-common";
import {Auc, ListQueryParams} from '@app/types/pyhss';

class AucApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/auc/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/auc/${id}`);
  }

  create(data: Auc) {
    return http.put("/auc/", data);
  }

  update(id: number, data: Partial<Auc>) {
    return http.patch(`/auc/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/auc/${id}`);
  }
  findByImsi(imsi: string) {
    return http.get(`/auc/imsi/${imsi}`);
  }
  findByIccid(iccid: string) {
    return http.get(`/auc/iccid/${iccid}`);
  }
}

export default new AucApi();
