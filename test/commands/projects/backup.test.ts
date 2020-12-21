import {expect, test} from '@oclif/test'

describe('projectsBackup', () => {
  test
  .stdout()
  .command(['projectsBackup'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['projectsBackup', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
