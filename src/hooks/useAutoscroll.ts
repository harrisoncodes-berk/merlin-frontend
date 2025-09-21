import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export function useAutoscroll({
  itemCount,
  isStreaming,
  threshold = 80,
}: {
  itemCount: number;
  isStreaming?: boolean;
  threshold?: number;
}) {
  // The scrollable container
  const containerRef = useRef<HTMLDivElement | null>(null);
  // The sentinel at the end of the <ul> (a <li>)
  const endRef = useRef<HTMLLIElement | null>(null);

  const [pinned, setPinned] = useState(true);

  const computePinned = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);
    return distance <= threshold;
  }, [threshold]);

  const onScroll = useCallback(
    () => setPinned(computePinned()),
    [computePinned]
  );

  useLayoutEffect(() => {
    setPinned(computePinned());
  }, [computePinned]);

  useEffect(() => {
    if (!pinned) return;
    endRef.current?.scrollIntoView({
      behavior: isStreaming ? "auto" : "smooth",
      block: "end",
    });
  }, [itemCount, isStreaming, pinned]);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return { containerRef, endRef, onScroll, pinned, scrollToBottom } as const;
}
