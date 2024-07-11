/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.LoginParams } | undefined) {
  //将接口换了
  const { currentUser } = initialState ?? {};
  return {
    // canAdmin: currentUser && currentUser.access === 'admin',  //登录用户名为admin可以看到哪些页面
    // canBoss: currentUser && currentUser.access === 'gcz',   //登录用户名位gcz可以看到哪些页面
    // canSuper: currentUser && currentUser.access.email === 'super@a.com'||currentUser,
    //    //登录用可以看到哪些页面
    Boss:
      currentUser &&
      currentUser.access_token ===
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5zaG9wLmVkdXdvcmsuY24vYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3MjA3MDMxMjMsImV4cCI6MTcyMTA2MzEyMywibmJmIjoxNzIwNzAzMTIzLCJqdGkiOiJHTXFSeEFoQnpJdENIRUZTIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.w7oMP2QYvZyqKqG68v8bZ63Ib1ynk85sso7z7JrQtUQ',
    Boss1: currentUser && currentUser.password === '123123',
  };
}
