import { call, put, select } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { fetchAudioUrlService } from "../services/api";
import type { RootState } from ".";
import { AudioPlayerState } from "./AudioPlayer";

export function* fetchAudioUrlEffect(
  action: PayloadAction<{ idx: number; shouldPlay: boolean }>
) {
  try {
    const id: number = yield select(
      (rootState: RootState) =>
        rootState.audioPlayer.audioList[action.payload.idx].id
    );
    const res: { code: any; data: any } = yield call(fetchAudioUrlService, id);
    yield put({
      type: "audioPlayer/setCurrentPlayingInfoReducer",
      payload: {
        id,
        audioUrl: res.data[0].url,
        idx: action.payload.idx,
        shouldPlay: action.payload.shouldPlay,
      },
    });
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
        type: "audioPlayer/fetchAudioUrlEffect",
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
