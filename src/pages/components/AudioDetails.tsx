import React, { useState, useEffect, useRef, useCallback } from "react";
import classnames from "classnames";
import styles from "./AudioDetails.module.less";

import type { CurrentPlayingInfo, AudioInfo } from "@models/AudioPlayer";

type AudioDetailsParams = {
  audioList: AudioInfo[];
  currentPlayingInfo: CurrentPlayingInfo | null;
  currentPlayingIdx: number;
  currentPlayingTime: number;
  isPlaying: boolean;
  isCurrentPlayingNone: boolean;
};

function isCurrentLine(currentTime: number, t: number, nextT?: number) {
  if (!nextT) return true;
  return currentTime >= t && currentTime <= nextT;
}

const listWrapperHeight = 650;

export default function AudioDetails({
  audioList,
  currentPlayingInfo,
  currentPlayingIdx,
  currentPlayingTime,
  isPlaying,
  isCurrentPlayingNone,
}: AudioDetailsParams) {
  const [lyricAutoScroll, setLyricAutoScroll] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const lyricWrapperRef = useRef<HTMLDivElement>(null);

  const scrollToIdx = useCallback(
    (idx: number) => {
      const listEle = lyricWrapperRef.current;
      const lyricsLen = currentPlayingInfo?.lyrics.length || 0;
      if (listEle) {
        const listHeight = listEle.scrollHeight;
        const toHeight =
          listHeight * (idx / lyricsLen) - listWrapperHeight / 2 + 50;
        listEle.scrollTo({
          top: toHeight,
          behavior: "smooth",
        });
      }
    },
    [currentPlayingIdx]
  );

  const handleMouseEnterLyric = useCallback(() => {
    setLyricAutoScroll(false);
  }, []);
  const handleMouseLeaveLyric = useCallback(() => {
    setLyricAutoScroll(true);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (isPlaying) img.style.animationPlayState = "";
      else img.style.animationPlayState = "paused";
    }
  }, [isPlaying, currentPlayingInfo]);

  function getLyricWrapper() {
    if (currentPlayingInfo) {
      const lyrics = currentPlayingInfo.lyrics;
      return (
        <div
          ref={lyricWrapperRef}
          className={styles.lyricWrapper}
          style={{ height: listWrapperHeight }}
          onMouseEnter={handleMouseEnterLyric}
          onMouseLeave={handleMouseLeaveLyric}
        >
          {lyrics.map((lyricLine, idx) => {
            const isCurrent = isCurrentLine(
              currentPlayingTime,
              lyricLine[0],
              idx < lyrics.length - 1 ? lyrics[idx + 1][0] : 100000000
            );
            if (isCurrent && lyricAutoScroll) scrollToIdx(idx);
            return (
              <div
                key={lyricLine[0] + lyricLine[1]}
                className={classnames(
                  styles.lyricLine,
                  isCurrent && styles.isCurrent
                )}
              >
                {lyricLine[1]}
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div className={styles.lyricWrapper}></div>;
    }
  }

  function genAudioArea() {
    if (!isCurrentPlayingNone) {
      return (
        <div className={styles.audioAreaWrapper}>
          <div className={styles.imgWrapper}>
            <img
              ref={imgRef}
              src={audioList[currentPlayingIdx].albume.picUrl}
              alt="专辑图片"
            />
          </div>
          <div className={styles.detailsWrapper}>{getLyricWrapper()}</div>
        </div>
      );
    } else {
      return (
        <div className={styles.audioAreaWrapper}>
          <div className={styles.noAudio}>选择一首歌曲播放把~</div>
        </div>
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.AudioInfoWrapper}>{genAudioArea()}</div>
    </div>
  );
}
