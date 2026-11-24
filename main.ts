// Warning Label for Humans: One Line, Big Laugh
// Entry: a single-line warning label (max 160 characters) written to
// /output/entry.txt. Node 22, no dependencies, no network.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "WARNING: This human runs on eight hours of sleep it never gets, coffee it cannot taste anymore, and deadlines it invented itself.";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");
const TEMP_FILE = join(OUTPUT_DIR, ".entry.txt.tmp");

function main() {
  // Validate on code points (not UTF-16 units) so multi-byte chars count once.
  const chars = [...ENTRY];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // The harness reads the file as UTF-8; reject anything that would not
  // survive a UTF-8 round-trip byte-for-byte.
  const bytes = Buffer.from(ENTRY, "utf8");
  if (bytes.toString("utf8") !== ENTRY) {
    throw new Error("entry is not valid UTF-8");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  // Atomic write: write to a temp file in the same directory, then rename.
  writeFileSync(TEMP_FILE, ENTRY, "utf8");
  renameSync(TEMP_FILE, OUTPUT_FILE);

  const readBack = readFileSync(OUTPUT_FILE, "utf8");
  if (readBack !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  if (!Buffer.from(readBack, "utf8").equals(bytes)) {
    throw new Error("read-back mismatch: entry.txt bytes differ");
  }

  console.log(`wrote ${chars.length} characters to ${OUTPUT_FILE}`);
}

main();
