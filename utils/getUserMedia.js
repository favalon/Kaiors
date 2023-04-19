import { AudioStreamFormat, PushAudioInputStream } from "microsoft-cognitiveservices-speech-sdk";
import { getUserMedia } from "./getUserMedia";

export async function getUserMedia(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } else {
      throw new Error("Browser does not support getUserMedia");
    }
  }
  