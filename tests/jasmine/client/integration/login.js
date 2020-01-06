describe('Login', () => {
  beforeEach(done => {
    Router.go('/login')
    Tracker.afterFlush(done)
  })

  beforeEach(waitForRouter)

  it('should land on the login page', () => {
    expect(location.pathname).toEqual('/login')
  })
})
