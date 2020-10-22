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
* [`hx app:init`](#hx-appinit)
* [`hx context:get`](#hx-contextget)
* [`hx context:login`](#hx-contextlogin)
* [`hx context:set NAME`](#hx-contextset-name)
* [`hx context:use [CONTEXT]`](#hx-contextuse-context)
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx logs:actionscript CHANNEL`](#hx-logsactionscript-channel)
* [`hx workspaces:get RESOURCE`](#hx-workspacesget-resource)
* [`hx workspaces:use RESOURCE WORKSPACEID`](#hx-workspacesuse-resource-workspaceid)

## `hx app:init`

initialize a new app

```
USAGE
  $ hx app:init

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of your app
```

_See code: [src/commands/app/init.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/app/init.ts)_

## `hx context:get`

get contexts

```
USAGE
  $ hx context:get

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/context/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/context/get.ts)_

## `hx context:login`

log in to hexabase within current context

```
USAGE
  $ hx context:login

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/context/login.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/context/login.ts)_

## `hx context:set NAME`

set context entries (server, sse, etc)

```
USAGE
  $ hx context:set NAME

OPTIONS
  -h, --help       show CLI help
  --server=server  API server address, e.g. http://localhost
  --sse=sse        SSE server address, e.g. http://localhost
```

_See code: [src/commands/context/set.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/context/set.ts)_

## `hx context:use [CONTEXT]`

set current context

```
USAGE
  $ hx context:use [CONTEXT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/context/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/context/use.ts)_

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

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/logs/actionscript.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/logs/actionscript.ts)_

## `hx workspaces:get RESOURCE`

get workspaces from hexabase

```
USAGE
  $ hx workspaces:get RESOURCE

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

## `hx workspaces:use RESOURCE WORKSPACEID`

set current workspace in hexabase

```
USAGE
  $ hx workspaces:use RESOURCE WORKSPACEID

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/workspaces/use.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/workspaces/use.ts)_
<!-- commandsstop -->
