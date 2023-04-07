import { defineStore } from 'pinia';
import * as services_sys from "@/services/sys.js"

export default defineStore('global', {
	state: () => ({
    apkInfo: {},
    haveNew: false
	}),
	actions: {
    async checkAndroidUpdate(payload) {
      const response = await services_sys.checkAndroidUpdate({ ...payload })
      if(response.id) {
        this.apkInfo = response
        plus.runtime.getProperty(plus.runtime.appid, res => {
          // console.log(res.version);
          if(res.version != response.newVersion){
            setTimeout(() => uni.getSubNVueById('appUpdate').show(),500); 
            this.haveNew = true
          }
        });
      }
      return response
    },
	},
});