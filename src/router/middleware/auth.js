// 用store检查用户是否已经dashboard，根据用户是否已经登录，要么继续请求，要么重定向到登录页面
export default function auth({ next, store }) {
  if (!store.getters.auth.loggedIn) {
    return next({
      name: 'login'
    })
  }
  return next()
}
