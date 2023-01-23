import { takeEvery } from "redux-saga/effects";
import { fetchAudioUrlEffect, initPlayerEffect } from "./AudioPlayer.saga";

export default function* sagas() {
  yield takeEvery("audioPlayer/fetchAudioUrlEffect", fetchAudioUrlEffect);
  yield takeEvery("audioPlayer/initPlayerEffect", initPlayerEffect);
}