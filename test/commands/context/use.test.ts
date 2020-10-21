import {expect, test} from '@oclif/test'

describe('contextUse', () => {
  test
  .stdout()
  .command(['contextUse'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['contextUse', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
