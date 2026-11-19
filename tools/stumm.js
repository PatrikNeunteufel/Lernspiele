// Ton aus in den Werkzeugen mit Chrome ohne Fenster (Wunsch Patrik, LERN_Session48: mehrere Messungen gleichzeitig
// spielten Klänge und die Stimme der Eule übereinander ab). Zwei Teile, weil die Stimme nicht über den Ton des Browsers
// läuft: Unter Windows spricht speechSynthesis über die Sprachausgabe des Systems, und --mute-audio erreicht sie nicht.
// - STUMM_ARG für den Start von Chrome: Klänge (AudioContext, LS.ton) und Medien ohne Ton.
// - STUMM_SKRIPT für Page.addScriptToEvaluateOnNewDocument (läuft in jedem Rahmen, auch in eingebetteten Spielen):
//   jede Äusserung mit Lautstärke 0. Gesprochen wird weiter — Ereignisse und Dauer bleiben gleich, die Messungen
//   sehen dieselbe Sprechblase und dieselben Wartezeiten wie mit Ton.
"use strict";

const STUMM_ARG = "--mute-audio";

const STUMM_SKRIPT = `(() => {
  try {
    const Echt = window.SpeechSynthesisUtterance;
    if (!Echt) return;
    window.SpeechSynthesisUtterance = class extends Echt {
      constructor(...a) { super(...a); super.volume = 0; }
      get volume() { return 0; }
      set volume(v) { super.volume = 0; }
    };
  } catch { /* ohne Stimme */ }
})();`;

// Am offenen Tab vor dem ersten Laden aufrufen; send ist die CDP-Funktion des Werkzeugs.
async function stummSchalten(send) {
  await send("Page.addScriptToEvaluateOnNewDocument", { source: STUMM_SKRIPT });
}

module.exports = { STUMM_ARG, STUMM_SKRIPT, stummSchalten };
