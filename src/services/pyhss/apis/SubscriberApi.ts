import http from "../http-common";
import {ListQueryParams, Subscriber} from '@app/types/pyhss';

class SubscriberApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/subscriber/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/subscriber/${id}`);
  }

  create(data: Subscriber) {
    return http.put("/subscriber/", data);
  }

  update(id: number, data: Partial<Subscriber>) {
    return http.patch(`/subscriber/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/subscriber/${id}`);
  }

  findByMsisdn(msisdn: string) {
    return http.get(`/subscriber/msisdn/${msisdn}`) 
  }

  findByImsi(imsi: string) {
    return http.get(`/subscriber/imsi/${imsi}`);
  }

  findManyByImsi(imsis: string[]) {
    return Promise.all(imsis.map((imsi: string) => this.findByImsi(imsi)
        .catch(function() {
          return { statusText: 'FAILED' };
        })
    ))
  }
}

export default new SubscriberApi();
