import {expect, test} from '@oclif/test'

describe('ConfigContextSet', () => {
  test
  .stdout()
  .command(['ConfigContextSet'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['ConfigContextSet', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
