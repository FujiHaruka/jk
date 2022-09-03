import { calcRecursiveKeyPaths } from "./JsonKeyPath.ts";

const [file] = Deno.args;

const jsonText = await Deno.readTextFile(file);
const json = JSON.parse(jsonText);

console.log(
  calcRecursiveKeyPaths(json).map((path) => path.toString()).join("\n"),
);
