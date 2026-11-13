/* Prüfansicht von English Word-Match (LP5 a, LERN_Session37; Rahmen: spiele/gemeinsam/listenpruefung.js, rahmen.md 17).
   Je Thema-Liste ein Abschnitt mit den Wörtern aus woerter.js (THEMEN_EN), so wie das Spiel sie zeigt: Bild,
   englisches Wort, deutsches Wort; „familie-koerper“ in zwei Gruppen (Family, Body). Die Wendungen (WENDUNGEN_EN)
   sind ein eigener Abschnitt ohne Bild. Die Stufen in den Beschreibungen liest die Ansicht aus der Stufentabelle
   des Spiels (STUFE): welche Themen eine Stufe nimmt und welche Aufgabenarten sie stellt.
   Sechs Listen leihen Listen & Tap (hören, Bild antippen) und Spelling-Bee (hören, buchstabieren) — geprüft wird nur
   hier. Beide nehmen das Wort und das Bild unverändert; Spelling-Bee verteilt die Wörter nach ihrer Länge auf die
   Stufen, darum die Spalte „Buchstaben“. Zu prüfen: Stimmt die Übersetzung (Schweizer Schreibweise), steht das
   Englische britisch, zeigt das Bild eindeutig dieses Wort und kein anderes desselben Themas? */
