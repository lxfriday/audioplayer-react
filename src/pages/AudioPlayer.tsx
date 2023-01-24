import { useEffect, useRef, useCallback } from "react";
import { useImmer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";
import AudioListDrawer from "./components/AudioListDrawer";
import PlayerBar from "./components/PlayerBar";
import AudioDetails from "./components/AudioDetails";
import {
  setIsPlayingReducer,
  changePlayModeReducer,
} from "@models/AudioPlayer";
import { saveToStorage } from "@utils/storage";

import styles from "./AudioPlayer.module.less";
import type { RootState } from "@models/index";

let isFirstRender = true;

function AudioPlayer() {
  const {
    currentPlayingInfo,
    currentPlayingTime,
    audioList,
    isPlaying,
    currentPlayingIdx,
    playMode,
  } = useSelector((rootState: RootState) => rootState.audioPlayer);
  const dispatch = useDispatch();
  const [isInitial, setIsInitial] = useImmer(true);
  const drawerRef = useRef<() => void>(() => {});
  // 当前播放列表为空
  const isCurrentPlayingNone = !audioList[currentPlayingIdx];

  // 切换到指定的某一条，直接点击某个歌曲
  const handleSwitchTo = useCallback((idx: number) => {
    dispatch({
      type: "audioPlayer/switchAudioToEffect",
      payload: {
        idx: idx,
        shouldPlay: true,
      },
    });
  }, []);
  const handlePlay = useCallback(() => {
    dispatch(setIsPlayingReducer({ isPlaying: true }));
    setIsInitial(false);
  }, []);
  const handlePause = useCallback(() => {
    setIsInitial(false);
    dispatch(setIsPlayingReducer({ isPlaying: false }));
  }, []);
  const handleChangePlayMode = useCallback(() => {
    dispatch(changePlayModeReducer());
  }, []);
  const handleOpenAudioList = useCallback(() => {
    drawerRef.current();
  }, []);
  // 初始化播放器
  useEffect(() => {
    dispatch({
      type: "audioPlayer/initPlayerEffect",
    });
  }, []);
  // 把播放信息保存到 localStorage
  useEffect(() => {
    if (!isFirstRender) {
      saveToStorage("state.audioPlayer", {
        playMode,
        currentPlayingIdx,
        currentPlayingInfo,
        audioList,
      });
    }
    isFirstRender = false;
  }, [playMode, currentPlayingIdx, currentPlayingInfo, audioList]);
  useEffect(() => {
    dispatch({
      type: "audioPlayer/initFromStorageEffect",
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <AudioDetails
        isCurrentPlayingNone={isCurrentPlayingNone}
        currentPlayingIdx={currentPlayingIdx}
        audioList={audioList}
        isPlaying={isPlaying}
        currentPlayingInfo={currentPlayingInfo}
        currentPlayingTime={currentPlayingTime}
      />
      <AudioListDrawer
        isCurrentPlayingNone={isCurrentPlayingNone}
        drawerRef={drawerRef}
        handleSwitchTo={handleSwitchTo}
        audioList={audioList}
        currentPlayingIdx={currentPlayingIdx}
      />
      <PlayerBar
        isCurrentPlayingNone={isCurrentPlayingNone}
        handleSwitchTo={handleSwitchTo}
        handleChangePlayMode={handleChangePlayMode}
        handlePause={handlePause}
        handlePlay={handlePlay}
        handleOpenAudioList={handleOpenAudioList}
        currentPlayingIdx={currentPlayingIdx}
        audioList={audioList}
        isPlaying={isPlaying}
        isInitial={isInitial}
        playMode={playMode}
        currentPlayingInfo={currentPlayingInfo}
      />
    </div>
  );
}

export default AudioPlayer;
