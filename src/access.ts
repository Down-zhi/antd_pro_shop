/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',  //登录用户名为admin可以看到哪些页面
    canBoss: currentUser && currentUser.access === 'gcz',   //登录用户名位gcz可以看到哪些页面
  };
}
