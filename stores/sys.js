import { defineStore } from 'pinia';
import * as services_sys from "@/services/sys.js"
import { setUnionuser, setToken } from "@/utils/config.js"

export default defineStore('sys', {
	actions: {
		async login(payload) {
		  const response = await services_sys.login({ ...payload })
		  if(response?.code == 200) {
		    setUnionuser(response.data)
		    setToken(response.data.token)
		    uni.navigateBack()
		  } else {
		    uni.showToast({ title: response.msg, icon: 'none', mask: true })
		  }
		  return response
		},
		async service({ payload, service }) {
		  const response = await services_sys[service]({ ...payload })
		  return response
		},
	},
});