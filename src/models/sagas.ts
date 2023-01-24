import { takeEvery } from "redux-saga/effects";
import { switchAudioToEffect, initPlayerEffect } from "./AudioPlayer.saga";

export default function* sagas() {
  yield takeEvery("audioPlayer/switchAudioToEffect", switchAudioToEffect);
  yield takeEvery("audioPlayer/initPlayerEffect", initPlayerEffect);
}