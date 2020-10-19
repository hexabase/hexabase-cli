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
* [`hx help [COMMAND]`](#hx-help-command)
* [`hx init`](#hx-init)
* [`hx login`](#hx-login)
* [`hx select:workspace WORKSPACEID`](#hx-selectworkspace-workspaceid)

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

_See code: [src/commands/init/index.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/init/index.ts)_

## `hx login`

log in to hexabase

```
USAGE
  $ hx login
```

_See code: [src/commands/login/index.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/login/index.ts)_

## `hx select:workspace WORKSPACEID`

set current workspace

```
USAGE
  $ hx select:workspace WORKSPACEID

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/select/workspace.ts](https://github.com/b-eee/hexabase-cli/blob/v0.0.0/src/commands/select/workspace.ts)_
<!-- commandsstop -->
