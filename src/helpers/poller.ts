/* eslint-disable no-await-in-loop */
function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export class Poller {
  private _attempts: number

  private _maxAttempts: number

  constructor(maxAttempts: number) {
    this._attempts = 0
    this._maxAttempts = maxAttempts
  }

  async poll(fn: any, retryCondition: (arg: any) => boolean, ms: number) {
    let result = await fn()
    while (retryCondition(result)) {
      if (this._maxAttempts > -1 && this._attempts >= this._maxAttempts) {
        break
      }
      this._attempts += 1
      await wait(ms)
      result = await fn()
    }
    return result
  }
}