"use strict";
{
  /** Aufgabenarten des Spiels (STUFE[…].arten) in Worten. */
  const ART = {
    bildZuEn: "Bild → englisches Wort",
    enZuBild: "englisches Wort → Bild",
    deZuEn: "deutsches Wort → englisches Wort",
    enZuDe: "englisches Wort → deutsches Wort",
    buchstabieren: "mit Bild und deutschem Wort buchstabieren",
    deZuEnAehnlich: "deutsches Wort → englisches Wort unter ähnlichen Wörtern aus allen Themen",
    buchstabierenSchwer: "ohne Bild buchstabieren (nur Wörter ab 4 Buchstaben, zwei Buchstaben zu viel)",
    wendung: "Wendung Deutsch → Englisch oder Englisch → Deutsch",
  };
  const nummer = s => s.slice(1);
  const arten = s => [...new Set(STUFE[s].arten)];
  /** „Stufe 1: Bild → englisches Wort; Stufe 2: …“ für die Stufen, die eines der Themen nehmen. */
  const stufenText = themen => Object.keys(STUFE)
    .filter(s => STUFE[s].themen.some(t => themen.includes(t)))
    .map(s => `Stufe ${nummer(s)}: ${arten(s).filter(a => a !== "wendung").map(a => ART[a]).join(", ")}`)
    .join("; ");
  const wendungsStufen = Object.keys(STUFE).filter(s => STUFE[s].arten.includes("wendung")).map(nummer);

  /** Themen einer Liste (Feld liste in woerter.js), in der Reihenfolge von THEMEN_EN. */
  const themenVon = liste => Object.keys(THEMEN_EN).filter(t => THEMEN_EN[t].liste === liste);
  const themaVon = w => Object.values(THEMEN_EN).find(t => t.woerter.includes(w));

  // Leihende Spiele (Katalog: listen-tap und spelling-bee, Feld listen mit von: "word-match/<liste>").
  // Ihre Stufentabellen stehen nur auf ihren Seiten; hier abgeschrieben aus listen-tap/index.html und spelling-bee/index.html.
  const listenTap = stufen => `Listen & Tap leiht die Liste (Stufen ${stufen}): Das Gerät spricht das englische Wort mit `
    + "englischer Stimme (bevorzugt britisch), das Kind tippt unter vier Bildern desselben Themas (Königsstufe: sechs) das passende. "
    + "Das Wort muss sich also vorgelesen eindeutig verstehen lassen, und sein Bild darf nicht auch zu einem anderen Wort des Themas passen.";
  const SPELLING_BEE = "Spelling-Bee leiht sie ebenfalls: Das Gerät spricht das Wort, das Kind legt es aus Buchstaben-Kacheln — "
    + "Stufe 1 mit sichtbarem Wort (abschreiben) und Stufe 2 nur Wörter bis 5 Buchstaben, Stufe 3 bis 7 (beide mit Bild), "
    + "Stufe 4 alle mit dem deutschen Wort und einem Buchstaben zu viel, Stufe 5 nur hören ab 5 Buchstaben mit zwei zu viel, "
    + "Stufe 6 alle, nur hören, drei verwechselbare Buchstaben zu viel. Das Wort muss dafür aus Kleinbuchstaben a–z bestehen "
    + "(kein Leerzeichen, kein Bindestrich, kein Apostroph). Beide Spiele ändern nichts am Wort und zeigen dasselbe Bild.";

  const SPALTEN = ["Bild", "Englisch", "Deutsch", "Buchstaben"];
  const zeile = ([en, de, bild]) => [bild, en, de, en.length];
  const HINWEIS = "Stimmt die Übersetzung (Schweizer Schreibweise, ss statt ß), steht das englische Wort britisch geschrieben "
    + "wie im Lehrmittel, und zeigt das Bild eindeutig dieses Wort? Die falschen Antworten nimmt das Spiel aus demselben Thema "
    + "(Bilder, englische und deutsche Wörter) — keines davon darf ebenso passen. Die Spalte „Buchstaben“ zählt das englische "
    + "Wort für das Buchstabieren.";

  /** Liste aus Themen von THEMEN_EN; mehrere Themen werden Gruppen. */
  function themenListe(liste, { geliehen, tapStufen }) {
    const themen = themenVon(liste);
    const namen = themen.map(t => THEMEN_EN[t].name).join(", ");
    const teile = [`Englische Wörter mit Bild (${namen}). In Word-Match — ${stufenText(themen)}.`];
    if (themen.length > 1) teile.push(themen.map(t => `${THEMEN_EN[t].name}: Stufen ${Object.keys(STUFE).filter(s => STUFE[s].themen.includes(t)).map(nummer).join(", ")}`).join("; ") + ".");
    teile.push(geliehen ? `${listenTap(tapStufen)} ${SPELLING_BEE}`
      : "Nur Word-Match nutzt diese Liste: Listen & Tap und Spelling-Bee lassen sie mit Absicht weg.");
    return {
      beschreibung: teile.join(" "),
      abschnitte: [{
        id: liste, titel: `Wörter: ${namen}`, spalten: SPALTEN,
        hinweis: HINWEIS + (themen.length > 1 ? " Je Thema eine Gruppe; die falschen Antworten kommen nur aus dem eigenen Thema." : ""),
        eintraege: () => themen.flatMap(t => THEMEN_EN[t].woerter),
        zeile,
        ...(themen.length > 1 ? { gruppe: w => themaVon(w)?.name || "?" } : {}),
      }],
    };
  }

  LS.listenPruefung("word-match", {
    farben: themenListe("farben", { geliehen: true, tapStufen: "1, 2, 3, 6" }),
    tiere: themenListe("tiere", { geliehen: true, tapStufen: "1, 2, 3, 6" }),
    zahlen: themenListe("zahlen", { geliehen: true, tapStufen: "1, 2, 3, 6" }),
    essen: themenListe("essen", { geliehen: true, tapStufen: "2, 3, 6" }),
    "familie-koerper": themenListe("familie-koerper", { geliehen: true, tapStufen: "2, 3, 6" }),
    schule: themenListe("schule", { geliehen: true, tapStufen: "2, 3, 6" }),
    wetter: themenListe("wetter", { geliehen: false }),
    wendungen: {
      beschreibung: `Kurze Wendungen ohne Bild (Hello!, How are you?). In Word-Match Stufen ${wendungsStufen.join(", ")}: `
        + "Das Spiel zeigt die Wendung auf Deutsch oder auf Englisch, das Kind wählt die Übersetzung unter vier Wendungen. "
        + "Nur Word-Match nutzt diese Liste: Listen & Tap und Spelling-Bee lassen sie weg (keine Einzelwörter).",
      abschnitte: [{
        id: "wendungen", titel: "Wendungen", spalten: ["Englisch", "Deutsch"],
        hinweis: "Stimmt die Übersetzung in beide Richtungen, und sagt man es so (britisches Englisch, Schweizer Schreibweise)? "
          + "Die falschen Antworten sind die anderen Wendungen der Liste — keine davon darf ebenso als Übersetzung passen.",
        eintraege: () => WENDUNGEN_EN, zeile: ([en, de]) => [en, de],
      }],
    },
  });
}
