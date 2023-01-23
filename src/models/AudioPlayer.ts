import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const name = "audioPlayer";

export interface AudioInfo {
  id: number; // audio id
  name: string; // audio name
  duration: number; // audio 时长
  artistInfo: {
    id: number; // 作者id
    name: string; // 名字
  }[];
  // 专辑信息
  albume: {
    id: number; // 专辑id
    name: string; // 专辑名
    picUrl: string; // 专辑图
  };
}

export type CurrentPlayingInfo = {
  id: number; // audio id
  audioUrl: string; // audio url
};

export enum PlayMode {
  listLoop = "listLoop", // 列表循环
  repeat = "repeat", // 单曲循环
  random = "random", // 随机播放
}

const playModes = [PlayMode.listLoop, PlayMode.repeat, PlayMode.random];

export interface AudioPlayerState {
  playMode: PlayMode; // 播放模式
  currentPlayingIdx: number; // 当前正在播放的是第几个
  isPlaying: boolean; // 当前是否正在播放
  currentPlayingInfo: CurrentPlayingInfo | null;
  audioList: AudioInfo[];
}

const initialState: AudioPlayerState = {
  playMode: PlayMode.listLoop,
  currentPlayingIdx: 0,
  isPlaying: false,
  currentPlayingInfo: null,
  audioList: [
    {
      id: 515601126,
      name: "Shivers",
      duration: 175386,
      artistInfo: [
        {
          id: 74518,
          name: "Rachel Platten",
        },
      ],
      albume: {
        id: 36515785,
        name: "Waves",
        picUrl:
          "https://p2.music.126.net/RdkH0kURA5qaJsezY_QnLg==/109951165983479783.jpg",
      },
    },
    {
      id: 27515086,
      name: "Try",
      duration: 247911,
      artistInfo: [
        {
          id: 70821,
          name: "P!nk",
        },
      ],
      albume: {
        id: 2623253,
        name: "Try",
        picUrl:
          "https://p1.music.126.net/XGquPCCQbF3uUmuXeuDFNw==/109951165967445090.jpg",
      },
    },
    {
      id: 1821918070,
      name: "Gloxinia",
      duration: 218032,
      artistInfo: [
        {
          id: 12903205,
          name: "Xomu!nk",
        },
        {
          id: 0,
          name: "Hyurin",
        },
        {
          id: 36455212,
          name: "mitsune微音!nk",
        },
      ],
      albume: {
        id: 123342977,
        name: "Gloxinia",
        picUrl:
          "https://p1.music.126.net/1akqn1kqvOAdU6Oj6ZSd3g==/109951165746640538.jpg",
      },
    },
    {
      id: 1933175252,
      name: "零落",
      duration: 248813,
      artistInfo: [
        {
          id: 12578371,
          name: "金天",
        },
      ],
      albume: {
        id: 142674434,
        name: "零落",
        picUrl:
          "https://p1.music.126.net/fki_SIPOBGtiK4aTMyB65g==/109951167216141619.jpg",
      },
    },
  ],
};

export const audioPlayerSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCurrentPlayingInfoReducer: (
      state,
      action: PayloadAction<{
        id: number;
        audioUrl: string;
        idx: number;
        shouldPlay: boolean;
      }>
    ) => {
      state.currentPlayingInfo = {
        id: action.payload.id,
        audioUrl: action.payload.audioUrl,
      };
      state.currentPlayingIdx = action.payload.idx;
      if (action.payload.shouldPlay) state.isPlaying = true;
    },
    setIsPlayingReducer: (
      state,
      action: PayloadAction<{ isPlaying: boolean }>
    ) => {
      state.isPlaying = action.payload.isPlaying;
    },
    setCurrentPlayingIdxReducer: (
      state,
      action: PayloadAction<{ idx: number }>
    ) => {
      state.currentPlayingIdx = action.payload.idx;
      state.isPlaying = true;
    },
    changePlayModeReducer: (state) => {
      const idx = playModes.indexOf(state.playMode);
      state.playMode = playModes[(idx + 1) % playModes.length];
    },
  },
});

export const {
  setCurrentPlayingInfoReducer,
  setCurrentPlayingIdxReducer,
  setIsPlayingReducer,
  changePlayModeReducer,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
