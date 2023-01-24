import { useEffect, useRef, useCallback } from "react";
import { useImmer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../models";
import AudioListDrawer from "./components/AudioListDrawer";
import PlayerBar from "./components/PlayerBar";
import AudioDetails from "./components/AudioDetails";
import {
  setIsPlayingReducer,
  changePlayModeReducer,
} from "../models/AudioPlayer";
import styles from "./AudioPlayer.module.less";

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
  return (
    <div className={styles.wrapper}>
      <AudioDetails
        currentPlayingIdx={currentPlayingIdx}
        audioList={audioList}
        isPlaying={isPlaying}
        currentPlayingInfo={currentPlayingInfo}
        currentPlayingTime={currentPlayingTime}
      />
      <AudioListDrawer
        drawerRef={drawerRef}
        handleSwitchTo={handleSwitchTo}
        audioList={audioList}
        currentPlayingIdx={currentPlayingIdx}
      />
      <PlayerBar
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

export default AudioPlayer
