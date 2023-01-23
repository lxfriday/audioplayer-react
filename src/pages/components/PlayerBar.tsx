import { useEffect, useRef, useCallback, DragEvent, MouseEvent } from "react";
import {
  PlayCircleOutlined,
  PauseCircleFilled,
  StepForwardOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import classnames from "classnames";
import { useImmer } from "use-immer";
import type { CurrentPlayingInfo, AudioInfo } from "../../models/AudioPlayer";
import { PlayMode } from "../../models/AudioPlayer";
import { IconFont } from "../../utils/config";
import { transformMIllionSecondsToTimeString } from "../../utils";
import styles from "./PlayerBar.module.less";

type PlayerBarParams = {
  handlePlay(): void;
  handlePause(): void;
  handleSwitchTo(idx: number): void;
  handleChangePlayMode(): void;
  handleOpenAudioList(): void;
  audioList: AudioInfo[];
  currentPlayingInfo: CurrentPlayingInfo | null;
  currentPlayingIdx: number;
  isInitial: boolean;
  isPlaying: boolean;
  playMode: PlayMode;
};

const playModesIconNames = {
  [PlayMode.listLoop]: "icon-refresh-copy",
  [PlayMode.repeat]: "icon-danquxunhuan-copy",
  [PlayMode.random]: "icon-random-copy",
};

// 计算播放进度,百分比
function calcPercent(a: number, b: number) {
  const p = `${((a * 100000) / b).toFixed(2)}%`;
  return p;
}

export default function PlayerBar({
  handlePause,
  handlePlay,
  handleSwitchTo,
  handleChangePlayMode,
  handleOpenAudioList,
  audioList,
  currentPlayingInfo,
  currentPlayingIdx,
  isInitial,
  isPlaying,
  playMode,
}: PlayerBarParams) {
  const [currentTime, setCurrentTime] = useImmer(0);
  // 0~1
  const [currentVolumn, setCurrentVolumn] = useImmer(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumnBarRef = useRef<HTMLDivElement>(null);
  function handleSetVolumn(e: MouseEvent) {
    const player = audioRef.current;
    const volumnBar = volumnBarRef.current;
    if (volumnBar && player) {
      const barWidth = volumnBar.clientWidth;
      const distance = Math.abs(
        e.clientX - volumnBar.getBoundingClientRect().left
      );
      player.volume = parseFloat((distance / barWidth).toFixed(2));
      setCurrentVolumn(player.volume);
    }
  }

  function handlePressPause() {
    const player = audioRef.current;
    if (player) {
      player.pause();
    }
    handlePause();
  }

  // seek
  function handlePlessProgressBar(e: MouseEvent) {
    const bar = progressBarRef.current;
    const player = audioRef.current;
    if (bar && player) {
      const barWidth = bar.clientWidth;
      const distance = Math.abs(e.clientX - bar.offsetLeft);
      player.currentTime = Math.floor(
        (audioList[currentPlayingIdx].duration * distance) / barWidth / 1000
      );
    }
  }

  function handleDragVolumnCurrent(e: DragEvent) {
    const player = audioRef.current;
    const volumnBar = volumnBarRef.current;
    if (volumnBar && player && e.clientX !== 0) {
      const barWidth = volumnBar.clientWidth;
      let distance = e.clientX - volumnBar.getBoundingClientRect().left;
      distance = distance < 0 ? 0 : distance;
      const vo = parseFloat((distance / barWidth).toFixed(2));
      player.volume = vo > 1 ? 1 : vo;
      setCurrentVolumn(player.volume);
    }
  }
  function handleDragVolumnCurrentEnd(e: DragEvent) {
    const player = audioRef.current;
    const volumnBar = volumnBarRef.current;
    if (volumnBar && player) {
      const barWidth = volumnBar.clientWidth;
      let distance = e.clientX - volumnBar.getBoundingClientRect().left;
      distance = distance < 0 ? 0 : distance;
      const vo = parseFloat((distance / barWidth).toFixed(2));
      player.volume = vo > 1 ? 1 : vo;
      setCurrentVolumn(player.volume);
    }
  }
  useEffect(() => {
    const player = audioRef.current;
    if (player) {
      player.onended = () => {
        if (playMode === PlayMode.listLoop) {
          handleSwitchTo((currentPlayingIdx + 1) % audioList.length);
        } else if (playMode === PlayMode.repeat) {
          player.currentTime = 0;
          player.play();
        } else {
          const nextIdx = Math.floor(Math.random() * audioList.length);
          if (currentPlayingIdx === nextIdx) {
            handleSwitchTo((currentPlayingIdx + 1) % audioList.length);
          } else {
            handleSwitchTo(nextIdx);
          }
        }
      };
      // 切换播放进度-开始
      player.onseeking = function (e) {
        console.log("seeking");
      };
      // 切换播放进度-结束
      player.onseeked = function (e) {
        console.log("onseeked");
      };
      player.onplay = function (e) {
        console.log("onplay");
      };
      player.onpause = function (e) {
        console.log("onpause");
      };
      player.onplaying = function (e) {
        console.log("onplaying");
      };
      player.onloadeddata = function (e) {
        console.log("onloadeddata");
      };
      player.ontimeupdate = function (e) {
        // console.log("ontimeupdate", player.currentTime);
        setCurrentTime(player.currentTime);
      };
    }
  }, [currentPlayingIdx, audioList, isPlaying, playMode]);
  useEffect(() => {
    const player = audioRef.current;
    if (player && currentPlayingInfo && !isInitial) {
      player.src = currentPlayingInfo.audioUrl;
      player.play();
    }
  }, [currentPlayingInfo, isInitial]);
  useEffect(() => {
    const player = audioRef.current;
    if (player && isPlaying) {
      player.play();
    }
  }, [isPlaying]);

  return (
    <div className={styles.wrapper}>
      {currentPlayingInfo && (
        <audio
          style={{ display: "none" }}
          ref={audioRef}
          controls
          src={currentPlayingInfo.audioUrl}
        ></audio>
      )}
      <div className={styles.leftExtraToolsWrapper}>
        <img src={audioList[currentPlayingIdx].albume.picUrl} alt="专辑" />
        <div className={styles.artistInfo}>
          <div className={styles.audioName}>
            {audioList[currentPlayingIdx].name}
          </div>
          <div className={styles.artistsWrapper}>
            {audioList[currentPlayingIdx].artistInfo.map((_) => (
              <span key={_.id}>{_.name} </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.controlsWrapper}>
        <div className={styles.tools}>
          <IconFont
            onClick={() => handleChangePlayMode()}
            type={playModesIconNames[playMode]}
            className={classnames(styles.iconCommon, styles.praymode)}
          />
          <StepBackwardOutlined
            onClick={() =>
              handleSwitchTo(
                (currentPlayingIdx - 1 + audioList.length) % audioList.length
              )
            }
            className={styles.iconCommon}
          />
          {isPlaying ? (
            <PauseCircleFilled
              onClick={handlePressPause}
              className={styles.iconCommon}
            />
          ) : (
            <PlayCircleOutlined
              onClick={handlePlay}
              className={styles.iconCommon}
            />
          )}
          <StepForwardOutlined
            onClick={() =>
              handleSwitchTo((currentPlayingIdx + 1) % audioList.length)
            }
            className={styles.iconCommon}
          />
          <div className={classnames(styles.iconCommon, styles.lyricButton)}>
            <span>词</span>
          </div>
        </div>
        <div className={styles.progressWrapper}>
          <span className={styles.time}>
            {transformMIllionSecondsToTimeString(currentTime * 1000)}
          </span>
          <div
            ref={progressBarRef}
            onClick={handlePlessProgressBar}
            className={styles.progressBarWrapper}
          >
            <div
              className={styles.realProgress}
              style={{
                width: calcPercent(
                  currentTime,
                  audioList[currentPlayingIdx].duration
                ),
              }}
            >
              <div className={styles.currentDot}></div>
            </div>
          </div>
          <span className={styles.time}>
            {transformMIllionSecondsToTimeString(
              audioList[currentPlayingIdx].duration
            )}
          </span>
        </div>
      </div>
      <div className={styles.rightExtraToolsWrapper}>
        <Popover
          content={
            <div className={styles.volumnWrapper}>
              <div
                ref={volumnBarRef}
                onClick={handleSetVolumn}
                className={styles.volumnBar}
              >
                <div
                  className={styles.volumnPercent}
                  style={{ width: `${currentVolumn * 100}%` }}
                ></div>
                <div
                  draggable
                  onDrag={handleDragVolumnCurrent}
                  onDragEnd={handleDragVolumnCurrentEnd}
                  className={styles.volumnCurrent}
                  style={{ left: `calc(${currentVolumn * 100}% - 4px)` }}
                ></div>
              </div>
            </div>
          }
          trigger="hover"
        >
          <IconFont
            title="音量"
            onClick={() => {}}
            type="icon-shengyinyinliang-copy"
            className={classnames(styles.iconCommon, styles.volumn)}
          />
        </Popover>
        <IconFont
          title="播放列表"
          onClick={handleOpenAudioList}
          type="icon-liebiao-copy"
          className={classnames(styles.iconCommon, styles.openList)}
        />
      </div>
    </div>
  );
}