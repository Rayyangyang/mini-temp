import { defineStore } from 'pinia';
import * as services_home from "@/services/home.js"

export default defineStore('home', {
	state: () => ({
    list: [],
		pagination: {
		  current: 1,
		  pageSize: 10,
		  total: 0
		}
	}),
	actions: {
		async query(payload) {
      const { current, pageSize } = this.pagination;
		  const response = await services_home.query({ ...payload })
		  if(response?.code == 200) {
		    this.list = payload?.pageNum > 1 ? this.list.concat(response.data.list) : response.data.list
        this.pagination = {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
		  }
		  return response
		},
    async service({ payload, service }) {
      const response = await services_home[service]({ ...payload })
      return response
    },
	},
});
