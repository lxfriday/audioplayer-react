import { call, put, select } from "redux-saga/effects";
import { message } from "antd";
import { fetchAudioUrlService, fetchAudioLyricService } from "../services/api";
import { AudioPlayerState } from "./AudioPlayer";
import { transformLyricTimeStr } from "@utils/index";
import type { LyricsLineType, AudioInfo } from "./AudioPlayer";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from ".";

// 准备播放
export function* switchAudioToEffect(
  action: PayloadAction<{ idx: number; shouldPlay: boolean }>
) {
  try {
    const id: number = yield select(
      (rootState: RootState) =>
        rootState.audioPlayer.audioList[action.payload.idx].id
    );
    // 获取音频文件地址
    const urlRes: { code: number; data: any } = yield call(
      fetchAudioUrlService,
      id
    );
    if (urlRes.code !== 200) throw new Error("接口返回 " + urlRes.code);

    try {
      const lyricsRes: { lrc: any; code: number } = yield call(
        fetchAudioLyricService,
        id
      );
      if (lyricsRes.code !== 200)
        throw new Error(" 接口返回 " + lyricsRes.code);

      yield put({
        type: "audioPlayer/setCurrentPlayingInfoReducer",
        payload: {
          id,
          audioUrl: urlRes.data[0].url,
          idx: action.payload.idx,
          shouldPlay: action.payload.shouldPlay,
          lyrics: lyricsRes.lrc.lyric
            .split("\n")
            .map((str: string) => {
              const gapIdx = str.indexOf("]");
              const t = str.slice(1, gapIdx);
              const words = str.slice(gapIdx + 1);
              return [transformLyricTimeStr(t), words.trim()];
            })
            .filter((lyricLine: LyricsLineType) => !!lyricLine[1]),
        },
      });
    } catch (e) {
      message.error("获取歌词信息失败" + (e as Error).message);
      yield put({
        type: "audioPlayer/setCurrentPlayingInfoReducer",
        payload: {
          id,
          audioUrl: urlRes.data[0].url,
          idx: action.payload.idx,
          shouldPlay: action.payload.shouldPlay,
          lyrics: [],
        },
      });
    }
  } catch (e) {
    // yield put({ type: "USER_FETCH_FAILED", message: (e as Error).message });
    message.error("获取音频信息失败" + (e as Error).message);
  }
}

export function* initPlayerEffect() {
  try {
    const audioPlayer: AudioPlayerState = yield select(
      (rootState: RootState) => rootState.audioPlayer
    );
    const { audioList, currentPlayingIdx } = audioPlayer;
    if (audioList.length) {
      yield put({
        type: "audioPlayer/switchAudioToEffect",
        payload: {
          idx: currentPlayingIdx,
          shouldPlay: false,
        },
      });
    }
  } catch (e) {
    // yield put({ type: "USER_FETCH_FAILED", message: (e as Error).message });
    message.error("播放器初始化失败" + (e as Error).message);
  }
}

/**
 * 从歌单删除指定的歌曲
 */
export function* deleteFromAudioListEffect(
  action: PayloadAction<{ idx: number }>
) {
  // 删除的是currentIdx
  // 删除的是currentIdx之前的
  // 删除的是currentIdx之后的
  // 删除之后列表为空
  // 删除之后列表不为空
  const audioPlayer: AudioPlayerState = yield select(
    (rootState: RootState) => rootState.audioPlayer
  );
  let newAudioList: AudioInfo[] = [];
  const audioList = audioPlayer.audioList;
  const { idx } = action.payload;
  let currentPlayingIdx = audioPlayer.currentPlayingIdx;
  // 删除之后列表为空
  // 删除之后列表不为空
  if (audioList.length === 1) {
    yield put({
      type: "audioPlayer/cleanAudioListReducer",
    });
  } else {
    // 删除的是currentIdx
    let isDeletingCurrent = false;
    newAudioList = [...audioList.slice(0, idx), ...audioList.slice(idx + 1)];
    if (currentPlayingIdx === idx) {
      isDeletingCurrent = true;
      if (idx === audioList.length - 1) currentPlayingIdx = 0;
    } else if (idx < currentPlayingIdx) {
      currentPlayingIdx--;
    } else {
      // currentPlayingIdx 不变
    }
    yield put({
      type: "audioPlayer/deleteOneAudioInAudioListReducer",
      payload: {
        audioList: newAudioList,
        currentPlayingIdx,
        isDeletingCurrent,
      },
    });
    yield put({
      type: "audioPlayer/switchAudioToEffect",
      payload: {
        idx: currentPlayingIdx,
        shouldPlay: true
      },
    });
  }
  // state.audioList = newAudioList;
  // state.currentPlayingIdx = currentPlayingIdx;
}
