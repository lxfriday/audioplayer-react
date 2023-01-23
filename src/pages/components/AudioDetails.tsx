import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import styles from "./AudioDetails.module.less";

import type { CurrentPlayingInfo, AudioInfo } from "../../models/AudioPlayer";

type AudioDetailsParams = {
  audioList: AudioInfo[];
  currentPlayingInfo: CurrentPlayingInfo | null;
  currentPlayingIdx: number;
  isPlaying: boolean;
};

export default function AudioDetails({
  audioList,
  currentPlayingInfo,
  currentPlayingIdx,
  isPlaying,
}: AudioDetailsParams) {
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (isPlaying) img.style.animationPlayState = "";
      else img.style.animationPlayState = "paused";
    }
  }, [isPlaying]);
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <div className={styles.wrapper}>
      <div className={styles.AudioInfoWrapper}>
        <div className={styles.audioAreaWrapper}>
          <div className={styles.imgWrapper}>
            <img
              ref={imgRef}
              src={audioList[currentPlayingIdx].albume.picUrl}
              alt="专辑图片"
              className={classnames(isPlaying && styles.isPlaying)}
            />
          </div>
          <div className={styles.detailsWrapper}>
            <div className={styles.lyricWrapper}>歌词</div>
          </div>
        </div>
      </div>
    </div>
  );
}
