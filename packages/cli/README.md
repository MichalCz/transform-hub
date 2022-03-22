<h1 align="center"><strong>Scramjet Command Line Interface</strong></h1>

<p align="center">
    <a href="https://github.com/scramjetorg/transform-hub/blob/HEAD/LICENSE"><img src="https://img.shields.io/github/license/scramjetorg/transform-hub?color=green&style=plastic" alt="GitHub license" /></a>
    <a href="https://npmjs.org/package/@scramjet/sth"><img src="https://img.shields.io/github/v/tag/scramjetorg/transform-hub?label=version&color=blue&style=plastic" alt="STH version" /></a>
    <a href="https://github.com/scramjetorg/transform-hub"><img src="https://img.shields.io/github/stars/scramjetorg/transform-hub?color=pink&style=plastic" alt="GitHub stars" /></a>
    <a href="https://npmjs.org/package/@scramjet/sth"><img src="https://img.shields.io/npm/dt/@scramjet/sth?color=orange&style=plastic" alt="npm" /></a>
    <a href="https://discord.gg/TTqCpHDjHz"><img alt="Discord" src="https://img.shields.io/discord/925384545342201896?label=discord&style=plastic"></a>
    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7F7V65C43EBMW">
        <img src="https://img.shields.io/badge/Donate-PayPal-green.svg?color=yellow&style=plastic" alt="Donate" />
    </a>
</p>
<p align="center">⭐ Star us on GitHub — it motivates us a lot! 🚀 </p>
<p align="center">
    <img src="https://assets.scramjet.org/sth-logo.svg" alt="Scramjet Transform Hub Logo">
</p>

This package provides a Scramjet Command Line Interface to communicate with Transform Hub and Cloud Platform. The document is focused mainly on the Scramjet Transform Hub part.

1. Install the Scramjet CLI.<br /><br />

    ```bash
    npm install -g @scramjet/cli
    ```

    Once installed, the Scramjet CLI is available under the `si` command that stands for _Scramjet Interface_.<br /><br />

2. Install the autocompletion script.<br />
   To use Scramjet CLI with command hints, please install completion script. It depends on bash-completion so first make sure it's already installed by running `type _init_completion`.<br /><br />

    Below command installs completion script in `~/.bashrc`.<br /><br />

    ```bash
    si completion install
    ```

    Running command `si completion bash` prints script to the terminal.

## Commands <!-- omit in toc -->

