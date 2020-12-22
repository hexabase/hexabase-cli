import {expect, test} from '@oclif/test'

describe('projectsRestore', () => {
  test
  .stdout()
  .command(['projectsRestore'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['projectsRestore', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
