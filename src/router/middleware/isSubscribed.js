// 检查用户是否订阅，如果已订阅可以访问，否则重定向到dashboard
export default function IsSubscribed({ next, store }) {
  if (!store.getters.auth.isSubscribed) {
    return next({
      name: 'dashboard'
    })
  }
  return next()
}
