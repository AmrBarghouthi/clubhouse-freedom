export default ({ router, store }) => {
  const isBlockedFn = (_, getters) => getters['auth/isBlocked']
  const isBlockedCb = isBlocked => {
    if (isBlocked) {
      router.push({ name: 'auth.blocked' })
    } else if (router.currentRoute.name === 'auth.blocked') {
      router.push({ name: 'index' })
    }
  }

  router.onReady(() => store.watch(isBlockedFn, isBlockedCb, { immediate: true }))
}
