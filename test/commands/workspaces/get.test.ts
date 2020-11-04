import {expect, test} from '@oclif/test'

describe('workspacesGet', () => {
  test
  .stdout()
  .command(['workspacesGet'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['workspacesGet', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