- [Show help](#show-help)
- [Manage config](#manage-config)
- [Hub operations](#hub-operations)
- [Create a package](#create-a-package)
- [Sequence operations](#sequence-operations)
- [Instance operations](#instance-operations)

## Show help

Check the available commands by typing `si --help` in the terminal.

```bash
USAGE
   si [options...]
   si [command] [options...]
   si [command] [subcommand] [options...]

GLOBAL OPTIONS
   -L, --log-level <level>     specify log level (default: "trace")
   -f, --format <value>        specify display formatting: json or pretty (default: "pretty")
   -h, --help                  display help for command
   -v, --version               display version

COMMANDS
   config, c                   contains default configuration settings that are
   hub                         allows to run programs in different data centers, computers or devices in local network
   sequence, seq               operations on sequence of chained functions aka program
   instance, inst              operations on running sequence aka computing instance
   topic                       publish/subscribe operations allows to manage data flow
   template, tmpl, init        create template and start working on your sequence
```

Show subcommand help by providing `--help` or `-h` option after each as in example below.

```bash
USAGE
    si [command] --help

EXAMPLE
    si sequence -h
```

## Manage config

1. First set environmental vale.<br />
   In order to use STH CLI commands the **environment should be set to develop**. If this is the first installation of Scramjet CLI, the **default value** of the environment **is set to `develop` mode**. To check the config values use `si config print` command.<br /><br />

    > Ad. An environmental value that is set to production allows to use commands of the Scramjet Cloud Platform. We encourage you to [sign up for the SCP Beta](https://scramjet.org/#join-beta).

2. Second set STH apiUrl.<br />
   In order to use STH the hub should be running under the given URL. e.g.: `si config set apiUrl http://0.0.0.0:8080/api/v1`<br /><br />

    > Ad. An URL pattern looks like this: `http://<localhost|IPaddress>:<portNumber>/api/v1`

```bash

DESCRIPTION
    Config contains default Scramjet Transform Hub (STH) and Scramjet Cloud Platform (SCP) settings.
    File is located under ~/.si/config.

USAGE
    si config [subcommand]

SUBCOMMANDS
    print|p                              prints out on the terminal default config
    set <pathToFile>|{json}              set config from file or pass json object
    set apiUrl <apiUrl>                  specify the hub API url (default: "http://localhost:8000/api/v1")
    set middlewareApiUrl <url>           specify middleware API url to use Cloud Platform (default: "")
    set scope <name>                     specify default scope that should be used when session start
    set env <production|develop>         specify the environment (default: develop)
    unset|del <apiUrl|middlewareApiUrl>  unset config value

```

## Hub operations

```bash
si host version # display the Host version
si host load    # monitor CPU, memory and disk usage on the Host
si host logs    # display the logs of the Host.
```

## Create a package

Usage: `si pack [options] <directory>`

Options:

-   `-c, --stdout output to stdout (ignores -o)`
-   `-o, --output <file.tar.gz> output path - defaults to dirname`
-   `-h, --help display help for command`

## Sequence operations

```bash
si seq run [options] [package] [args...] # Uploads a package and immediately executes it with given arguments
si seq send [<sequencePackage>]          # send packed and compressed sequence file
si seq list|ls                           # list the sequences
si seq start [options] <id> [args...]    # start the sequence
si seq get <id>                          # get data about the sequence
si seq delete|rm <id>                    # delete the sequence
si seq help [command]                    # display help for command
```

## Instance operations

```bash
si inst list|ls                                       # list the instances
si inst kill <id>                                     # kill instance without waiting for unfinished tasks
si inst stop <id> <timeout>                           # end instance gracefully waiting for unfinished tasks
si inst status <id>                                   # status data about the instance
si inst health <id>                                   # show the instance health status
si inst info <id>                                     # show info about the instance
si inst invokeEvent|emit <id> <eventName> [<payload>] # send event with eventName and a JSON formatted event payload
si inst event|on [options] <id> <event>               # get the last event occurrence (will wait for the first one if not yet retrieved)
si inst input <id> [<file>]                           # send file to input, if file not given the data will be read from stdin
si inst output <id>                                   # show stream on output
si inst log <id>                                      # show instance log
si inst attach <id>                                   # connect to all stdio - stdin, stdout, stderr of a running instance
si inst stdin <id> [<file>]                           # send file to stdin, if file not given the data will be read from stdin
si inst stderr <id>                                   # show stream on stderr
si inst stdout <id>                                   # show stream on stdout
si inst help [command]                                # display help for command
```

## Docs <!-- omit in toc -->

See the code documentation here: [scramjetorg/transform-hub/docs/cli/modules.md](https://github.com/scramjetorg/transform-hub/tree/HEAD/docs/cli/modules.md)

## Scramjet Transform Hub <!-- omit in toc -->

This package is part of [Scramjet Transform Hub](https://www.npmjs.org/package/@scramjet/sth).

Scramjet Transform Hub is a deployment and execution platform. Once installed on a server, it will allow you to start your programs and keep them running on a remote machine. You will be able to start programs in the background or connect to them and see their output directly on your terminal. You will be able to pipe your local data to the program, as if it was running from your terminal. You can start your server in AWS, Google Cloud or Azure, start it on your local machine, install it on a Raspberry Pi or wherever else you'd like.

## Use cases <!-- omit in toc -->

There's no limit what you can use it for. You want a stock checker? A chat bot? Maybe you'd like to automate your home? Retrieve sensor data? Maybe you have a lot of data and want to transfer and wrangle it? You have a database of cities and you'd like to enrich your data? You do machine learning and you want to train your set while the data is fetched in real time? Hey, you want to use it for something else and ask us if that's a good use? Ask us [via email](mailto:get@scramjet.org) or hop on our [Scramjet Discord](https://discord.gg/4EX3jHBe)!

## Some important links <!-- omit in toc -->

-   Scramjet, the company behind [Transform Hub](https://scramjet.org)
-   The [Scramjet Framework - functional reactive stream processing framework](https://framework.scramjet.org)
-   The [Transform Hub repo on github](https://github.com/scramjetorg/transform-hub)
-   You can see the [Scramjet Transform Hub API docs here](https://github.com/scramjetorg/transform-hub/tree/HEAD/docs/api-client/README.md)
-   You can see the [CLI documentation here](https://github.com/scramjetorg/transform-hub/tree/HEAD/packages/cli/README.md), but `si help` should also be quite effective.
-   Don't forget to ⭐ this repo if you like it, `subscribe` to releases and keep visiting us for new versions and updates.
-   You can [open an issue - file a bug report or a feature request here](https://github.com/scramjetorg/transform-hub/issues/new/choose)

## License and contributions <!-- omit in toc -->

This module is licensed under AGPL-3.0 license.

The Scramjet Transform Hub project is dual-licensed under the AGPL-3.0 and MIT licenses. Parts of the project that are linked with your programs are MIT licensed, the rest is AGPL.

## Contributions <!-- omit in toc -->

We accept valid contributions and we will be publishing a more specific project roadmap so contributors can propose features and also help us implement them. We kindly ask you that contributed commits are Signed-Off `git commit --sign-off`.

We provide support for contributors via test cases. If you expect a certain type of workflow to be officially supported, please specify and implement a test case in `Gherkin` format in `bdd` directory and include it in your pull request. More info about our BDD test you will find [here](https://github.com/scramjetorg/transform-hub/tree/HEAD/bdd/README.md).

### Help wanted 👩‍🎓🧑👱‍♀️ <!-- omit in toc -->

The project need's your help! There's lots of work to do and we have a lot of plans. If you want to help and be part of the Scramjet team, please reach out to us, [on discord](https://discord.gg/4EX3jHBe) or email us: [opensource@scramjet.org](mailto:opensource@scramjet.org).

### Donation 💸 <!-- omit in toc -->

Do you like this project? It helped you to reduce time spent on delivering your solution? You are welcome to buy us a coffee ☕ Thanks a lot! 😉

[You can sponsor us on github](https://github.com/sponsors/scramjetorg)

-   There's also a Paypal donation link if you prefer that:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7F7V65C43EBMW)
