import {expect, test} from '@oclif/test'

describe('appsCreate', () => {
  test
  .stdout()
  .command(['appsCreate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['appsCreate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
