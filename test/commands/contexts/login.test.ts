import {expect, test} from '@oclif/test'

describe('contextLogin', () => {
  test
  .stdout()
  .command(['contextLogin'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['contextLogin', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
