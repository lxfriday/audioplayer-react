import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import styles from "./index.module.less";

type MarqueeParams = {
  text: string; // 跑马灯文字
  width: number; // 宽度
};

export default function Marquee({ text, width }: MarqueeParams) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldLoop, setShouldLoop] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const animationDuration = 20;

  function startAnimation() {
    if (isLooping || !shouldLoop) return;
    setIsLooping(true);
    setTimeout(() => {
      setIsLooping(false);
      console.log("aniamtion end");
    }, animationDuration * 1000);
  }

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.getBoundingClientRect().width;
      console.log("textWidth", textWidth);
      if (textWidth / 2 > width) {
        setShouldLoop(true);
      } else {
        setShouldLoop(false);
      }
    }
  }, [text, width]);
  return (
    <div className={styles.wrapper} style={{ width }}>
      <span
        ref={textRef}
        className={classnames(
          styles.text,
          shouldLoop && isLooping && styles.shouldPlay
        )}
        style={{ animationDuration: `${animationDuration}s` }}
        onMouseEnter={startAnimation}
      >
        {text}
        {text}
      </span>
    </div>
  );
}
