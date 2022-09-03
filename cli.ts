import { readAll } from "https://deno.land/std@0.154.0/streams/conversion.ts";
import { calcRecursiveKeyPaths } from "./JsonKeyPath.ts";

const stdinContent = await readAll(Deno.stdin)
const stdinText = new TextDecoder().decode(stdinContent)
const json = JSON.parse(stdinText);

console.log(
  calcRecursiveKeyPaths(json).map((path) => path.toString()).join("\n"),
);
