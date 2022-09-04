import { writeAll } from "https://deno.land/std@0.154.0/streams/conversion.ts";
import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";

const examples: { name: string; json: string; output: string }[] = [
  "example1",
  "example2",
  "example3",
  "example4",
  "example5",
  "example6",
  "example7",
].map((name) => {
  const json = Deno.readTextFileSync(`fixtures/${name}.json`);
  const output = Deno.readTextFileSync(`fixtures/${name}.out.txt`);
  return {
    name,
    json,
    output,
  };
});

examples.forEach((example) => {
  Deno.test(`Command result with ${example.name}.json should be queal to ${example.name}.out.txt`, async () => {
    const proc = Deno.run({
      cmd: ["deno", "run", "cli.ts"],
      stdin: "piped",
      stdout: "piped",
    });

    await writeAll(proc.stdin, new TextEncoder().encode(example.json));
    proc.stdin.close();

    const { code } = await proc.status();
    const out = await proc.output();
    proc.close();

    const outText = new TextDecoder().decode(out);
    assertEquals(code, 0);
    assertEquals(outText, example.output);
  });
});
