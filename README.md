# jk - Command to list JSON key paths

A command to list JSON key paths that are compatible with
[`jq`](https://stedolan.github.io/jq/).

```
$ echo '{"foo": { "bar": [{"baz1": 1}, {"baz2": 2}] }}' | jk
.foo
.foo.bar
.foo.bar[0]
.foo.bar[0].baz1
.foo.bar[1]
.foo.bar[1].baz2
```

## Installation

```
$ deno install -n jk https://raw.githubusercontent.com/FujiHaruka/jk/main/cli.ts
```

## Example Usage

You can use it with [`fzf`](https://github.com/junegunn/fzf) and
[`jq`](https://stedolan.github.io/jq/) to interactively search JSON by key
paths.

```
$ cat example.json | jk | fzf --preview "jq {} example.json"
```
