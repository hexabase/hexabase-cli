import {expect, test} from '@oclif/test'

describe('logsActionscript', () => {
  test
  .stdout()
  .command(['logsActionscript'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['logsActionscript', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
