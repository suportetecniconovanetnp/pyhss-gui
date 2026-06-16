import http from "../http-common";
import {ImsSubscriber, ListQueryParams} from '@app/types/pyhss';

class ImsSubscriberApi {
  getAll(params: ListQueryParams = {}) {
    return http.get("/ims_subscriber/list", {
      params: {
        page: params.page ?? 0,
        page_size: params.pageSize ?? 200
      }
    });
  }

  get(id: number) {
    return http.get(`/ims_subscriber/${id}`);
  }

  create(data: ImsSubscriber) {
    return http.put("/ims_subscriber/", data);
  }

  update(id: number, data: Partial<ImsSubscriber>) {
    return http.patch(`/ims_subscriber/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/ims_subscriber/${id}`);
  }

  findByImsi(imsi: string) {
    return http.get(`/ims_subscriber/ims_subscriber_imsi/${imsi}`);
  }

  findManyByImsi(imsis: string[]) {
    return Promise.all(imsis.map((imsi: string) => this.findByImsi(imsi)
        .catch(function() {
          return { statusText: 'FAILED' };
        })
    ))
  }

  findByMsisdn(id: string) {
    return http.get(`/ims_subscriber/ims_subscriber_msisdn/${id}`);
  }
}

export default new ImsSubscriberApi();
