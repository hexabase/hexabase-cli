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
hexabase-cli/0.0.0 darwin-x64 node-v14.13.0
$ hx --help [COMMAND]
USAGE
  $ hx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`hx apps:init`](#hx-appsinit)
* [`hx autocomplete [SHELL]`](#hx-autocomplete-shell)
* [`hx contexts:get`](#hx-contextsget)
* [`hx contexts:login`](#hx-contextslogin)
* [`hx contexts:set CONTEXT`](#hx-contextsset-context)
* [`hx contexts:use [CONTEXT]`](#hx-contextsuse-context)
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx logs:actionscript CHANNEL`](#hx-logsactionscript-channel)
* [`hx workspaces:get`](#hx-workspacesget)
* [`hx workspaces:use [WORKSPACEID]`](#hx-workspacesuse-workspaceid)

## `hx apps:init`

initialize a new app

```
USAGE
  $ hx apps:init

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of your app
```

_See code: [src/commands/apps/init.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/apps/init.ts)_

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

_See code: [src/commands/contexts/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/contexts/get.ts)_

## `hx contexts:login`

log in to hexabase within current context

```
USAGE
  $ hx contexts:login

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/contexts/login.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/contexts/login.ts)_

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

_See code: [src/commands/contexts/set.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/contexts/set.ts)_

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

_See code: [src/commands/contexts/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/contexts/use.ts)_

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
  CHANNEL  input format: logs_<userId>_<projectId>

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/logs/actionscript.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/logs/actionscript.ts)_

## `hx workspaces:get`

get workspaces from hexabase

```
USAGE
  $ hx workspaces:get

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

_See code: [src/commands/workspaces/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/workspaces/get.ts)_

## `hx workspaces:use [WORKSPACEID]`

set current workspace in hexabase

```
USAGE
  $ hx workspaces:use [WORKSPACEID]

ARGUMENTS
  WORKSPACEID  workspaceId from hexabase

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/workspaces/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/workspaces/use.ts)_
<!-- commandsstop -->
