export type Json =
  | string
  | number
  | null
  | Json[]
  | { [key: string]: Json };

function isPremitive(json: Json): json is string | number | null {
  return json === null ||
    typeof json === "string" ||
    typeof json === "number";
}

const words = /^\w+$/;
function shouldEscape(str: string): boolean {
  return !words.test(str);
}

export function calcRecursiveKeyPaths(json: Json): JsonKeyPath[] {
  if (isPremitive(json)) {
    return [];
  }

  if (Array.isArray(json)) {
    const indexes = Array.from({ length: json.length })
      .map((_, i) => i);
    return indexes.flatMap((index) => {
      const subJson = json[index];
      const subPaths = calcRecursiveKeyPaths(subJson);
      const basePath = JsonKeyPath.from([index]);
      return [basePath].concat(
        subPaths.map((subPath) => basePath.concat(subPath)),
      );
    });
  }

  // json is object
  const paths = Object.keys(json)
    .flatMap((key: string): JsonKeyPath[] => {
      const subJson = json[key];
      const subPaths = calcRecursiveKeyPaths(subJson);
      const basePath = JsonKeyPath.from([key]);
      return [basePath].concat(
        subPaths.map((subPath) => basePath.concat(subPath)),
      );
    });
  return paths;
}

export class JsonKeyPath {
  private constructor(
    protected keys: (string | number)[],
  ) {}

  static from(keys: (string | number)[]): JsonKeyPath {
    return new JsonKeyPath(keys);
  }

  concat(another: JsonKeyPath): JsonKeyPath {
    return new JsonKeyPath(this.keys.concat(another.keys));
  }

  // convert into a dot path
  toString(): string {
    return "." +
      this.keys.map((key) => {
        switch (typeof key) {
          case "string":
            return shouldEscape(key) ? `"${key}"` : key;
          case "number":
            return `[${key}]`;
          default:
            throw new Error(`Invalid key type: ${typeof key}`);
        }
      }).join(".");
  }
}
