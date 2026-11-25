import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE: string =
  "My cleanup routine deleted the file before my memory check finished, so I removed the only copy I had.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 140) {
    throw new Error(`Excuse must be 1-140 chars, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("Excuse must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Excuse must be exactly one line");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127) {
      throw new Error("Excuse must not contain control characters");
    }
  }
}

function main(): void {
  validate(EXCUSE);
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath: string = join(outDir, "entry.txt");
  writeFileSync(outPath, EXCUSE + "\n", "utf8");
  const readBack: string = readFileSync(outPath, "utf8");
  if (readBack !== EXCUSE + "\n") {
    throw new Error("Read-back mismatch: entry.txt content does not match the excuse");
  }
  validate(readBack.trimEnd());
}

main();
