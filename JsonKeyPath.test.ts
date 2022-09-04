import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { calcRecursiveKeyPaths, Json, JsonKeyPath } from "./JsonKeyPath.ts";

Deno.test("JsonKeyPath#toString", () => {
  const tests: ([(string | number)[], string])[] = [
    [["key"], ".key"],
    [["key.key"], '."key.key"'],
    [["key1", "key2"], ".key1.key2"],
    [[0], ".[0]"],
    [[0, 1, 2], ".[0][1][2]"],
    [[0, "foo", 1, "bar", 2], ".[0].foo[1].bar[2]"],
  ];

  tests.forEach(([keys, dotPath]) => {
    assertEquals(JsonKeyPath.from(keys).toString(), dotPath);
  });
});

Deno.test("JsonKeyPath#concat", () => {
  assertEquals(
    JsonKeyPath.from(["key1", "key2"]).concat(
      JsonKeyPath.from(["key3", "key4"]),
    ).toString(),
    ".key1.key2.key3.key4",
  );
});

Deno.test("calcRecursiveKeyPaths", () => {
  const tests: [Json, string[]][] = [
    [{
      foo: {
        bar: {
          baz: 1,
        },
      },
    }, [".foo", ".foo.bar", ".foo.bar.baz"]],
    ["foo", []],
    [1, []],
    [null, []],
    [{
      foo1: {
        bar1: null,
        bar2: {
          baz: null,
        },
      },
      foo2: {
        bar3: null,
      },
    }, [
      ".foo1",
      ".foo1.bar1",
      ".foo1.bar2",
      ".foo1.bar2.baz",
      ".foo2",
      ".foo2.bar3",
    ]],
    [
      [0, 1, 2],
      [".[0]", ".[1]", ".[2]"],
    ],
    [
      ["foo", { foo: { bar: null } }, [0, 1]],
      [
        ".[0]",
        ".[1]",
        ".[1].foo",
        ".[1].foo.bar",
        ".[2]",
        ".[2][0]",
        ".[2][1]",
      ],
    ],
  ];

  tests.forEach(([json, paths]) => {
    assertEquals(
      calcRecursiveKeyPaths(json).map((path) => path.toString()),
      paths,
    );
  });
});
