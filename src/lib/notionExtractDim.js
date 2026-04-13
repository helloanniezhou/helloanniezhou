/**
 * Parse a leading `dim:<value>` directive in image caption runs.
 * - Bare integer or decimal (e.g. 480, 12.5) → maxWidth as number (CSS px).
 * - Any other token (480px, 100%, 20rem, 50vw, …) → maxWidth as string for CSS.
 * Strips the directive from returned runs; empty remainder → [].
 */
export function extractDimFromCaptionRuns(runs) {
  if (!runs?.length) return { runs: runs || [], maxWidth: undefined };
  const textRuns = runs.filter((r) => r.type === "text");
  if (!textRuns.length) return { runs, maxWidth: undefined };
  const joined = textRuns.map((r) => r.text ?? "").join("");
  const trimmed = joined.trimStart();
  const dimMatch = trimmed.match(/^dim:\s*(\S+)\s*/i);
  if (!dimMatch) return { runs, maxWidth: undefined };

  const valueToken = dimMatch[1];
  const rest = trimmed.slice(dimMatch[0].length).replace(/^\s+/, "");

  let maxWidth;
  if (/^\d+(\.\d+)?$/.test(valueToken)) {
    maxWidth = parseFloat(valueToken);
  } else {
    maxWidth = valueToken;
  }

  const newRuns = rest
    ? [
        {
          type: "text",
          text: rest,
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
          href: null
        }
      ]
    : [];

  return { runs: newRuns, maxWidth };
}
