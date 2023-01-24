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

export type LyricsLineType = [number, string]

export type CurrentPlayingInfo = {
  id: number; // audio id
  audioUrl: string; // audio url
  lyrics: LyricsLineType[]; // 歌词
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
  currentPlayingTime: number; // 当前播放进度
}

const initialState: AudioPlayerState = {
  playMode: PlayMode.listLoop,
  currentPlayingIdx: 3,
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
          name: "Xomu!nk fsdfsdgfdgdfg",
        },
        {
          id: 0,
          name: "Hyuringdfgdfgdfgdfh",
        },
        {
          id: 36455212,
          name: "mitsune微音gdfghfdhfghfgjhfgj!nk",
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
    {
      id: 1347846723,
      name: "菅野祐悟-JOJO的奇妙冒险白金之星处刑曲电音版（Kirara Magic Remix）",
      duration: 187472,
      artistInfo: [
        {
          id: 30226109,
          name: "Kirara Magic",
        },
      ],
      albume: {
        id: 75657939,
        name: "JOJO的奇妙冒险白金之星处刑曲电音版",
        picUrl:
          "https://p2.music.126.net/-QyMjrwQ_reituUTtbZEXA==/109951163881903368.jpg",
      },
    },
  ],
  currentPlayingTime: 0,
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
        lyrics: LyricsLineType[];
      }>
    ) => {
      state.currentPlayingInfo = {
        id: action.payload.id,
        audioUrl: action.payload.audioUrl,
        lyrics: action.payload.lyrics,
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
    setCurrentPlayingTimeReducer: (
      state,
      action: PayloadAction<{ time: number }>
    ) => {
      state.currentPlayingTime = action.payload.time;
    },
  },
});

export const {
  setCurrentPlayingInfoReducer,
  setCurrentPlayingIdxReducer,
  setIsPlayingReducer,
  changePlayModeReducer,
  setCurrentPlayingTimeReducer,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
