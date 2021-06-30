// 中间件检查用户是否通过了身份验证，通过就会被重定向到dashboard
export default function guest ({ next, store }) {
  if (store.getters.auth.loggedIn) {
    return next({
      name: 'dashboard'
    })
  }
  return next()
}
