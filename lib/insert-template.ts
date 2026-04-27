export interface InsertBlockTemplateResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

function getPrefix(before: string): string {
  if (before.length === 0) return "";
  if (before.endsWith("\n\n")) return "";
  if (before.endsWith("\n")) return "\n";
  return "\n\n";
}

function getSuffix(after: string): string {
  if (after.length === 0) return "";
  if (after.startsWith("\n\n")) return "";
  if (after.startsWith("\n")) return "\n";
  return "\n\n";
}

export function insertBlockTemplate(
  value: string,
  start: number,
  end: number,
  template: string
): InsertBlockTemplateResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const trimmedTemplate = template.trim();
  const prefix = getPrefix(before);
  const suffix = getSuffix(after);
  const selectionStart = before.length + prefix.length;
  const selectionEnd = selectionStart + trimmedTemplate.length;

  return {
    value: `${before}${prefix}${trimmedTemplate}${suffix}${after}`,
    selectionStart,
    selectionEnd,
  };
}
