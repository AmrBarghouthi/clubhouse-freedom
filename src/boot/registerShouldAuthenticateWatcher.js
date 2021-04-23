export default ({ router, store }) => {
  const isVerifiedFn = (_, getters) => getters['auth/isVerified']
  const shouldAuthenticateCb = isVerified => {
    if (!isVerified && router.currentRoute.name !== 'auth.login') {
      router.push({ name: 'auth.login' })
    }
  }
  router.onReady(() => store.watch(isVerifiedFn, shouldAuthenticateCb, { immediate: true }))
}
