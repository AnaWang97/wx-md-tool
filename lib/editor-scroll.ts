interface TextareaScrollState {
  previousScrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export function getRestoredTextareaScrollTop({
  previousScrollTop,
  scrollHeight,
  clientHeight,
}: TextareaScrollState): number {
  const maxScrollTop = Math.max(0, scrollHeight - clientHeight);

  return Math.min(previousScrollTop, maxScrollTop);
}
