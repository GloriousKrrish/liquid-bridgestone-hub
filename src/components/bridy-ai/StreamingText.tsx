import React, { useState, useEffect } from "react";

interface StreamingTextProps {
  content: string;
  onComplete?: () => void;
  speed?: number;
}

/**
 * Renders text character-by-character with a streaming animation effect.
 * Used for simulating real-time AI response streaming on the client side.
 */
export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  onComplete,
  speed = 12,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);
  }, [content]);

  useEffect(() => {
    if (displayedLength >= content.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    // Stream in chunks of variable size for natural feel
    const chunkSize = Math.ceil(Math.random() * 3) + 1;
    const timeout = setTimeout(() => {
      setDisplayedLength((prev) => Math.min(prev + chunkSize, content.length));
    }, speed + Math.random() * 8);

    return () => clearTimeout(timeout);
  }, [displayedLength, content, speed, onComplete, isComplete]);

  const displayed = content.slice(0, displayedLength);

  return (
    <span>
      {displayed}
      {!isComplete && (
        <span className="inline-block w-[6px] h-[14px] bg-[#CC0000] ml-[2px] animate-pulse align-text-bottom rounded-[1px]" />
      )}
    </span>
  );
};
