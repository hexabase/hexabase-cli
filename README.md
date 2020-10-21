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
* [`hx context:set NAME`](#hx-contextset-name)
* [`hx get RESOURCE`](#hx-get-resource)
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx init`](#hx-init)
* [`hx login`](#hx-login)
* [`hx logs:actionscript [CHANNEL]`](#hx-logsactionscript-channel)
* [`hx select RESOURCE WORKSPACEID`](#hx-select-resource-workspaceid)

## `hx context:set NAME`

describe the command here

```
USAGE
  $ hx context:set NAME

OPTIONS
  -h, --help       show CLI help
  --server=server  API server address, e.g. http://localhost
  --sse=sse        SSE server address, e.g. http://localhost
```

_See code: [src/commands/context/set.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/context/set.ts)_

## `hx get RESOURCE`

get resources from hexabase

```
USAGE
  $ hx get RESOURCE

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

_See code: [src/commands/get.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/get.ts)_

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

## `hx init`

initialize a new app

```
USAGE
  $ hx init

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of your app
```

_See code: [src/commands/init.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/init.ts)_

## `hx login`

log in to hexabase

```
USAGE
  $ hx login

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/login.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/login.ts)_

## `hx logs:actionscript [CHANNEL]`

get logs from actionscript

```
USAGE
  $ hx logs:actionscript [CHANNEL]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/logs/actionscript.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/logs/actionscript.ts)_

## `hx select RESOURCE WORKSPACEID`

set current workspace

```
USAGE
  $ hx select RESOURCE WORKSPACEID

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/select.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/select.ts)_
<!-- commandsstop -->
