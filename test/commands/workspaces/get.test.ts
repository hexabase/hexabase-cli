import {expect, test} from '@oclif/test'

describe('workspaces:get', () => {
  test
  .stdout()
  .command(['workspaces:get'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })
})
