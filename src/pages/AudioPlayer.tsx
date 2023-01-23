import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../models";
import AudioListDrawer from "./components/AudioListDrawer";
import PlayerBar from "./components/PlayerBar";
import {
  setCurrentPlayingIdxReducer,
  setIsPlayingReducer,
  changePlayModeReducer,
  PlayMode,
} from "../models/AudioPlayer";
import styles from "./AudioPlayer.module.less";

export default function AudioPlayer() {
  const {
    currentPlayingInfo,
    audioList,
    isPlaying,
    currentPlayingIdx,
    playMode,
  } = useSelector((rootState: RootState) => rootState.audioPlayer);
  const dispatch = useDispatch();
  const [isInitial, setIsInitial] = useImmer(true);
  const drawerRef = useRef<() => void>(() => {});

  // 切换到指定的某一条，直接点击某个歌曲
  function handleSwitchTo(idx: number) {
    dispatch({
      type: "audioPlayer/fetchAudioUrlEffect",
      payload: {
        idx: idx,
        shouldPlay: true
      },
    });
  }
  function handlePlay() {
    dispatch(setIsPlayingReducer({ isPlaying: true }));
    setIsInitial(false);
  }
  function handlePause() {
    setIsInitial(false);
    dispatch(setIsPlayingReducer({ isPlaying: false }));
  }
  function handleChangePlayMode() {
    dispatch(changePlayModeReducer());
  }
  function handleOpenAudioList() {
    drawerRef.current();
  }
  // 初始化播放器
  useEffect(() => {
    dispatch({
      type: "audioPlayer/initPlayerEffect",
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}></div>
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

// 歌词
// 设置音量
// 倍速
