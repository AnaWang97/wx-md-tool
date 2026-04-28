export interface TextAffixEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

interface ToggleTextAffixOptions {
  value: string;
  start: number;
  end: number;
  prefix: string;
  suffix: string;
  defaultText: string;
  leadingPrefix?: string;
}

function hasCleanSingleMarkerBoundary(
  value: string,
  markerStart: number,
  marker: string
): boolean {
  if (marker.length !== 1) return true;

  return (
    value[markerStart - 1] !== marker &&
    value[markerStart + marker.length] !== marker
  );
}

function canUseMarkerAt(
  value: string,
  markerStart: number,
  marker: string
): boolean {
  if (marker.length === 0) return true;

  return (
    value.slice(markerStart, markerStart + marker.length) === marker &&
    hasCleanSingleMarkerBoundary(value, markerStart, marker)
  );
}

export function toggleTextAffix({
  value,
  start,
  end,
  prefix,
  suffix,
  defaultText,
  leadingPrefix = "",
}: ToggleTextAffixOptions): TextAffixEdit {
  const hasSelection = end > start;
  const selectedText = hasSelection ? value.slice(start, end) : defaultText;

  if (hasSelection && prefix.length > 0) {
    const prefixStart = start - prefix.length;
    const suffixStart = end;
    const hasPrefixBeforeSelection = canUseMarkerAt(value, prefixStart, prefix);
    const hasSuffixAfterSelection =
      suffix.length === 0 || canUseMarkerAt(value, suffixStart, suffix);

    if (hasPrefixBeforeSelection && hasSuffixAfterSelection) {
      const selectionStart = prefixStart;
      const selectionEnd = selectionStart + selectedText.length;

      return {
        value:
          value.slice(0, prefixStart) +
          selectedText +
          value.slice(end + suffix.length),
        selectionStart,
        selectionEnd,
      };
    }
  }

  if (
    hasSelection &&
    prefix.length > 0 &&
    selectedText.startsWith(prefix) &&
    (suffix.length === 0 || selectedText.endsWith(suffix)) &&
    canUseMarkerAt(selectedText, 0, prefix) &&
    (suffix.length === 0 ||
      canUseMarkerAt(selectedText, selectedText.length - suffix.length, suffix))
  ) {
    const innerText = selectedText.slice(
      prefix.length,
      suffix.length === 0 ? selectedText.length : -suffix.length
    );

    return {
      value: value.slice(0, start) + innerText + value.slice(end),
      selectionStart: start,
      selectionEnd: start + innerText.length,
    };
  }

  const wrappedText = `${leadingPrefix}${prefix}${selectedText}${suffix}`;
  const selectionStart = start + leadingPrefix.length + prefix.length;
  const selectionEnd = selectionStart + selectedText.length;

  return {
    value: value.slice(0, start) + wrappedText + value.slice(end),
    selectionStart,
    selectionEnd,
  };
}
