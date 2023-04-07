import { ref } from 'vue';
export default ({ store }) => {
  // // 确保您的打包器可以处理这个问题。 webpack 和 vite 应该默认这样做
  if(process.env.NODE_ENV === 'development') {
    // 添加您在 store 中设置的任何 keys
    // store._customProperties.add('hello')
  }
  const loading = ref(false)
  store.loading = loading
  store.$subscribe(() => {
    // 在存储变化的时候执行
    // console.log('$subscribe')
  })
  store.$onAction(({
    name, // action 函数的名称
    store, // store 实例，这里是 mainStore
    args, // action 函数参数数组
    after, // 钩子函数，在action函数执行完成返回或者resolves后执行
    onError, // 钩子函数，在action函数报错或者rejects后执行
  }) => {
    // 在 action 的时候执行
    // console.log('action', store, name)
    loading.value = true
    after(() => {
      // console.log('$onAction after函数')
      loading.value = false
    })
    onError(error => {
			loading.value = false
      console.log('错误捕获', error)
    })
  })
}
