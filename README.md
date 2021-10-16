hexabase-cli
============

Hexabase CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/hexabase-cli.svg)](https://npmjs.org/package/hexabase-cli)
[![Downloads/week](https://img.shields.io/npm/dw/hexabase-cli.svg)](https://npmjs.org/package/hexabase-cli)
[![License](https://img.shields.io/npm/l/hexabase-cli.svg)](https://github.com/b-eee/hexabase-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g hexabase-cli
$ hx COMMAND
running command...
$ hx (-v|--version|version)
hexabase-cli/0.2.2 darwin-x64 node-v14.16.0
$ hx --help [COMMAND]
USAGE
  $ hx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`hx actions:create DATASTORE_ID`](#hx-actionscreate-datastore_id)
* [`hx actions:delete DATASTORE_ID ACTION_ID`](#hx-actionsdelete-datastore_id-action_id)
* [`hx actions:get [DATASTORE_ID] [STATUS_ID]`](#hx-actionsget-datastore_id-status_id)
* [`hx actions:scripts:download ACTION_ID`](#hx-actionsscriptsdownload-action_id)
* [`hx actions:scripts:upload ACTION_ID FILE`](#hx-actionsscriptsupload-action_id-file)
* [`hx actions:show DATASTORE_ID ACTION_ID`](#hx-actionsshow-datastore_id-action_id)
* [`hx actions:update DATASTORE_ID ACTION_ID`](#hx-actionsupdate-datastore_id-action_id)
* [`hx apps:create`](#hx-appscreate)
* [`hx apps:init`](#hx-appsinit)
* [`hx autocomplete [SHELL]`](#hx-autocomplete-shell)
* [`hx contexts:get`](#hx-contextsget)
* [`hx contexts:login`](#hx-contextslogin)
* [`hx contexts:set CONTEXT`](#hx-contextsset-context)
* [`hx contexts:use [CONTEXT]`](#hx-contextsuse-context)
* [`hx datastores:get [PROJECT_ID]`](#hx-datastoresget-project_id)
* [`hx fields:create DATASTORE_ID`](#hx-fieldscreate-datastore_id)
* [`hx fields:delete DATASTORE_ID FIELD_ID`](#hx-fieldsdelete-datastore_id-field_id)
* [`hx fields:get [DATASTORE_ID]`](#hx-fieldsget-datastore_id)
* [`hx fields:show DATASTORE_ID FIELD_ID`](#hx-fieldsshow-datastore_id-field_id)
* [`hx fields:update DATASTORE_ID FIELD_ID`](#hx-fieldsupdate-datastore_id-field_id)
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx logs:actionscript CHANNEL`](#hx-logsactionscript-channel)
* [`hx projects:backup [TEMPLATE_ID]`](#hx-projectsbackup-template_id)
* [`hx projects:create`](#hx-projectscreate)
* [`hx projects:get`](#hx-projectsget)
* [`hx projects:restore FILE`](#hx-projectsrestore-file)
* [`hx projects:roles:get PROJECT_ID`](#hx-projectsrolesget-project_id)
* [`hx projects:save [PROJECT_ID]`](#hx-projectssave-project_id)
* [`hx statuses:get [DATASTORE_ID]`](#hx-statusesget-datastore_id)
* [`hx workspaces:get`](#hx-workspacesget)
* [`hx workspaces:use [WORKSPACE_ID]`](#hx-workspacesuse-workspace_id)

## `hx actions:create DATASTORE_ID`

create an action in a datastore

```
USAGE
  $ hx actions:create DATASTORE_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/actions/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/create.ts)_

## `hx actions:delete DATASTORE_ID ACTION_ID`

delete an action in a datastore

```
USAGE
  $ hx actions:delete DATASTORE_ID ACTION_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  ACTION_ID     action_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -y, --yes              skip confirmation
```

_See code: [src/commands/actions/delete.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/delete.ts)_

## `hx actions:get [DATASTORE_ID] [STATUS_ID]`

get actions in a datastore

```
USAGE
  $ hx actions:get [DATASTORE_ID] [STATUS_ID]

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  STATUS_ID     status_id of the status action

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx ac
```

_See code: [src/commands/actions/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/get.ts)_

## `hx actions:scripts:download ACTION_ID`

download actionscript file

```
USAGE
  $ hx actions:scripts:download ACTION_ID

ARGUMENTS
  ACTION_ID  action_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -o, --output=output    output file
  -t, --type=post|pre    (required) script type

ALIASES
  $ hx scripts:download
  $ hx as:get
```

_See code: [src/commands/actions/scripts/download.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/scripts/download.ts)_

## `hx actions:scripts:upload ACTION_ID FILE`

upload actionscript file

```
USAGE
  $ hx actions:scripts:upload ACTION_ID FILE

ARGUMENTS
  ACTION_ID  action_id from hexabase
  FILE       file to be uploaded, e.g. script.js

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -t, --type=post|pre    (required) script type
  -y, --yes              skip confirmation

ALIASES
  $ hx scripts:upload
  $ hx as:put
```

_See code: [src/commands/actions/scripts/upload.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/scripts/upload.ts)_

## `hx actions:show DATASTORE_ID ACTION_ID`

show details of an action

```
USAGE
  $ hx actions:show DATASTORE_ID ACTION_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  ACTION_ID     action_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/actions/show.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/show.ts)_

## `hx actions:update DATASTORE_ID ACTION_ID`

update an action in a datastore

```
USAGE
  $ hx actions:update DATASTORE_ID ACTION_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  ACTION_ID     action_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/actions/update.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/actions/update.ts)_

## `hx apps:create`

download & create new app from a template

```
USAGE
  $ hx apps:create

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of your app
```

_See code: [src/commands/apps/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/apps/create.ts)_

## `hx apps:init`

initialize app with hexabase settings

```
USAGE
  $ hx apps:init

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -f, --file=file        [default: hx-settings.json] hexabase settings file
  -h, --help             show CLI help

ALIASES
  $ hx init
```

_See code: [src/commands/apps/init.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/apps/init.ts)_

## `hx autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ hx autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ hx autocomplete
  $ hx autocomplete bash
  $ hx autocomplete zsh
  $ hx autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.2.0/src/commands/autocomplete/index.ts)_

## `hx contexts:get`

get contexts

```
USAGE
  $ hx contexts:get

OPTIONS
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx env
```

_See code: [src/commands/contexts/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/contexts/get.ts)_

## `hx contexts:login`

login to hexabase within current context

```
USAGE
  $ hx contexts:login

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help

ALIASES
  $ hx login
```

_See code: [src/commands/contexts/login.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/contexts/login.ts)_

## `hx contexts:set CONTEXT`

set context entries (server & sse)

```
USAGE
  $ hx contexts:set CONTEXT

ARGUMENTS
  CONTEXT  context name

OPTIONS
  -h, --help       show CLI help
  --server=server  API server, e.g. https://api.hexabase.com
  --sse=sse        SSE server, e.g. https://sse.hexabase.com
```

_See code: [src/commands/contexts/set.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/contexts/set.ts)_

## `hx contexts:use [CONTEXT]`

set current-context

```
USAGE
  $ hx contexts:use [CONTEXT]

ARGUMENTS
  CONTEXT  context name

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ hx use
```

_See code: [src/commands/contexts/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/contexts/use.ts)_

## `hx datastores:get [PROJECT_ID]`

get datastores within a project

```
USAGE
  $ hx datastores:get [PROJECT_ID]

ARGUMENTS
  PROJECT_ID  project_id from hexabase

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx ds
  $ hx datastores
```

_See code: [src/commands/datastores/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/datastores/get.ts)_

## `hx fields:create DATASTORE_ID`

create a field in a datastore

```
USAGE
  $ hx fields:create DATASTORE_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/fields/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/fields/create.ts)_

## `hx fields:delete DATASTORE_ID FIELD_ID`

delete a field in a datastore

```
USAGE
  $ hx fields:delete DATASTORE_ID FIELD_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  FIELD_ID      field_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -y, --yes              skip confirmation
```

_See code: [src/commands/fields/delete.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/fields/delete.ts)_

## `hx fields:get [DATASTORE_ID]`

get fields in a datastore

```
USAGE
  $ hx fields:get [DATASTORE_ID]

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx fd
  $ hx fields
```

_See code: [src/commands/fields/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/fields/get.ts)_

## `hx fields:show DATASTORE_ID FIELD_ID`

show details of a field

```
USAGE
  $ hx fields:show DATASTORE_ID FIELD_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  FIELD_ID      field_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/fields/show.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/fields/show.ts)_

## `hx fields:update DATASTORE_ID FIELD_ID`

update a field in a datastore

```
USAGE
  $ hx fields:update DATASTORE_ID FIELD_ID

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase
  FIELD_ID      field_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/fields/update.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/fields/update.ts)_

## `hx help [COMMAND]`

display help for hx

```
USAGE
  $ hx help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `hx logs:actionscript CHANNEL`

get logs from actionscript

```
USAGE
  $ hx logs:actionscript CHANNEL

ARGUMENTS
  CHANNEL  input format: logs_<user_id>_<project_id>

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/logs/actionscript.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/logs/actionscript.ts)_

## `hx projects:backup [TEMPLATE_ID]`

download template file

```
USAGE
  $ hx projects:backup [TEMPLATE_ID]

ARGUMENTS
  TEMPLATE_ID  template_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -o, --output=output    output file
```

_See code: [src/commands/projects/backup.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/backup.ts)_

## `hx projects:create`

create new project within current workspace

```
USAGE
  $ hx projects:create

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/projects/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/create.ts)_

## `hx projects:get`

get projects in current workspace

```
USAGE
  $ hx projects:get

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx pj
  $ hx projects
```

_See code: [src/commands/projects/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/get.ts)_

## `hx projects:restore FILE`

restore a project from a template file

```
USAGE
  $ hx projects:restore FILE

ARGUMENTS
  FILE  zip file to be restored from, e.g. template.zip

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -n, --name=name        name of the project to be restored
  -y, --yes              skip confirmation
```

_See code: [src/commands/projects/restore.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/restore.ts)_

## `hx projects:roles:get PROJECT_ID`

get roles of a project

```
USAGE
  $ hx projects:roles:get PROJECT_ID

ARGUMENTS
  PROJECT_ID  project_id from hexabase

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/projects/roles/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/roles/get.ts)_

## `hx projects:save [PROJECT_ID]`

save template from a project

```
USAGE
  $ hx projects:save [PROJECT_ID]

ARGUMENTS
  PROJECT_ID  project_id from hexabase

OPTIONS
  -c, --context=context    use provided context instead of currently set context
  -d, --download=download  download output file (e.g. my_template.zip)
  -h, --help               show CLI help
```

_See code: [src/commands/projects/save.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/projects/save.ts)_

## `hx statuses:get [DATASTORE_ID]`

get statuses in a datastore

```
USAGE
  $ hx statuses:get [DATASTORE_ID]

ARGUMENTS
  DATASTORE_ID  datastore_id from hexabase

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx st
  $ hx status
```

_See code: [src/commands/statuses/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/statuses/get.ts)_

## `hx workspaces:get`

get workspaces from hexabase

```
USAGE
  $ hx workspaces:get

OPTIONS
  -c, --context=context   use provided context instead of currently set context
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

ALIASES
  $ hx ws
  $ hx workspaces
```

_See code: [src/commands/workspaces/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/workspaces/get.ts)_

## `hx workspaces:use [WORKSPACE_ID]`

set current workspace in hexabase

```
USAGE
  $ hx workspaces:use [WORKSPACE_ID]

ARGUMENTS
  WORKSPACE_ID  workspace_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help

ALIASES
  $ hx select
  $ hx sel
```

_See code: [src/commands/workspaces/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.2.2/src/commands/workspaces/use.ts)_
<!-- commandsstop -->
