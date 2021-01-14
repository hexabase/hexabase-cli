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
hexabase-cli/0.1.0 darwin-x64 node-v14.13.0
$ hx --help [COMMAND]
USAGE
  $ hx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`hx actions:get DATASTOREID [STATUSID]`](#hx-actionsget-datastoreid-statusid)
* [`hx apps:create`](#hx-appscreate)
* [`hx apps:init`](#hx-appsinit)
* [`hx autocomplete [SHELL]`](#hx-autocomplete-shell)
* [`hx contexts:get`](#hx-contextsget)
* [`hx contexts:login`](#hx-contextslogin)
* [`hx contexts:set CONTEXT`](#hx-contextsset-context)
* [`hx contexts:use [CONTEXT]`](#hx-contextsuse-context)
* [`hx datastores:get [PROJECTID]`](#hx-datastoresget-projectid)
* [`hx fields:create`](#hx-fieldscreate)
* [`hx fields:get DATASTOREID`](#hx-fieldsget-datastoreid)
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx logs:actionscript CHANNEL`](#hx-logsactionscript-channel)
* [`hx projects:backup [TEMPLATEID]`](#hx-projectsbackup-templateid)
* [`hx projects:create`](#hx-projectscreate)
* [`hx projects:get`](#hx-projectsget)
* [`hx projects:restore FILE`](#hx-projectsrestore-file)
* [`hx workspaces:get`](#hx-workspacesget)
* [`hx workspaces:use [WORKSPACEID]`](#hx-workspacesuse-workspaceid)

## `hx actions:get DATASTOREID [STATUSID]`

get actions of a datastore

```
USAGE
  $ hx actions:get DATASTOREID [STATUSID]

ARGUMENTS
  DATASTOREID  datastore_id from hexabase
  STATUSID     status_id of the status action

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

_See code: [src/commands/actions/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/actions/get.ts)_

## `hx apps:create`

download & create new app from a template

```
USAGE
  $ hx apps:create

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of your app
```

_See code: [src/commands/apps/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/apps/create.ts)_

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

_See code: [src/commands/apps/init.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/apps/init.ts)_

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
```

_See code: [src/commands/contexts/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/contexts/get.ts)_

## `hx contexts:login`

log in to hexabase within current context

```
USAGE
  $ hx contexts:login

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help

ALIASES
  $ hx login
```

_See code: [src/commands/contexts/login.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/contexts/login.ts)_

## `hx contexts:set CONTEXT`

set context entries (server, sse, etc)

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

_See code: [src/commands/contexts/set.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/contexts/set.ts)_

## `hx contexts:use [CONTEXT]`

set current-context

```
USAGE
  $ hx contexts:use [CONTEXT]

ARGUMENTS
  CONTEXT  context name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/contexts/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/contexts/use.ts)_

## `hx datastores:get [PROJECTID]`

get datastores within a project

```
USAGE
  $ hx datastores:get [PROJECTID]

ARGUMENTS
  PROJECTID  project_id from hexabase

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

_See code: [src/commands/datastores/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/datastores/get.ts)_

## `hx fields:create`

create field of a database

```
USAGE
  $ hx fields:create

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/fields/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/fields/create.ts)_

## `hx fields:get DATASTOREID`

get fields of a datastore

```
USAGE
  $ hx fields:get DATASTOREID

ARGUMENTS
  DATASTOREID  datastore_id from hexabase

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

_See code: [src/commands/fields/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/fields/get.ts)_

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

_See code: [src/commands/logs/actionscript.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/logs/actionscript.ts)_

## `hx projects:backup [TEMPLATEID]`

download template file

```
USAGE
  $ hx projects:backup [TEMPLATEID]

ARGUMENTS
  TEMPLATEID  template_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
  -o, --output=output    output file
```

_See code: [src/commands/projects/backup.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/projects/backup.ts)_

## `hx projects:create`

create new project within current workspace

```
USAGE
  $ hx projects:create

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/projects/create.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/projects/create.ts)_

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
```

_See code: [src/commands/projects/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/projects/get.ts)_

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

_See code: [src/commands/projects/restore.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/projects/restore.ts)_

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
```

_See code: [src/commands/workspaces/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/workspaces/get.ts)_

## `hx workspaces:use [WORKSPACEID]`

set current workspace in hexabase

```
USAGE
  $ hx workspaces:use [WORKSPACEID]

ARGUMENTS
  WORKSPACEID  workspace_id from hexabase

OPTIONS
  -c, --context=context  use provided context instead of currently set context
  -h, --help             show CLI help
```

_See code: [src/commands/workspaces/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.1.0/src/commands/workspaces/use.ts)_
<!-- commandsstop -->
