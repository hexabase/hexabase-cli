import {expect, test} from '@oclif/test'

describe('workspaces:get', () => {
  test
  .nock('http://localhost:7575', api => api
  .get('/api/v0/workspaces')
  .reply(200, {
    workspaces: [
      {workspace_id: '12345', workspace_name: 'test'},
    ],
    current_workspace_id: '12345',
  })
  )
  .stdout()
  .command(['workspaces:get', '-c', 'local'])
  .it('runs', ctx => {
    expect(ctx.stdout).to.contain('ID    NAME \n12345 test \nCurrent-workspace set to: test\n')
  })
})
