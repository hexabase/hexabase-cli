import {expect, test} from '@oclif/test'
import * as ws from '../../../src/api/workspaces/workspaces'

describe('workspaces:get', () => {
  test
  .stub(ws, 'get', () => {
    return {
      workspaces: [
        {workspace_id: '12345', workspace_name: 'test'},
      ],
      current_workspace_id: '12345',
    }
  })
  .stdout()
  .command(['workspaces:get', '-c', 'local'])
  .it('runs', ctx => {
    expect(ctx.stdout).to.contain('ID                            NAME \n12345                         test \nCurrent-workspace set to: test\n')
  })
})
