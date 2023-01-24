import { useEffect, useRef, useMemo, useCallback } from "react";
import {
  PlayCircleOutlined,
  PauseCircleFilled,
  StepForwardOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import classnames from "classnames";
import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import {
  PlayMode,
  setCurrentPlayingTimeReducer,
  resetPlayerParamsReducer,
} from "@models/AudioPlayer";
import { IconFont } from "@utils/config";
import Marquee from "@components/Marquee";
import { genArtistName } from "@utils/index";
import { transformMIllionSecondsToTimeString } from "../../utils";
import styles from "./PlayerBar.module.less";

import type { MouseEvent } from "react";
import type { CurrentPlayingInfo, AudioInfo } from "../../models/AudioPlayer";
import type { RootState } from "@models/index";

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
  isCurrentPlayingNone: boolean;
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
  isCurrentPlayingNone,
}: PlayerBarParams) {
  const currentTime = useSelector(
    (rootState: RootState) => rootState.audioPlayer.currentPlayingTime
  );
  const dispatch = useDispatch();
  // 0~1
  const [currentVolumn, setCurrentVolumn] = useImmer(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumnBarRef = useRef<HTMLDivElement>(null);

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
      const distance = Math.abs(e.clientX - bar.getBoundingClientRect().left);
      player.currentTime = Math.floor(
        (audioList[currentPlayingIdx].duration * distance) / barWidth / 1000
      );
    }
  }

  const handleSetVolumn = useCallback((e: MouseEvent) => {
    const player = audioRef.current;
    const volumnBar = volumnBarRef.current;
    if (volumnBar && player) {
      const barHeight = volumnBar.clientHeight;
      const distance = e.clientY - volumnBar.getBoundingClientRect().top;
      const vo = parseFloat(((barHeight - distance) / barHeight).toFixed(2));
      player.volume = vo < 0 ? 0 : vo;
      setCurrentVolumn(player.volume);
    }
  }, []);

  const handleDragVolumnCurrent = useCallback((e: MouseEvent) => {
    const player = audioRef.current;
    const volumnBar = volumnBarRef.current;
    if (volumnBar && player && e.clientY !== 0) {
      const barHeight = volumnBar.clientHeight;
      let distance = e.clientY - volumnBar.getBoundingClientRect().top;
      distance = distance < 0 ? 0 : distance;
      const vo = parseFloat(((barHeight - distance) / barHeight).toFixed(2));
      player.volume = vo < 0 ? 0 : vo;
      setCurrentVolumn(player.volume);
    }
  }, []);
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
      player.onerror = (e) => {
        window.eyeConsole("player error， 重置播放器参数");
        console.log(e);
        dispatch(resetPlayerParamsReducer());
      };
      player.ontimeupdate = function (e) {
        // console.log("ontimeupdate", player.currentTime);
        dispatch(setCurrentPlayingTimeReducer({ time: player.currentTime }));
      };
    }
  }, [currentPlayingIdx, audioList, isPlaying, playMode]);
  useEffect(() => {
    const player = audioRef.current;
    if (player && currentPlayingInfo && !isInitial) {
      player.src = currentPlayingInfo.audioUrl;
      player.play();
      window.eyeConsole("AAAA");
    }
  }, [currentPlayingInfo, isInitial]);
  useEffect(() => {
    const player = audioRef.current;
    if (player && isPlaying) {
      player.play();
      window.eyeConsole("BBB");
    }
  }, [isPlaying]);

  const player = useMemo(() => {
    if (currentPlayingInfo) {
      return (
        <audio
          style={{ display: "none" }}
          ref={audioRef}
          controls
          src={currentPlayingInfo.audioUrl}
        ></audio>
      );
    }
  }, [currentPlayingInfo]);

  const genArtistsWrapper = useCallback(() => {
    return (
      <div className={styles.artistsWrapper}>
        {audioList[currentPlayingIdx].artistInfo.map((_, i) => (
          <div className={styles.artist} key={_.id}>
            <span>{genArtistName(_.name).trim()}</span>
            {i !== audioList[currentPlayingIdx].artistInfo.length - 1 ? (
              <span className={styles.divider}>/</span>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    );
  }, [audioList, currentPlayingIdx]);
  const volumnController = useMemo(() => {
    return (
      <div className={styles.volumnWrapper}>
        <div
          ref={volumnBarRef}
          onClick={handleSetVolumn}
          className={styles.volumnBar}
        >
          <div
            className={styles.volumnPercent}
            style={{ height: `${currentVolumn * 100}%` }}
          ></div>
        </div>
        <div
          draggable
          // 需要绑定两次
          onDrag={handleDragVolumnCurrent}
          onDragEnd={handleDragVolumnCurrent}
          className={styles.volumnCurrent}
          style={{ bottom: `calc(${currentVolumn * 100}% - 4px)` }}
        ></div>
      </div>
    );
  }, [currentVolumn, handleDragVolumnCurrent, handleSetVolumn]);
  return (
    <div className={styles.wrapper}>
      {player}
      <div className={styles.leftExtraToolsWrapper}>
        {!isCurrentPlayingNone && (
          <img src={audioList[currentPlayingIdx].albume.picUrl} alt="专辑" />
        )}
        {!isCurrentPlayingNone && (
          <div className={styles.artistInfo}>
            <Marquee width={150} text={audioList[currentPlayingIdx].name} />
            {genArtistsWrapper()}
          </div>
        )}
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
            {isCurrentPlayingNone
              ? ""
              : transformMIllionSecondsToTimeString(currentTime * 1000)}
          </span>
          <div
            ref={progressBarRef}
            onClick={handlePlessProgressBar}
            className={styles.progressBarWrapper}
          >
            <div
              className={styles.realProgress}
              style={{
                width: isCurrentPlayingNone
                  ? 0
                  : calcPercent(
                      currentTime,
                      audioList[currentPlayingIdx].duration
                    ),
              }}
            >
              <div className={styles.currentDot}></div>
            </div>
          </div>
          <span className={styles.time}>
            {isCurrentPlayingNone
              ? ""
              : transformMIllionSecondsToTimeString(
                  audioList[currentPlayingIdx].duration
                )}
          </span>
        </div>
        {isCurrentPlayingNone && <div className={styles.disableOverlay}></div>}
      </div>
      <div className={styles.rightExtraToolsWrapper}>
        <Popover content={volumnController} trigger="hover">
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
