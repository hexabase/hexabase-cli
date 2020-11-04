import {expect, test} from '@oclif/test'

describe('projectsCreate', () => {
  test
  .stdout()
  .command(['projectsCreate'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['projectsCreate', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
