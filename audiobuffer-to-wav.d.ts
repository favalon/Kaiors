declare module 'audiobuffer-to-wav' {
    function toWav(audioBuffer: AudioBuffer, isFloat32?: boolean): ArrayBuffer;
    export = toWav;
  }
  