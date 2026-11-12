/* Gemeinsamer Rahmen aller Lernspiele: Stufenwahl, Runde mit Fortschritt, Eule mit
   Sprechblase, Bildschirmtastatur, Töne, Konfetti, Schluss mit Sternen.
   Ein Spiel ruft LS.spiel({...}) auf und zeichnet nur noch seine Aufgaben. */

const LS = (() => {
  "use strict";

  // Reihenfolge von gross nach klein, wie in der Stellenwerttabelle.
  const STELLEN = [
    { k: "M",  name: "Millionen",        wert: 1000000 },
    { k: "HT", name: "Hunderttausender", wert: 100000 },
    { k: "ZT", name: "Zehntausender",    wert: 10000 },
    { k: "T",  name: "Tausender",        wert: 1000 },
    { k: "H",  name: "Hunderter",        wert: 100 },
    { k: "Z",  name: "Zehner",           wert: 10 },
    { k: "E",  name: "Einer",            wert: 1 },
  ];

  const SCHMAL = " "; // schmales, nicht umbrechendes Leerzeichen

  /**
   * Schreibweise des Eulenpfads für den Kern (kern/zahl.js, kern 1.0.0, docs/plan_angleich_reihe.md B): ab fünf Stellen
   * in Dreiergruppen mit schmalem Leerzeichen („30 400“), vierstellig ungegliedert („4500“), Dezimalzeichen nach
   * Einstellung der Aufsicht.
   */
  const schreibweise = () => ({ tausender: SCHMAL, abStellen: 5, minus: "−", dezimal: einstellung("dezimal") === "komma" ? "," : "." });

  /** Zahl in Schulschreibweise: „30 400“, „4500“; keine ganze Zahl wie dezimalText (nur der ganze Teil gegliedert). */
  function zahlText(n) { return KERN.zahl.text(n, schreibweise()); }

  /** „bei den Zehnern“, „bei den Millionen“ */
  function dativ(stelle) { return stelle.name.endsWith("n") ? stelle.name : stelle.name + "n"; }

  // Zufall aus dem Kern (kern/zufall.js, kern 1.1.0): Quelle Math.random, erst beim Aufruf gelesen — das Testskript
  // ersetzt Math.random im Ersatz-DOM (tools/pruef_dom.js) und bekommt so dieselbe Folge wie bisher.
  const { zufall, waehle, mische } = KERN.zufall;

  /** Ziffern einer Zahl je Stelle, z. B. 30400 → {M:0, HT:0, ZT:3, T:0, H:4, Z:0, E:0}. */
  function zerlege(n) {
    const z = {};
    for (const st of STELLEN) z[st.k] = Math.floor(n / st.wert) % 10;
    return z;
  }

  /** Element bauen (kern/el.js): text für Daten, html nur für festen Text; false/null-Attribute und -Kinder fallen weg. */
  const el = KERN.el;

  // ---------- Speicher (nur im Browser, darf fehlen; kern/speicher.js mit Präfix „lernspiele:“) ----------
  // Was wächst (Runden, Rekorde, Meldungen, Löschvermerke), liegt in IndexedDB „lernspiele-ablage“ (Kern 1.34.0,
  // docs/konzept_gruppen.md 5a, Entscheide D11 a, D11-W a); localStorage hat je Ursprung nur 5 MiB für alle Apps. Jede
  // Seite startet erst nach dem Laden (nachBereit); ohne IndexedDB (Testskripte, gesperrter Speicher) sofort und wie bisher
  // in localStorage. Liegt ein Schlüssel beim Start in beiden Speichern (ein Tab der alten Fassung schrieb nach dem Umzug),
  // werden Löschvermerke und Meldungen nach ihren Regeln vereinigt, Runden und Rekorde nach Kennung (Standard des Kerns).
  const GROSS = ["protokoll", "rekorde", "meldungen", "geloescht"];
  const SPEICHER = KERN.speicher("lernspiele:", { gross: GROSS, datenbank: "lernspiele-ablage",
    vereinen: (s, a, b) => (s === "geloescht" ? KERN.daten.vermerkeVereinen(a, b) : s === "meldungen" ? KERN.meldungen.zusammenfuehren(a, b).wert : undefined) });
  // Was nach dem Laden der grossen Schlüssel einmal laufen soll (Umzug alter Stände, Abgleich starten)
  const nachLaden = [];
  let geladen = false, bereitVersprechen = null;
  function laden() {
    if (geladen) return;
    geladen = true;
    for (const f of nachLaden) try { f(); } catch (e) { console.error(e); }
  }
  /** Versprechen, das nach dem Laden der grossen Schlüssel erfüllt ist (einmal je Seite). */
  function bereit() {
    if (!bereitVersprechen) bereitVersprechen = geladen ? Promise.resolve() : SPEICHER.bereit().then(laden);
    return bereitVersprechen;
  }
  /** f nach dem Laden ausführen: sofort, wenn schon geladen (ohne IndexedDB immer), sonst danach; gibt f() oder ein Versprechen. */
  function nachBereit(f) { return geladen ? f() : bereit().then(f); }
  /** f einmal nach dem Laden ausführen (sofort, wenn schon geladen). */
  function beiBereit(f) { if (geladen) f(); else nachLaden.push(f); }

  // Scheitert das Speichern einer Runde, sagt die Seite es sichtbar (D11 a; konzept_gruppen.md 5a) — bis LERN_Session26
  // ging sie still verloren. In IndexedDB scheitert es erst nach dem Schreiben; das meldet der Speicher über beiFehler.
  // Für eine erwachsene Person geschrieben: Sichern und Löschen gehen in der Statistik.
  let speicherVollGezeigt = false;
  function speicherVoll() {
    if (speicherVollGezeigt || typeof document === "undefined" || !document.body) return;
    speicherVollGezeigt = true;
    document.body.prepend(el("p", { class: "speicher-voll", role: "alert", text: "Nicht gespeichert: Der Speicher dieses Browsers ist voll. "
      + "Bitte eine erwachsene Person holen: in der Statistik den Stand sichern und alte Runden löschen, sonst geht auch die nächste Runde verloren." }));
  }
  SPEICHER.beiFehler(() => speicherVoll());

  // Wer wissen will, dass etwas gespeichert wurde (der Abgleich zwischen Geräten, abgleich.js).
  const aenderungsHoerer = [];
  const beiAenderung = f => aenderungsHoerer.push(f);

  function lies(schluessel, ersatz) { return SPEICHER.lies(schluessel, ersatz); }

  /** Speichern und die Hörer benachrichtigen; true, wenn es gespeichert ist (false: Speicher voll oder gesperrt). */
  function schreibe(schluessel, wert) {
    const ok = SPEICHER.schreibe(schluessel, wert);
    for (const f of aenderungsHoerer) try { f(schluessel); } catch { /* ein Hörer darf das Speichern nicht stören */ }
    return ok;
  }

  // ---------- Einstellungen der Aufsicht, gelten für alle auf diesem Gerät (Wunsch Patrik, LERN_Session7) ----------
  // Später setzt sie eine Lehrperson je Klasse: docs/eulenpfad/konzept_klasseneinstellungen.md.
  // Gespeichert wird nur, was vom Standard abweicht: lernspiele:einstellungen =
  //   { <name>: wert, spiele: { <spiel-id>: { <name>: wert } } }. Je Spiel gilt: eigener Wert, sonst global,
  //   sonst Standard. Welche Spiele eine Einstellung nutzen, steht im Katalog (Feld einstellungen).
  const EINSTELLUNGEN = {
    dezimal: {
      titel: "Dezimalzeichen", standard: "punkt",
      werte: { punkt: "Punkt: 4.5", komma: "Komma: 4,5" },
      erklaerung: "So stehen Dezimalzahlen in den Spielen (Längen, Wege, Gewichte) und Geldbeträge ab der 4. Klasse (25.60 Fr.). Bis zur 3. Klasse stehen sie als Franken und Rappen: 25 Fr. 60 Rp. Standard ist der Punkt wie im Lehrplan.",
    },
    melden: {
      titel: "Fehler melden durch Kinder", standard: "ab3",
      werte: { aus: "aus", ab3: "ab der 3. Klasse", ab5: "ab der 5. Klasse", alle: "alle Kinder" },
      erklaerung: "Kinder können in jedem Spiel mit „🙋 Melden“ einen Fehler in der Aufgabe oder der Aufgabe davor melden, mit Begründung. Die Meldung sieht zuerst die Aufsicht (Verwaltung → Meldungen); weitergegeben wird nur, was sie bestätigt, und ohne den Namen. Ab der 3. Klasse, weil die Begründung geschrieben wird.",
    },
    // Sortierung im Tab Spiele (Wunsch Patrik, Entscheide SO1 a, SO2 a, LERN_Session11)
    sortierung: {
      titel: "Sortierung der Spiele", standard: "thema",
      werte: { thema: "Nach Fach und Thema", passung: "Passt zu dir zuerst", name: "Nach Alphabet", klasse: "Nach Klasse" },
      erklaerung: "So stehen die Spiele im Tab Spiele, wenn ein Kind nichts anderes gewählt hat. „Passt zu dir“ ordnet nach Klasse und dem, was das Kind noch üben sollte (wie die Suche) — die Liste ändert sich dann mit jeder Runde. Je Kind lässt es sich in Konten abweichend setzen.",
    },
    sortierungWahl: {
      titel: "Kinder wählen die Sortierung selbst", standard: "ab4",
      werte: { nie: "nie", ab4: "ab der 4. Klasse", ab5: "ab der 5. Klasse", alle: "alle Kinder" },
      erklaerung: "Darf ein Kind im Tab Spiele selbst wählen, wie sortiert wird (Thema, passt zu dir, Alphabet, Klasse, auf- oder absteigend)? Je Kind lässt es sich in Konten ein- oder ausschalten. Ab der 4. Klasse, weil die Wahl gelesen werden muss.",
    },
    // Entscheid NZ1 a (LERN_Session13): Notizfelder für Zwischenergebnisse, dort wo sie hingehören
    notizen: {
      titel: "Notizen für Zwischenergebnisse", standard: "stufe",
      werte: { stufe: "nach Stufe", immer: "immer", nie: "nie (Kopfrechnen)" },
      erklaerung: "In Aufgaben mit mehreren Rechenschritten gibt es kleine Felder für Zwischenergebnisse (✏️), etwa auf den Pfeilen der Rechen-Maschine. Sie werden nicht bewertet. „Nach Stufe“: in den unteren Stufen ohne, damit Kopfrechnen geübt wird; ab der Stufe, in der es vor allem ums Merken ginge, mit. Die Statistik zeigt, ob ein Kind sie braucht.",
    },
    // Entscheide NB1–NB3 a (LERN_Session14): Notizblock für schriftliche Verfahren, nur wo Notizfelder stehen
    notizblock: {
      titel: "Notizblock für schriftliches Rechnen", standard: "stufe", spieleWie: "notizen",
      werte: { stufe: "ab Stufe 4", immer: "immer, wo Notizen sind", nie: "nie" },
      erklaerung: "Neben den Notizfeldern steht „📝 Notizblock“: Das Kind wählt eine Vorlage (Plus, Minus, Mal, Geteilt oder Häuschen), tippt seine Zahlen ein und rechnet darunter wie auf einem Blatt, mit Überträgen. Plus und Minus lassen sich mischen, und mit „Weiterrechnen“ hängt es die nächste Rechnung an. Nichts wird geprüft; das Ergebnis schreibt das Kind selbst ab. Gibt es keine Notizen (Einstellung oben auf „nie“), gibt es auch keinen Block. Die Statistik zeigt „mit Notizblock“.",
    },
    // Entscheid AN3 a (LERN_Session27, docs/konzept_abschluss_animationen.md): Abschluss-Animation am Ende einer Runde
    feier: {
      titel: "Abschluss-Animation", standard: "an",
      werte: { an: "an", aus: "aus" },
      erklaerung: "Am Ende einer geschafften Runde zeigt das Spiel eine kurze Animation, die mit der Stufe weiter führt (etwa die Rakete vom Mond bis zum Saturn); mehr Sterne schmücken sie aus. Ein Tippen überspringt sie. Mit der Einstellung „Bewegung reduzieren“ des Geräts steht gleich das Schlussbild. Spiele ohne eigene Animation zeigen wie bisher Konfetti. Während einer Ruhezeit (unten) kann sie ruhen.",
    },
    // Entscheid AN3-K a (LERN_Session27): je Gerät, reist nicht mit dem Abgleich (Kopfhörer erkennt eine Webseite nicht)
    kopfhoerer: {
      titel: "🎧 Dieses Gerät wird mit Kopfhörern benutzt", standard: "nein",
      werte: { nein: "nein", hoeren: "ja: Hören auch in der Ruhezeit", vorlesen: "ja: Hören und Vorlesen auch in der Ruhezeit" },
      erklaerung: "Mit Kopfhörern stört der Ton niemanden: Dann gilt die Ruhezeit nicht für das Hören (Aussprache, Musik, Hörgeschichten), auf Wunsch auch nicht für das Vorlesen der Eule. Klänge und Abschluss-Animation folgen weiter der Ruhezeit. Ob Kopfhörer stecken, kann eine Webseite nicht zuverlässig erkennen, darum steht es hier.",
    },
    // Zusatz Patrik zu AN3-K (LERN_Session27): je Gerät
    tonSpieleRuhe: {
      titel: "Spiele, die Ton brauchen, während einer Ruhezeit", standard: "zeigen",
      werte: { zeigen: "mit Kopfhörer-Hinweis zeigen", ausblenden: "ausblenden" },
      erklaerung: "Spiele mit der Spielweise „Hören“ brauchen Ton. In einer Ruhezeit, die das Hören einschliesst, zeigen sie vor der Runde „🎧 Diese Runde braucht Ton“ mit „Ton für diese Runde an“ — oder sie fehlen im Tab Spiele, bis die Ruhezeit vorbei ist. Zufall und Zufallsmix nehmen sie in der Ruhezeit nie, weil dort niemand den Ton einschalten kann. Mit Kopfhörern (oben) bleiben sie immer da.",
    },
    // Wunsch Patrik (LERN_Session32, Konzept Gestaltung): Stil der Startseite und um die Spiele herum (STIL am Ende der
    // Datei), Standard „hand“ (Patrik, LERN_Session32)
    stil: {
      titel: "Stil", standard: "hand",
      werte: { hand: "wie von Hand gezeichnet", glatt: "glatt" },
      erklaerung: "So sehen die Startseite und um jedes Spiel herum Stufenwahl, Ranglisten und Schlussbild aus (die Aufgabe selbst bleibt glatt): wie von Hand gezeichnet oder glatt — Rahmen leicht krumm, die Linie mal dicker, mal dünner, Knöpfe und Felder mit unregelmässigen Ecken, die Spielkarten nicht ganz in Reih und Glied. Die Farben bleiben dieselben.",
    },
    // Entscheid KR1 a (LERN_Session13): ein Kind fängt auch ohne Aufsicht an
    selbstAnlegen: {
      titel: "Kinder legen sich selbst an", standard: "ja",
      werte: { ja: "ja", nein: "nein, nur die Aufsicht" },
      erklaerung: "Auf der Anmeldung steht „🐣 Ich bin neu“: Ein Kind gibt seinen Vornamen und die Klasse ein undspielt gleich los. Ausschalten, wenn sonst doppelte oder erfundene Namen die Übersicht stören (etwa in einer Klasse); dann legt nur die Aufsicht Kinder an (Verwaltung → Konten).",
    },
  };

  // Blöcke der Einstellungen in der Verwaltung (Wunsch Patrik LERN_Session32: zusammengehörende Blöcke, der Stil für
  // sich): je Block eine Karte in dieser Reihenfolge. Jede Einstellung steht in genau einem Block (tools/eulenpfad_seiten.js).
  // teil: ein Teil der Verwaltung, der im Block nach den Einstellungen steht (Ruhezeiten).
  const EINSTELLUNG_BLOECKE = [
    { id: "aussehen", titel: "🎨 Aussehen", text: "Wie die Startseite und die Seiten um die Spiele aussehen.", einstellungen: ["stil"] },
    { id: "spiele", titel: "🎮 In den Spielen", text: "Was in jedem Spiel gilt, je Spiel auch abweichend.", einstellungen: ["dezimal", "notizen", "notizblock", "feier"] },
    { id: "kinder", titel: "🧒 Kinder", text: "Was Kinder selbst dürfen und wie sie die Spiele finden.", einstellungen: ["selbstAnlegen", "melden", "sortierung", "sortierungWahl"] },
    { id: "ton", titel: "🔊 Ton und Ruhezeiten", text: "Wann Spiele still sind und was mit Kopfhörern trotzdem geht.", einstellungen: ["kopfhoerer", "tonSpieleRuhe"], teil: "ruhezeiten" },
  ];

  /** Id des Spiels dieser Seite (spiele/<id>/index.html), auch bevor eine Runde läuft; sonst null. */
  const seitenSpiel = () => (typeof location !== "undefined" ? location.pathname.match(/\/spiele\/([^/]+)\//)?.[1] ?? null : null);

  /** Wert für das laufende Spiel (oder spielId); ohne Spiel der globale. */
  function einstellung(name, spielId = spielStand?.spiel ?? seitenSpiel()) {
    const e = EINSTELLUNGEN[name];
    const alle = lies("einstellungen", {});
    const eigen = spielId ? alle.spiele?.[spielId]?.[name] : undefined;
    if (eigen in e.werte) return eigen;
    return alle[name] in e.werte ? alle[name] : e.standard;
  }

  /** Eigener Wert eines Spiels oder null („wie global“). */
  const einstellungSpiel = (name, spielId) => lies("einstellungen", {}).spiele?.[spielId]?.[name] ?? null;

  /** wert null: global zurück auf den Standard, je Spiel zurück auf „wie global“. */
  function setzeEinstellung(name, wert, spielId = null) {
    const alle = { ...lies("einstellungen", {}) };
    if (spielId) {
      const spiele = { ...alle.spiele };
      const eigen = { ...spiele[spielId] };
      if (wert === null) delete eigen[name]; else eigen[name] = wert;
      if (Object.keys(eigen).length) spiele[spielId] = eigen; else delete spiele[spielId];
      if (Object.keys(spiele).length) alle.spiele = spiele; else delete alle.spiele;
    } else if (wert === null || wert === EINSTELLUNGEN[name].standard) delete alle[name];
    else alle[name] = wert;
    schreibe("einstellungen", alle);
  }

  const einstellungenZuruecksetzen = () => schreibe("einstellungen", {});

  // ---------- Ruhezeiten (Entscheide AN3-Z a, AN3-T a mit der Lesart „differenziert“, AN3-K a; LERN_Session27) ----------
  // lernspiele:ruhezeiten = { stand, zeiten: [{ id, tage: [1–7, Mo = 1], von: "08:00", bis: "12:00", arten: [...] }],
  // spiele: { <spiel>: "aus" | "alles" } }; reist mit dem Abgleich (Teil ruhezeiten, der jüngere Stand gewinnt).
  // Während einer Zeitspanne schweigt, was sie nennt (RUHE_ARTEN), nach der Ortszeit des Geräts. Je Spiel: „aus“ = gilt in
  // diesem Spiel nicht, „alles“ = gilt hier für alle Arten. Die Kopfhörer-Einstellung des Geräts nimmt Hören, auf Wunsch
  // auch Vorlesen aus; „Ton für diese Runde an“ nimmt Hören für eine Runde aus. Ohne Zeitspannen ändert sich nichts.
  const RUHE_ARTEN = {
    feier: "Abschluss-Animation",
    klaenge: "Klänge (Richtig, Falsch, Sterne)",
    vorlesen: "Vorlesen der Eule",
    hoeren: "Hören als Inhalt (Aussprache, Musik, Hörgeschichten)",
  };
  const WOCHENTAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const UHRZEIT = /^(([01]\d|2[0-3]):[0-5]\d|24:00)$/;
  const minuten = hhmm => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));
  /** Eine Zeitspanne in der gespeicherten Form? (Fremde Daten aus dem Abgleich gehen erst nach dieser Prüfung durch.) */
  function ruheZeitGueltig(z) {
    return !!z && typeof z === "object" && typeof z.id === "string" && z.id.length > 0 && z.id.length <= 40
      && Array.isArray(z.tage) && z.tage.length > 0 && z.tage.every(t => Number.isInteger(t) && t >= 1 && t <= 7)
      && typeof z.von === "string" && typeof z.bis === "string" && UHRZEIT.test(z.von) && UHRZEIT.test(z.bis)
      && minuten(z.von) < minuten(z.bis)
      && Array.isArray(z.arten) && z.arten.length > 0 && z.arten.every(a => a in RUHE_ARTEN);
  }
  const ruheSpielWert = w => w === "aus" || w === "alles";
  /** Gespeicherte Ruhezeiten, bereinigt: { stand, zeiten, spiele }. */
  function ruhezeiten() {
    const r = lies("ruhezeiten", null);
    const roh = r && typeof r === "object" ? r : {};
    const spiele = {};
    if (roh.spiele && typeof roh.spiele === "object") for (const [id, w] of Object.entries(roh.spiele)) if (ruheSpielWert(w)) spiele[id] = w;
    return { stand: typeof roh.stand === "string" ? roh.stand : "", zeiten: Array.isArray(roh.zeiten) ? roh.zeiten.filter(ruheZeitGueltig) : [], spiele };
  }
  /** Ruhezeiten ändern (nur die genannten Teile); stand = jetzt, damit der Abgleich den jüngeren Stand erkennt. */
  function setzeRuhezeiten({ zeiten, spiele } = {}) {
    const alt = ruhezeiten();
    const neu = { stand: new Date().toISOString(), zeiten: (zeiten ?? alt.zeiten).filter(ruheZeitGueltig), spiele: { ...(spiele ?? alt.spiele) } };
    for (const [id, w] of Object.entries(neu.spiele)) if (!ruheSpielWert(w)) delete neu.spiele[id];
    schreibe("ruhezeiten", neu);
  }
  /** Zeitspannen, die jetzt gelten (Ortszeit des Geräts). */
  function ruheJetzt(jetzt = new Date()) {
    const tag = ((jetzt.getDay() + 6) % 7) + 1, min = jetzt.getHours() * 60 + jetzt.getMinutes();
    return ruhezeiten().zeiten.filter(z => z.tage.includes(tag) && minuten(z.von) <= min && min < minuten(z.bis));
  }
  let tonFuerRunde = false; // „Ton für diese Runde an“ (AN3-T a): bis zum Ende der Runde
  /** Schweigt art („feier“, „klaenge“, „vorlesen“, „hoeren“) gerade, im Spiel spielId (ohne: das laufende)? */
  function ruhe(art, spielId = spielStand?.spiel ?? seitenSpiel(), jetzt = new Date()) {
    const aktiv = ruheJetzt(jetzt);
    if (!aktiv.length) return false;
    const je = spielId ? ruhezeiten().spiele[spielId] : undefined;
    if (je === "aus") return false;
    if (je !== "alles" && !aktiv.some(z => z.arten.includes(art))) return false;
    const kopf = einstellung("kopfhoerer", null);
    if (art === "hoeren" && (kopf !== "nein" || tonFuerRunde)) return false;
    if (art === "vorlesen" && kopf === "vorlesen") return false;
    return true;
  }
  /** Braucht das Spiel Ton (Spielweise „Hören“ im Katalog)? */
  const brauchtTon = spielId => !!katalogEintrag(spielId)?.art?.includes("hoeren");
  /** Spiel mit Ton, das gerade ruht (Hinweis vor der Runde; Zufall und Mix nehmen es nicht). */
  const tonSpielRuht = spielId => brauchtTon(spielId) && ruhe("hoeren", spielId);
  /** Ausgeblendet im Tab Spiele, weil die Aufsicht Ton-Spiele in der Ruhezeit ausblendet? */
  const ruheAusgeblendet = spielId => einstellung("tonSpieleRuhe", null) === "ausblenden" && tonSpielRuht(spielId);
  /** Für die Verwaltung: was gerade gilt — [] ohne Ruhezeit, sonst je Zeitspanne { text, arten }. */
  const ruheStand = (jetzt = new Date()) => ruheJetzt(jetzt).map(z => ({
    text: `${ruheTageText(z.tage)} ${z.von}–${z.bis}`, arten: z.arten.map(a => RUHE_ARTEN[a]) }));
  /** „Mo–Fr“, „Mo, Mi, Fr“, „jeden Tag“. */
  function ruheTageText(tage) {
    const t = [...new Set(tage)].sort((a, b) => a - b);
    if (t.length === 7) return "jeden Tag";
    const lueckenlos = t.every((x, i) => i === 0 || x === t[i - 1] + 1);
    return lueckenlos && t.length > 2 ? `${WOCHENTAGE[t[0] - 1]}–${WOCHENTAGE[t[t.length - 1] - 1]}` : t.map(x => WOCHENTAGE[x - 1]).join(", ");
  }
  // Abgleich (AN3-Z a): die Ruhezeiten gelten für das Gerät, nicht für eine Person — sie reisen nur in der Abgleich-Datei,
  // nicht in der Sicherung eines Kindes; der jüngere Stand gewinnt, fremde Zeitspannen nur nach der Prüfung.
  const RUHE_TEIL = {
    schluessel: "ruhezeiten",
    sichern: (ids, eigene) => (ids ? null : eigene && typeof eigene === "object" ? eigene : null),
    zusammenfuehren: (eigene, fremde) => {
      if (!fremde || typeof fremde !== "object" || typeof fremde.stand !== "string") return { wert: eigene ?? null, neu: 0 };
      if (eigene && typeof eigene === "object" && typeof eigene.stand === "string" && eigene.stand >= fremde.stand) return { wert: eigene, neu: 0 };
      const spiele = {};
      if (fremde.spiele && typeof fremde.spiele === "object") for (const [id, w] of Object.entries(fremde.spiele)) if (ruheSpielWert(w)) spiele[id] = w;
      return { wert: { stand: fremde.stand, zeiten: Array.isArray(fremde.zeiten) ? fremde.zeiten.filter(ruheZeitGueltig) : [], spiele }, neu: 1 };
    },
  };

  /**
   * Dezimalzahl mit dem eingestellten Zeichen, vor dem Komma in Schulschreibweise: 30 400.5 oder 30 400,5.
   * stellen: feste Anzahl Nachkommastellen; ohne Angabe so viele wie nötig, ohne Exponent und Rundungsreste. Kern.
   */
  function dezimalText(x, stellen) { return KERN.zahl.dezimalText(x, stellen, schreibweise()); }

  /**
   * Geldbetrag (in Rappen) so, wie die Klasse ihn schreibt (Entscheid C1 a, LERN_Session7): bis zur
   * 3. Klasse „25 Fr. 60 Rp.“ (Lehrplan MA.3.A.2.d), ab der 4. Klasse „25.60 Fr.“ mit dem eingestellten
   * Dezimalzeichen (MA.3.A.3.d „5.40 Fr.“; Zahlenbuch 4 „Punktschreibweise“). Ganze Franken immer „13 Fr.“.
   * klasse: ohne Angabe die Klasse der laufenden Stufe (klasseDerStufe).
   */
  function geldText(rp, klasse = klasseDerStufe(spielStand?.spiel, spielStand?.stufe)) {
    const fr = Math.floor(rp / 100), r = rp % 100;
    if (!r) return `${zahlText(fr)} Fr.`;
    if (klasse >= 4) return `${dezimalText(rp / 100, 2)} Fr.`;
    return fr ? `${zahlText(fr)} Fr. ${r} Rp.` : `${r} Rp.`;
  }

  // ---------- Spieler, Profil und Protokoll (nur auf diesem Gerät) ----------
  // Profil einer Person (lernspiele:personen, KERN.person; Kennung id, Name je Gerät eindeutig; P1 a, LERN_Session15):
  //   { id, name, geboren, alter, klasse, fokus: [Lernziel-Ids, z. B. "4.2-G3"],
  //   geboren: "JJJJ-MM-TT" — Geburtsdatum, von der Aufsicht gesetzt (Plan B3, seit LERN_Session27); Profile seit
  //     LERN_Session14 tragen nur "JJJJ-MM" (der Monat gilt, bis der Tag nachgetragen ist). Das Alter rechnet alterVon
  //     (KERN.person.alter). alter: Zahl nur noch in älteren Profilen, gilt, solange geboren fehlt
  //   aufstiege: [{ von, nach, zeit }] — Klassenaufstiege durch die Aufsicht (LERN_Session14); aufstiegGesehen: ISO des
  //     zuletzt gefeierten Aufstiegs (das Kind hat die Nachricht gesehen)
  //   reihenfolge: { global, spiele: { <spiel-id>: … } } mit "stufe" | "geordnet" | "gemischt" }
  // Protokoll: je gespielte Runde ein Eintrag im gemeinsamen Format (R1 a, kern/runden.js)
  // { id, person, name (Anzeige), zeit (ISO, Ende), inhalt (Spiel), stufe, sterne (null: Serie, Mix), fehler, aufgaben,
  //   gezeigt, dauer (s, auf 0,1), geordnet, endlos?, gekuerzt?, abgebrochen?, liste: [{ ms, versuche, geloest, gezeigt?,
  //   uebersprungen?, zeitUm?, text?, loesung?, eingaben?, tipps?, vorgehen? }] } (KERN.runde, RA1–RA4 a) — bis
  //   LERN_Session15 „spiel“ statt „inhalt“, ohne id; bis LERN_Session18 aufgabenZeiten und fehlerAufgaben statt liste

  //   timer: { an, faktor, spiele: { <spiel-id>: { an (null = wie global), sekunden: { s1: … } } } }
  //   rolle: "lernend" | "aufsicht" (Entscheid L2 a; bis LERN_Session15 „kind“, P2 a) — die Aufsicht meldet sich mit PIN an, verwaltet
  //     Konten und Freigaben und spielt als Tester: Runden mit test: true, im Spiel Testhilfen
  //   pin: { salz, hash } nur bei der Aufsicht (SHA-256, nie die PIN selbst)
  //   wiederherstellung: { code: { salz, hash }, frage, antwort: { salz, hash } } nur bei der Aufsicht (PIN1 a)
  //   favoriten: [<spiel-id>], endlosAn: [<spiel-id>] (Karte startet Endlos-Runden), ansicht: "kacheln" | "kompakt",
  //   zu: [<Gruppen-Id>] (zugeklappt)
  //   mix: zuletzt gewählte Einstellungen des Zufallsmix (mix/mix.js) oder null
  //   meineKlasse: Filter „🎒 Meine Klasse“ im Tab Spiele (K2 a); fehlt = an
  //   optionen: { <spiel-id>: { <option>: Wert } } — Spieloptionen aus def.optionen (UE1 a); fehlt = "stufe"
  //   vorlesen: "auto" | "knopf" | fehlt = nach Klasse (Kindergarten und 1. Klasse automatisch), siehe Vorlesen
  //   lernplan: { tage, minuten } — Wochenziel, von der Aufsicht gesetzt (Entscheid L1 a, erfolge.js); fehlt = kein Ziel
  //   erfolgeGesehen: [ids] — Abzeichen, die das Kind im Tab Erfolge schon gesehen hat (🆕 bis dahin)
  //   sortierung: { art, ab } — Sortierung im Tab Spiele (art aus EINSTELLUNGEN.sortierung, ab = absteigend);
  //     fehlt = Vorgabe der Aufsicht. sortierungWahl: true | false | fehlt = nach Einstellung und Klasse (SO1 a)
  //   wahl: { timer: { <spiel>: bool }, reihenfolge: { <spiel>: Wert }, vorlesen: Wert } — was das Kind selbst auf der
  //     Stufenwahl oder der Spielkarte umgestellt hat; gilt vor der Vorgabe (timer, reihenfolge, vorlesen), siehe VR1 a
  //   fest: { timer, reihenfolge, vorlesen: bool } — von der Aufsicht festgelegt: die Wahl des Kindes gilt dann nicht
  //   avatar: "<tier>-<farbe>" (avatare.js) — vom Kind selbst gewählt (AV1 a); fehlt = Anfangsbuchstabe
  //   geaendert: { <feld>: ISO, angelegt: ISO } — setzt speichereProfil; beim Abgleich gewinnt je Feld der jüngere Stand
  const LEERES_PROFIL = {
    geboren: null, alter: null, klasse: null, fokus: [], rolle: "lernend", aufstiege: [], aufstiegGesehen: null,
    reihenfolge: { global: "stufe", spiele: {} },
    timer: { an: false, faktor: 1, spiele: {} },
    favoriten: [], endlosAn: [], ansicht: "kacheln", zu: [], mix: null,
    lernplan: null, erfolgeGesehen: [], sortierung: null, sortierungWahl: null, avatar: null,
  };

  /**
   * Sortierung im Tab Spiele für eine Person: { art, ab, waehlbar }. Die Aufsicht wählt immer selbst; ein Kind, wenn
   * sein Profil es erlaubt (sortierungWahl) oder sonst nach der Einstellung sortierungWahl und seiner Klasse.
   */
  function sortierungFuer(name) {
    const p = profil(name);
    const standard = einstellung("sortierung", null);
    const art = p.sortierung?.art in EINSTELLUNGEN.sortierung.werte ? p.sortierung.art : standard;
    let waehlbar = istAufsicht(name);
    if (!waehlbar) {
      if (typeof p.sortierungWahl === "boolean") waehlbar = p.sortierungWahl;
      else {
        const e = einstellung("sortierungWahl", null);
        const k = klasseVon(p);
        waehlbar = e === "alle" || (e !== "nie" && k != null && k >= (e === "ab5" ? 5 : 4));
      }
    }
    return { art, ab: !!p.sortierung?.ab, waehlbar };
  }

  /** Vorgabezeit je Aufgabe aus dem Katalog (Sekunden), falls die Seite ihn geladen hat. */
  function vorgabeZeit(spiel, stufe) {
    const eintrag = typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spiel) : null;
    return eintrag?.zeiten?.[stufe] ?? 30;
  }

  /**
   * Läuft für dieses Spiel und diese Stufe ein Timer, und wie viele Sekunden je Aufgabe?
   * Reihenfolge: Einstellung je Spiel → globale Einstellung; Sekunden je Spiel und Stufe →
   * Vorgabezeit × globaler Faktor.
   */
  function timerFuer(name, spiel, stufe) {
    const t = { ...LEERES_PROFIL.timer, ...(profil(name).timer || {}) };
    const s = t.spiele?.[spiel] || {};
    return {
      an: wahlFuer(name, "timer")?.[spiel] ?? s.an ?? t.an,
      sekunden: s.sekunden?.[stufe] ?? Math.max(5, Math.round(vorgabeZeit(spiel, stufe) * (t.faktor || 1))),
    };
  }

  /**
   * Zeitvorschlag aus den eigenen Messungen: Median der auf Anhieb gelösten Aufgaben × 1.5,
   * erst ab 5 Messungen; sonst null.
   */
  function zeitVorschlag(name, spiel, stufe) {
    // ohne Serien: dort wird die Zeit je Aufgabe knapper (ENDLOS_TEMPO), der Vorschlag gälte für gewöhnliche Runden
    const ms = protokoll()
      .filter(e => e.name === name && e.inhalt === spiel && e.stufe === stufe && !e.endlos)
      .flatMap(e => (e.liste || []).filter(a => a.geloest && a.versuche === 0 && !a.zeitUm && typeof a.ms === "number").map(a => a.ms))
      .sort((a, b) => a - b);
    if (ms.length < 5) return null;
    return { sekunden: Math.max(5, Math.round(ms[Math.floor(ms.length / 2)] * 1.5 / 1000)), n: ms.length };
  }

  // Wahl des Kindes und Vorgabe der Aufsicht (Entscheid VR1 a, LERN_Session12): Was das Kind auf der Stufenwahl oder
  // der Spielkarte umstellt, steht eigens im Profil (wahl) und gilt vor der Vorgabe, die die Aufsicht im Profil setzt —
  // ausser sie hat die Einstellung festgelegt (fest). Vorher schrieben beide dasselbe Feld, das Kind überschrieb still.
  const WAHL_ARTEN = { timer: "Timer", reihenfolge: "Reihenfolge der Teile", vorlesen: "Vorlesen" };
  /** Hat die Aufsicht diese Einstellung für das Kind festgelegt? */
  const istFest = (name, art) => !!profil(name).fest?.[art];
  /** Wahl des Kindes, soweit sie gilt (nicht festgelegt): bei timer und reihenfolge { <spiel>: Wert }, sonst der Wert. */
  const wahlFuer = (name, art) => (istFest(name, art) ? undefined : profil(name).wahl?.[art]);
  /** Das Kind wählt selbst (spiel = null bei Einstellungen für alle Spiele); false, wenn festgelegt. */
  function setzeWahl(name, art, spiel, wert) {
    if (istFest(name, art)) return false;
    const w = { ...(profil(name).wahl || {}) };
    w[art] = spiel == null ? wert : { ...(w[art] || {}), [spiel]: wert };
    speichereProfil(name, { wahl: w });
    return true;
  }
  /** Timer eines Spiels: Wahl des Kindes (Stufenwahl, Spielkarte); die Vorgabe je Spiel setzt die Aufsicht im Profil. */
  const waehleTimer = (name, spiel, an) => setzeWahl(name, "timer", spiel, an);
  const FEST_TEXT = "Das hat deine Aufsicht so eingestellt.";
  /** „Auf Vorgabe zurück“: die Wahl des Kindes für eine Einstellung löschen. */
  function wahlZuruecksetzen(name, art) {
    const w = { ...(profil(name).wahl || {}) };
    delete w[art];
    speichereProfil(name, { wahl: w });
  }
  /** Festlegen oder freigeben (Aufsicht, im Profil). */
  const setzeFest = (name, art, an) => speichereProfil(name, { fest: { ...(profil(name).fest || {}), [art]: !!an } });
  /** Wie viele eigene Wahlen das Kind für eine Einstellung getroffen hat (für die Anzeige im Profil). */
  function wahlAnzahl(name, art) {
    const w = profil(name).wahl?.[art];
    return w == null ? 0 : typeof w === "object" ? Object.keys(w).length : 1;
  }

  /** Reihenfolge-Werte für die Einstellung „Teile einer Aufgabe“. */
  const REIHENFOLGEN = {
    stufe: "nach Stufe (1–3 geordnet, 4–6 gemischt)",
    geordnet: "immer geordnet (gross links → klein rechts)",
    gemischt: "immer gemischt",
  };

  /**
   * Stehen die Teile einer Aufgabe (Bausteine, Rätselteile) geordnet von der grössten Stelle links
   * zur kleinsten rechts? „stufe“ heisst: 1–3 geordnet.
   */
  function geordnet(name, spiel, stufe) {
    const wert = reihenfolgeFuer(name, spiel);
    return wert === "stufe" ? ["s1", "s2", "s3"].includes(stufe) : wert === "geordnet";
  }

  /** Gültige Reihenfolge eines Spiels: Wahl des Kindes → Vorgabe je Spiel → globale Vorgabe (auch „stufe“). */
  function reihenfolgeFuer(name, spiel) {
    const r = profil(name).reihenfolge || LEERES_PROFIL.reihenfolge;
    return wahlFuer(name, "reihenfolge")?.[spiel] || r.spiele?.[spiel] || r.global || "stufe";
  }

  // Spieloptionen (Entscheid UE1 a, LERN_Session6): Ein Spiel beschreibt sie in def.optionen =
  // { <id>: { titel, werte: { stufe: "nach Stufe", …: Text }, erklaerung: { <wert>: Text }, nachStufe(stufe) → Wert } };
  // gespeichert wird je Spieler und Spiel im Profil (optionen: { <spiel>: { <id>: Wert } }), fehlt = "stufe".
  const optionFuer = (name, spiel, id) => profil(name).optionen?.[spiel]?.[id] || "stufe";
  function setzeOption(name, spiel, id, wert) {
    const o = { ...(profil(name).optionen || {}) };
    o[spiel] = { ...(o[spiel] || {}), [id]: wert };
    speichereProfil(name, { optionen: o });
  }
  /** Gültiger Wert einer Spieloption für eine Stufe: „stufe“ wird über nachStufe aufgelöst. */
  function optionWert(name, def, id, stufe) {
    const w = optionFuer(name, def.id, id);
    return w === "stufe" ? def.optionen[id].nachStufe(stufe) : w;
  }

  // ---------- Personen (Kern: KERN.person, Entscheide P1 a, P2 a; LERN_Session15) ----------
  // lernspiele:personen = Liste { id, name, rolle: "lernend" | "aufsicht", angelegt, geaendert: { feld: ISO }, … Profil }.
  // Die Aufrufe des Eulenpfads gehen weiter über den Namen (je Gerät eindeutig, ohne Gross/Klein); massgebend ist die
  // Kennung id. Runden, Rekorde, Meldungen und Löschvermerke tragen person (Kennung) und name (Kopie für die Anzeige,
  // nachgeführt beim Umbenennen und Zusammenführen). Geschrieben wird über schreibe, damit der Abgleich es merkt.
  const PERSONEN = KERN.person.liste({ lies, schreibe }, { schluessel: "personen" });
  const ROLLE = r => (r === "kind" ? "lernend" : r);
  /** Profil von vor LERN_Session15 ({ Name: Profil }) als Person; frühere Testspieler (test: true) sind Aufsicht. */
  function personAusProfil(name, p) {
    const { geaendert = {}, test, ...rest } = p || {};
    const { angelegt = "", ...zeiten } = geaendert;
    const rolle = rest.rolle === "aufsicht" || (test && !rest.rolle) ? "aufsicht" : "lernend";
    // ein Geburtsdatum, das der Kern nicht liest, fällt weg (sonst gälte die ganze Person als ungültig)
    const geboren = rest.geboren == null ? null : KERN.person.geburtsdatumLies(rest.geboren);
    return { ...rest, geboren, id: rest.id || KERN.person.neueId(), name: KERN.person.nameRein(name), rolle, angelegt, geaendert: zeiten };
  }
  /** Personen nach Namen, mit den Vorgaben des leeren Profils — die Sicht, die der Eulenpfad überall liest. */
  const profile = () => Object.fromEntries(PERSONEN.alle().map(p => [p.name, p]));
  const person = name => (name ? PERSONEN.findeName(name) : null);
  /** Gehört ein Eintrag (Runde, Rekord, Meldung) zu dieser Person? Über die Kennung, ältere Einträge über den Namen. */
  const gehoert = (e, p) => !!e && !!p && (e.person ? e.person === p.id || (p.frueher || []).includes(e.person) : e.name === p.name);
  /** Einträge ohne Kennung bekommen sie über den Namen; der Name wird auf den heutigen nachgeführt. */
  function kennungNachtragen(liste) {
    let anders = false;
    const neu = liste.map(e => {
      if (!e || typeof e !== "object") return e;
      const p = e.person ? PERSONEN.finde(e.person) : person(e.name);
      if (!p || (e.person === p.id && e.name === p.name)) return e;
      anders = true;
      return { ...e, person: p.id, name: p.name };
    });
    return anders ? neu : null;
  }
  // Umzug (einmal): lernspiele:profile in die Personenliste; danach Kennungen in Runden, Rekorden und Meldungen.
  // Nach dem Laden der grossen Schlüssel (Kern 1.34.0), ohne IndexedDB gleich beim Laden der Seite wie bisher.
  beiBereit(function umzugPersonen() {
    const alt = lies("profile", null);
    if (alt && typeof alt === "object") {
      const personen = PERSONEN.alle();
      const nachSchluessel = {}; // alter Schlüssel (genauer Name) → Person
      for (const [n, p] of Object.entries(alt)) {
        if (!p || typeof p !== "object") continue;
        const da = personen.find(x => x.name === KERN.person.nameRein(n));
        if (da) { nachSchluessel[n] = da; continue; }
        const neu = personAusProfil(n, p);
        if (!neu.name) continue;
        // früher erlaubt: „Mia“ und „mia“ als zwei Profile — das zweite bekommt eine Nummer, seine Runden bleiben seine
        let name = neu.name, i = 2;
        while (personen.some(x => KERN.person.nameGleich(x.name, name))) name = `${neu.name} (${i++})`;
        const q = { ...neu, name };
        personen.push(q); nachSchluessel[n] = q;
      }
      if (PERSONEN.speichere(personen)) {
        for (const k of ["protokoll", "rekorde", "meldungen"]) {
          const l = lies(k, []);
          if (!Array.isArray(l)) continue;
          const q = e => e && !e.person && nachSchluessel[e.name];
          if (l.some(q)) schreibe(k, l.map(e => (q(e) ? { ...e, person: q(e).id, name: q(e).name } : e)));
        }
        try { localStorage.removeItem("lernspiele:profile"); } catch { /* egal */ }
      }
    }
    // Runden und Rekorde ins gemeinsame Format (R1 a, LERN_Session15): spiel → inhalt, Kennung je Eintrag
    for (const k of ["protokoll", "rekorde"]) {
      const l = lies(k, []);
      if (Array.isArray(l) && l.some(e => e && (!e.id || "spiel" in e))) schreibe(k, l.map(e => KERN.runden.umdeuten(e, { spiel: "inhalt" })));
    }
    // Liste je Aufgabe (RA4 a, LERN_Session19): aufgabenZeiten und fehlerAufgaben → liste (KERN.runde.ausEulenpfad)
    {
      const l = lies("protokoll", []);
      if (Array.isArray(l) && l.some(e => e && ("aufgabenZeiten" in e || "fehlerAufgaben" in e))) schreibe("protokoll", l.map(KERN.runde.ausEulenpfad));
    }
    for (const k of ["protokoll", "rekorde", "meldungen"]) {
      const l = lies(k, []);
      const neu = Array.isArray(l) ? kennungNachtragen(l) : null;
      if (neu) schreibe(k, neu);
    }
  });
  // Schema der Felder, die nur der Eulenpfad in Runden und Rekorden führt (KERN.runden.maengel, Befund D14)
  const RUNDEN_PRUEFUNG = {
    pflicht: ["aufgaben", "fehler", "dauer"],
    // liste: je Aufgabe (KERN.runde, RA4 a); aufgabenZeiten und fehlerAufgaben bis LERN_Session18, beim Einlesen umgedeutet
    zusatz: { name: "text", sterne: "zahlOderNull", liste: "liste", optionen: "objekt", mix: "text", endlos: "bool",
      gekuerzt: "zahl", abgebrochen: "bool", gezeigt: "zahl" },
  };
  const REKORD_PRUEFUNG = { pflicht: ["dauer"], zusatz: { name: "text", spiele: "liste", alles: "bool", abgebrochen: "bool" } };
  const spielerListe = () => Object.keys(profile());
  function profil(name) { return { ...LEERES_PROFIL, ...(profile()[name] || {}) }; }
  const istAufsicht = name => !!name && profile()[name]?.rolle === "aufsicht";
  const kinderListe = () => spielerListe().filter(n => !istAufsicht(n));
  const aufsichtListe = () => spielerListe().filter(istAufsicht);
  /** Name mit 🔑 davor, wenn es eine Aufsicht ist — nur zur Anzeige. */
  const spielerName = name => (istAufsicht(name) ? `🔑 ${name}` : name);
  /**
   * Bild eines Spielers (AV3 a, LERN_Session12): sein Avatar (avatare.js, Profilfeld avatar), sonst ein Kreis mit dem
   * Anfangsbuchstaben. Als Element, das vor dem Namen steht.
   */
  function avatarBild(name, groesse = 32) {
    const kennung = profile()[name]?.avatar;
    const svg = typeof AVATARE !== "undefined" && kennung ? AVATARE.svg(kennung, groesse) : null;
    const box = el("span", { class: "avatar", "aria-hidden": "true" });
    box.style.setProperty("--g", `${groesse}px`);
    if (svg) box.innerHTML = svg;
    else box.append(el("span", { class: "avatar-ersatz", text: (name || "?").trim().charAt(0).toUpperCase() }));
    return box;
  }

  // Anmeldung (Entscheid L1 a): Kinder ohne PIN. Die Aufsicht gilt nur in diesem Browser-Tab
  // (sessionStorage) — schliesst man ihn, ist sie abgemeldet und kein Kind erbt ihre Rechte.
  // Gespeichert wird die Kennung (lernspiele:spieler, sessionStorage lernspiele:aufsicht); ältere Stände mit dem Namen gelten.
  // Rechnung im Kern (kern/anmeldung.js, docs/kern/rahmen.md 4.11): im Tab muss sein, wer Aufsicht ist oder eine PIN hat.
  const gespeichertePerson = wert => (wert ? PERSONEN.finde(wert) || PERSONEN.findeName(wert) : null);
  const ANMELDUNG = KERN.anmeldung.platz({ speicher: { praefix: SPEICHER.praefix, lies, schreibe }, gewaehlt: "spieler",
    tab: "aufsicht", finde: gespeichertePerson });
  const aktuellerSpieler = () => ANMELDUNG.aktiv()?.name ?? null;
  /** Ist gerade eine Aufsicht angemeldet? */
  const aufsichtAngemeldet = () => istAufsicht(aktuellerSpieler());
  /** Kind anmelden; eine Aufsicht nur über meldeAufsichtAn mit PIN. */
  const setzeSpieler = name => ANMELDUNG.waehle(person(name)?.id);
  const abmelden = () => ANMELDUNG.abmelden();

  // Prüfwerte über den Kern (kern/geheimnis.js): dieselbe Rechnung SHA-256(„salz:wert“) wie bisher, alte PINs gelten.
  const G = KERN.geheimnis;
  const pinGueltig = pin => G.pinGueltig(pin);
  /** PIN einer Aufsicht setzen (4–6 Ziffern); gespeichert wird nur Salz und Hash. */
  async function setzePin(name, pin) {
    if (!pinGueltig(pin)) return false;
    // Eine PIN, die eine Aufsicht dieses Geräts setzt, schaltet eine gesperrte Aufsicht auch frei (DF4 a: Bestätigung;
    // der Kern nimmt den Vermerk gesperrt weg, sobald eine eigene PIN gesetzt ist)
    speichereProfil(name, { rolle: "aufsicht", pin: await G.pin(pin) });
    return true;
  }
  /** Stimmt die PIN dieser Aufsicht? Meldet nicht an (Bestätigung einer neuen Aufsicht, KR2 a). */
  async function pinStimmt(name, pin) {
    const p = profil(name);
    return p.rolle === "aufsicht" && (await G.pinStimmt(pin, p.pin));
  }
  // ---------- PIN vergessen (Entscheide PIN1 a, PIN1-R a, LERN_Session13) ----------
  // Stufen: 1 eine zweite Aufsicht setzt die PIN in der Verwaltung · 2 Wiederherstellungscode (einmal angezeigt) ·
  // 3 Sicherheitsfrage (beim Anlegen selbst gewählt) · 4 Zurücksetzen mit Frist (3 Tage, auf der Anmeldung sichtbar,
  // abbrechbar mit PIN oder Code). Profil-Feld wiederherstellung: { code: { salz, hash }, frage, antwort: { salz, hash } }
  // — wie die PIN nur Prüfwerte, nie Code oder Antwort selbst. In Sicherung und Abgleich reist nur der Prüfwert des Codes,
  // und nur bei einer geschützten Person (KERN.person.fuerDatei, DF4 a); PIN, Frage und Antwort bleiben auf dem Gerät.
  const ZURUECKSETZEN_TAGE = 3;
  /** Ein neuer Wiederherstellungscode, 12 Zeichen in drei Gruppen („K7QM-2XRA-9TPL“, ohne 0/O und 1/I). */
  const neuerCode = () => G.neuerCode();
  /** Code und (falls angegeben) Sicherheitsfrage einer Aufsicht festlegen; ohne frage bleibt die bisherige. */
  async function setzeWiederherstellung(name, { code, frage, antwort } = {}) {
    const alt = profil(name).wiederherstellung || {};
    const neu = { ...alt };
    if (code) neu.code = await G.pruefwert(G.codeRein(code));
    if (frage && antwort) { neu.frage = frage.trim().slice(0, 120); neu.antwort = await G.pruefwert(G.antwortRein(antwort)); }
    speichereProfil(name, { wiederherstellung: neu });
  }
  const wiederherstellung = name => profil(name).wiederherstellung || {};
  const codeStimmt = (name, code) => G.codeStimmt(code, wiederherstellung(name));
  const antwortStimmt = (name, antwort) => G.antwortStimmt(antwort, wiederherstellung(name));
  // Frist zum Zurücksetzen (Stufe 4) im Kern (KERN.rollen.frist, RL2 a), je Gerät: lernspiele:zuruecksetzen = { angefordert, ab }
  const FRIST = KERN.rollen.frist({ speicher: { lies, schreibe, entferne: k => SPEICHER.entferne(k) }, tage: ZURUECKSETZEN_TAGE });
  const zuruecksetzenStand = () => FRIST.stand();
  const zuruecksetzenAnfordern = () => { FRIST.anfordern(); };
  const zuruecksetzenAbbrechen = () => FRIST.abbrechen();
  /** Bricht die Eingabe die Frist ab (PIN oder Code einer Aufsicht)? Dann ist sie abgebrochen; true. */
  async function zuruecksetzenAbbrechenMit(eingabe) {
    if (!(await KERN.rollen.abbrechbarMit(PERSONEN, eingabe))) return false;
    FRIST.abbrechen();
    return true;
  }
  /** Ist die Frist abgelaufen, verlieren alle Aufsichten dieses Geräts Rolle, PIN und Wiederherstellung; true dann. */
  function zuruecksetzenFaellig() {
    if (!FRIST.abgelaufen()) return false;
    KERN.rollen.zuruecksetzen(PERSONEN, { art: "lernend" });
    return true;
  }

  /** Aufsicht mit PIN anmelden; true bei Erfolg. Ohne gesetzte PIN geht es nicht. */
  async function meldeAufsichtAn(name, pin) {
    const p = person(name);
    return !!p && p.rolle === "aufsicht" && !!(await ANMELDUNG.anmelden(p.id, pin));
  }

  /**
   * Profilfelder ändern. Jedes geänderte Feld bekommt einen Zeitstempel (geaendert: { feld: ISO }), ein
   * neues Profil dazu „angelegt“: Beim Abgleich zwischen Geräten gewinnt je Feld der jüngere Stand.
   */
  function speichereProfil(name, daten) {
    const d = { ...daten };
    if ("rolle" in d) d.rolle = ROLLE(d.rolle);
    const p = person(name);
    if (p) PERSONEN.aendere(p.id, d);
    else PERSONEN.anlegen({ ...d, name, rolle: d.rolle || "lernend" });
  }

  /**
   * Person umbenennen (P1 a: die Kennung bleibt). Die Namenskopie in Runden, Rekorden und Meldungen wird nachgeführt.
   * Gibt den neuen Namen zurück; Fehler, wenn der Name fehlt oder vergeben ist.
   */
  function umbenennen(name, neuerName) {
    const p = person(name);
    if (!p) throw new Error("Unbekannte Person");
    const n = PERSONEN.aendere(p.id, { name: String(neuerName || "").trim().slice(0, 20) }).name;
    for (const k of ["protokoll", "rekorde", "meldungen"]) {
      const l = lies(k, []);
      if (Array.isArray(l) && l.some(e => gehoert(e, p))) schreibe(k, l.map(e => (gehoert(e, p) ? { ...e, person: p.id, name: n } : e)));
    }
    return n;
  }

  /** Neues Kind anlegen (ohne es anzumelden); gibt den Namen zurück oder null. */
  function neuerSpieler(name, daten = {}) {
    name = KERN.person.nameRein(name).slice(0, 20);
    if (!name || !PERSONEN.nameFrei(name)) return null;
    speichereProfil(name, daten);
    return name;
  }

  // ---------- Freigabe (Entscheid L4 a) ----------
  // Prüfstand im Repo, Freigabe auf dem Gerät. Standardmässig frei ist alles, was nichts mehr zu
  // prüfen hat (Präzisierung Patrik 2026-10-31): Ein Spiel mit `neu` im Katalog ist gesperrt, bis es
  // angesehen ist; eine Inhaltsliste (`listen: { <liste>: { name } }`) ist gesperrt, bis sie geprüft
  // ist. Der Prüfstand steht in pruefstand.js (PRUEFSTAND, je { am, von }; Entscheid E1 a), getrennt
  // vom Katalog, damit der Entwickler-Server ihn schreiben kann. Die Aufsicht kann auf dem Gerät
  // anders entscheiden: lernspiele:freigabe = { spiele: { <id>: bool }, listen: { "<id>/<liste>": bool } };
  // fehlt ein Eintrag, entscheidet der Prüfstand.
  // Logik im Kern (kern/freigabe.js, docs/kern/rahmen.md 4.8); hier nur, wo Katalog und Prüfstand stehen.
  function katalogEintrag(spielId) { return typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spielId) : null; }
  const FREIGABE = KERN.freigabe({
    art: "spiele", eintrag: katalogEintrag, speicher: { lies, schreibe }, aufsicht: () => aufsichtAngemeldet(),
    pruefstand: () => (typeof PRUEFSTAND !== "undefined" ? PRUEFSTAND : {}),
  });
  /** Freigabe dieses Geräts: { spiele: { <id>: bool }, listen: { "<id>/<liste>": bool } }. */
  const freigabe = () => FREIGABE.geraet();
  const listenQuelle = FREIGABE.listenQuelle;
  /** Prüfstand aus pruefstand.js: { am, von } oder null; art "spiele" oder "listen". */
  const pruefstand = FREIGABE.pruefstand;
  /** Inhaltslisten eines Spiels aus dem Katalog: [{ id, quelle, name, geprueft, von, zusatz }]. */
  const spielListen = FREIGABE.listen;
  const listeFrei = FREIGABE.listeFrei;
  const setzeListeFrei = FREIGABE.setzeListeFrei;
  /** Listen, die der angemeldete Spieler üben darf (die Aufsicht alle) — Spiele filtern ihre Inhalte danach. */
  const freieListen = FREIGABE.freieListen;
  // ---------- Prüfung je Eintrag (Entscheide LP1 a–LP5 a, LERN_Session11; rahmen.md 17) ----------
  /** Kurzer Fingerabdruck eines Werts (cyrb53 über JSON, KERN.runden.fingerabdruck — dieselbe Rechnung wie bisher hier). */
  function fingerabdruck(wert) { return KERN.runden.fingerabdruck(wert); }
  const PRUEFUNGEN = {};
  /** Ein Spiel meldet in spiele/<id>/pruefung.js, wie seine Listen geprüft werden (listenpruefung.js). */
  const listenPruefung = (spielId, defs) => { PRUEFUNGEN[spielId] = { ...(PRUEFUNGEN[spielId] || {}), ...defs }; };
  const pruefungDefinition = spielId => PRUEFUNGEN[spielId] || null;
  /** Haken einer Aufsicht oder Lehrperson auf diesem Gerät: { "<schlüssel>": { am, von } } je Liste. */
  const pruefungLokal = quelle => ({ ...(lies("pruefungLokal", {})[quelle] || {}) });
  const setzePruefungLokal = (quelle, haken) => schreibe("pruefungLokal", { ...lies("pruefungLokal", {}), [quelle]: haken });
  const ladeSkript = src => new Promise((ok, fehler) => {
    if ([...document.scripts].some(s => s.getAttribute("src") === src)) return ok();
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = fehler;
    document.head.append(s);
  });
  /**
   * Prüfansicht einer Liste öffnen (nur auf der Seite des Spiels, das sie besitzt). Lädt listenpruefung.js und
   * pruefung.js des Spiels nach; false, wenn das Spiel noch keine Prüfansicht hat.
   */
  async function listenPruefen(spielId, listeId) {
    try {
      await ladeSkript("../gemeinsam/listenpruefung.js");
      await ladeSkript("pruefung.js");
    } catch { return false; }
    if (!pruefungDefinition(spielId)?.[listeId]) return false;
    await LISTENPRUEFUNG.oeffne(spielId, listeId);
    return true;
  }
  /** Muss das Spiel als Ganzes noch angesehen werden (neu und nicht geprüft)? */
  const spielZuPruefen = FREIGABE.zuPruefen;
  /** Wann und von wem das Spiel angesehen wurde ({ am, von }) oder null. */
  const spielGeprueft = FREIGABE.geprueft;
  /** Spiel als Ganzes für Kinder frei (ohne Blick auf die Listen)? */
  const spielFrei = FREIGABE.frei;
  const setzeSpielFrei = FREIGABE.setzeFrei;
  /** Darf ein Kind das Spiel sehen? Frei und mindestens eine eigenständige Liste frei (Zusatzlisten zählen nicht). */
  const fuerKinderSichtbar = FREIGABE.fuerLernendeSichtbar;
  const spielSichtbar = FREIGABE.sichtbar;
  // ---------- Suche (Entscheid SU1 a, LERN_Session6) ----------
  // Kleine Volltextsuche mit Rangfolge: je Suchwort der beste Treffer über alle Felder, gewichtet nach Feld
  // und Art des Treffers; jedes Suchwort muss passen. Passt ein Spiel nur über ein Feld, das auf der Karte
  // nicht steht (Thema, Inhaltsliste), nennt `grund` es.
  // Rechnung im Kern (kern/suche.js, docs/kern/rahmen.md 4.9); hier, was der Eulenpfad durchsucht und wie er gewichtet.
  const SUCH_GEWICHT = { name: 6, lernziele: 4, beschreibung: 3, listen: 2, thema: 1 };
  const SUCH_SICHTBAR = ["name", "lernziele", "beschreibung"];
  /** Durchsuchbare Felder eines Spiels: je Feld eine Liste von Texten (Listen und Lernziele einzeln). */
  function suchFelder(e) {
    const thema = typeof THEMEN !== "undefined" ? THEMEN.find(t => t.id === e.thema) : null;
    return { name: [e.name], lernziele: e.lernziele.map(l => l.lz), beschreibung: [e.beschreibung],
      listen: spielListen(e.id).map(l => l.name), thema: thema ? [`${thema.name}: ${thema.titel}`] : [] };
  }
  /**
   * Persönliche Passung eines Spiels, 0 bis 1 (Wunsch Patrik, LERN_Session10: Suche und Ähnliche Spiele sollen
   * Profil und Statistik mitnehmen). person = { klasse, bedarf(spielId) } — klasse des Kindes (null = unbekannt),
   * bedarf wie AUSWERTUNG.bedarf (0.5 sicher … 5 wackelnd, Fokus doppelt); null ohne person (Aufsicht, Testskript).
   * Hälfte Nähe der Basisklasse (gleich 1, eine daneben 0.6, zwei 0.2, sonst 0), Hälfte Bedarf (auf 5 gedeckelt).
   */
  const PASSUNG_FAKTOR = 0.5; // höchstens das Anderthalbfache der Textrelevanz — der Text bleibt massgebend
  function passung(spielId, person) {
    if (!person) return null;
    const bedarf = person.bedarf ? Math.min(Math.max(person.bedarf(spielId), 0) / 5, 1) : 0.5;
    return (KERN.suche.naehe(person.klasse, basisKlasse(spielId)) + bedarf) / 2;
  }

  /**
   * Spiele zur Suche, beste zuerst: [{ id, wert, grund, passung }]; grund z. B. „im Thema Wortschatz: …“ oder null,
   * wenn alle Suchwörter auf der Karte stehen. Leere Suche: null. Mit person (siehe passung) zählt die Passung
   * als Faktor auf die Textrelevanz; bei gleich gutem Text kommt zuerst, was zur Klasse passt und Bedarf hat.
   */
  function suche(text, person = null) {
    if (typeof SPIELE === "undefined") return null;
    return KERN.suche.suche(text, SPIELE, {
      felder: suchFelder, gewicht: SUCH_GEWICHT, sichtbar: SUCH_SICHTBAR, tippfehler: ["name"], faktor: PASSUNG_FAKTOR,
      grund: (feld, t) => (feld === "thema" ? `im Thema ${t}` : `in der Liste „${t}“`),
      passung: e => passung(e.id, person),
    });
  }

  /**
   * Ähnliche Spiele zu einem Spiel, ähnlichste zuerst: [{ id, wert, grund, passung }] (Wunsch Patrik, LERN_Session10).
   * Gleiches Lernziel 4 je Code, gleiches Thema 3, gleiches Fach 1; je Basisklasse Abstand 0.5 Abzug (höchstens 1);
   * dazu die Passung wie bei der Suche. grund nennt, was gleich ist.
   */
  function aehnlich(spielId, person = null) {
    if (!katalogEintrag(spielId) || typeof SPIELE === "undefined") return [];
    const fachVon = x => (typeof THEMEN !== "undefined" ? THEMEN.find(t => t.id === x.thema)?.fach : null);
    return KERN.suche.aehnlich(spielId, SPIELE, {
      faktor: PASSUNG_FAKTOR, passung: x => passung(x.id, person),
      vergleich: (e, x) => {
        const lz = x.lernziele.filter(l => e.lernziele.some(m => m.lz === l.lz)).map(l => l.lz);
        const thema = x.thema === e.thema;
        if (!lz.length && !thema) return null; // nur das Fach gemeinsam: zu wenig für „ähnlich“
        const wert = 4 * lz.length + (thema ? 3 : 0) + (fachVon(x) === fachVon(e) ? 1 : 0)
          - Math.min(2, Math.abs((x.klasse || 0) - (e.klasse || 0))) * 0.5;
        return { wert, grund: [lz.length ? `gleiches Lernziel ${[...new Set(lz)].join(", ")}` : null, thema ? "gleiches Thema" : null].filter(Boolean).join("; ") };
      },
    });
  }
  /** Warum sehen Kinder das Spiel nicht? Kurzer Text oder null, wenn sie es sehen. */
  const sperrGrund = spielId => FREIGABE.sperrGrund(spielId);

  // ---------- Sichern, Einlesen, Abgleich, Löschen (Kern kern/daten.js, Entscheide DF1 a, DF2 a, DF4 a, LERN_Session18) ----------
  // Ein Dateiformat für alle Apps (reihe-daten); ältere Dateien (eulenpfad-daten 1–3, ohne format) deutet der Kern um.
  // Löschvermerke in lernspiele:geloescht = { personen: { <id>: ISO }, namen: { <name>: ISO }, runden: [{ person, name,
  // inhalt (null = alle), bis }] } — der Kern liest auch die Form bis LERN_Session18 (spieler, spiel). Ein Vermerk entfernt
  // auf jedem Gerät, was bis zu seinem Zeitpunkt entstand; wer danach angelegt, geändert oder gespielt hat, bleibt.
  // Meldungen reisen als Teil des Eulenpfads mit; je Kennung gewinnt der bessere Stand, die Verläufe werden vereinigt
  // (KERN.meldungen.zusammenfuehren, C11-1 a; bis LERN_Session25 gewann der jüngere). Die Schreibvorgänge gehen über
  // schreibe(), damit der Abgleich (beiAenderung) sie sieht.
  const MELDUNGEN_TEIL = {
    schluessel: "meldungen",
    sichern: (ids, eigene) => (Array.isArray(eigene) ? eigene : []).filter(m => m && (!ids || ids.includes(m.person))),
    zusammenfuehren: (eigene, fremde, ctx) => KERN.meldungen.zusammenfuehren(eigene, fremde, ctx),
    // ein gelöschtes Kind nimmt seine Meldungen mit (sie tragen den Namen); Anregungen der Aufsicht bleiben
    entferne: (eigene, ids) => (Array.isArray(eigene) ? eigene : []).filter(m => !m || istAnregung(m) || !ids.includes(m.person)),
  };
  const DATEN = KERN.daten({
    app: "eulenpfad", speicher: { praefix: SPEICHER.praefix, lies, schreibe, entferne: k => SPEICHER.entferne(k) },
    schluessel: { runden: "protokoll" }, dateiPraefix: "lernspiele",
    pruefung: { runde: RUNDEN_PRUEFUNG, rekord: REKORD_PRUEFUNG }, freigabe: true,
    teile: { meldungen: MELDUNGEN_TEIL, ruhezeiten: RUHE_TEIL }, altePerson: personAusProfil,
    // Runden älterer Fassungen (aufgabenZeiten, fehlerAufgaben bis LERN_Session18) vor der Prüfung umdeuten (RA4 a)
    umdeuten: ({ runden, rekorde }) => ({ runden: runden.map(KERN.runde.ausEulenpfad), rekorde }),
  });

  function loescheSpieler(name) {
    const p = person(name);
    if (!p) return;
    DATEN.loeschePerson(p.id);
    const s = lies("spieler", null);
    if (s === p.id || s === p.name) schreibe("spieler", null);
  }

  /** Spielstand zurücksetzen: die Runden eines Kindes löschen — alle oder nur die eines Spiels.
      Profil, Klasse, Fokus und Timer bleiben. */
  function loescheRunden(name, spielId = null) {
    const p = person(name);
    if (p) DATEN.loescheRunden(p.id, spielId);
  }

  /**
   * Sicherung oder Abgleich-Datei eines anderen Geräts dazunehmen (Text oder Objekt; KERN.daten.einlesen, docs/kern/
   * rahmen.md 4.19): Personen nach Kennung, sonst Name (P1 a), je Feld der jüngere Stand; Runden und Rekorde nach Kennung
   * (Rekord: höherer Stand); Löschvermerke beider Seiten; die Freigabe des Geräts mit dem jüngsten Stand; Meldungen.
   * Geschützte Personen (Aufsichten) kommen ohne PIN und hier gesperrt an, bis sie freigeschaltet sind (DF4 a).
   * Erst wird alles geprüft, dann alles oder nichts geschrieben; Fehler mit Klartext.
   * Gibt zurück, wie viel neu kam: { runden, kinder, rekorde, profile, freigabe, meldungen, abgewiesen }.
   */
  function zusammenfuehren(daten) {
    const r = DATEN.einlesen(daten);
    // Namenskopie in Runden, Rekorden und Meldungen auf den heutigen Namen (verbunden über den Namen, umbenannt)
    for (const k of ["protokoll", "rekorde"]) {
      const l = lies(k, []);
      const neu = Array.isArray(l) ? kennungNachtragen(l) : null;
      if (neu) schreibe(k, neu);
    }
    return { runden: r.runden, kinder: r.personen.neu, rekorde: r.rekorde, profile: r.personen.geaendert, freigabe: r.freigabe,
      meldungen: r.teile.meldungen || 0, abgewiesen: r.abgewiesen, datei: r.datei };
  }

  /**
   * Alles, was ein Gerät für den Abgleich weitergibt (art „abgleich“): Personen ohne PIN (geschützte mit Vermerk und dem
   * Prüfwert ihres Wiederherstellungscodes), Runden, Rekorde, Löschvermerke, Freigabe, Meldungen. geraet: { id, name }.
   * Ein Gerät mit älterem Stand liest die Datei erst nach dem Neuladen der Seite (DF1 a).
   */
  const abgleichDaten = (geraet = null) => DATEN.sichern({ art: "abgleich", geraet });
  /** Sicherung der genannten Personen (Namen) mit ihren Runden, Rekorden und Meldungen; filter für Runden und Rekorde. */
  function sicherung(namen, filter = null) {
    const ids = namen.map(person).filter(Boolean).map(p => p.id);
    return { daten: DATEN.sichern({ ids, filter }), dateiname: DATEN.dateiname(namen.join("-")) };
  }
  /** Auf einem anderen Gerät mit PIN geschützt und hier noch ohne eigene PIN (DF4 a)? */
  const gesperrt = name => KERN.person.gesperrt(person(name));
  // Auf diesem Gerät ausblenden (KE1 a, LERN_Session20; KERN.person.ausgeblendet): eine gesperrte Aufsicht ist auf ihrem
  // eigenen Gerät echt — ein Löschvermerk nähme sie dort im Abgleich mit. Ausgeblendet steht sie nicht auf der Anmeldung
  // und nicht im Personen-Knopf, bleibt aber in den Daten (lernspiele:ausgeblendet, nur dieses Gerät).
  const AUSGEBLENDET = KERN.person.ausgeblendet(PERSONEN, { lies, schreibe });
  /** Zeigt dieses Gerät die Person (Anmeldung, Personen-Knopf)? */
  const angezeigt = name => !AUSGEBLENDET.ist(person(name));
  const istAusgeblendet = name => AUSGEBLENDET.ist(person(name));
  /** Ausblenden lässt sich nur eine gesperrte Aufsicht (KE1 a). */
  const darfAusblenden = name => istAufsicht(name) && gesperrt(name);
  function ausblenden(name) {
    if (!darfAusblenden(name)) return false;
    return AUSGEBLENDET.ausblenden(person(name).id);
  }
  const zeigen = name => { const p = person(name); if (p) AUSGEBLENDET.zeigen(p.id); };
  /**
   * Gesperrte Person freischalten und ihr eine PIN geben: mit ihrem Wiederherstellungscode ({ code }) oder mit der PIN
   * einer anderen Aufsicht dieses Geräts ({ von, vonPin }). Fehler mit Klartext.
   */
  async function freischalten(name, pin, { code = null, von = null, vonPin = null } = {}) {
    const p = person(name);
    if (!p) throw new Error("Unbekannte Person");
    if (von) {
      // Bestätigung durch eine andere Aufsicht dieses Geräts (Kern, KR2 a)
      try { await KERN.rollen.bestaetige(PERSONEN, { id: person(von)?.id, pin: vonPin }, { ausser: p.id }); }
      catch { throw new Error("Diese PIN stimmt nicht."); }
      return KERN.person.freischalten(PERSONEN, p.id, pin, { bestaetigt: true });
    }
    return KERN.person.freischalten(PERSONEN, p.id, pin, { code });
  }

  // ---------- Fehler melden durch Kinder (Wunsch Patrik, LERN_Session9) ----------
  // lernspiele:meldungen = [{ id, name, zeit, stand, status, verlauf: [{ zeit, status, von, notiz }], spiel, stufe,
  //   klasse, aufgabeNr, aufgabe, loesung, eingabe, ergebnis, art, text, antwort?, gelesen }].
  // Die Meldung bleibt beim Kind und reist mit dem Abgleich zur Aufsicht. An die Entwicklung gibt nur die
  // Aufsicht weiter, ohne den Namen. Die Antwort kommt zurück über die Aufsicht: Stand abfragen beim
  // Entwickler-Server oder in der veröffentlichten Datei meldungen-stand.json (je Kennung Status und Antwort).
  const MELDUNG_ARTEN = {
    wertung: "Meine Antwort war richtig, wurde aber falsch gewertet",
    inhalt: "Im Text, im Bild oder in der Lösung ist ein Fehler",
    unloesbar: "Die Aufgabe lässt sich nicht lösen",
    anderes: "Etwas anderes",
  };
  // text: für die Aufsicht; kind: was das Kind liest
  const MELDUNG_STATUS = {
    neu: { text: "neu — noch nicht angesehen", kind: "Gemeldet. Deine Aufsicht schaut es sich an." },
    bestaetigt: { text: "von der Aufsicht bestätigt", kind: "Deine Aufsicht findet auch: Da stimmt etwas nicht." },
    weitergeleitet: { text: "an die Entwicklung weitergegeben", kind: "Deine Meldung ist bei der Entwicklung." },
    geplant: { text: "Entwicklung: wird behoben", kind: "Gut gefunden! Der Fehler wird behoben." },
    behoben: { text: "Entwicklung: behoben", kind: "Danke! Der Fehler ist behoben — du hast einen echten Fehler gefunden. 🏅" },
    "kein-fehler": { text: "kein Fehler", kind: "Das ist kein Fehler. Lies die Erklärung." },
  };
  // Anregungen der Aufsicht an die Entwicklung (Wunsch Patrik, LERN_Session11): derselbe Speicher und derselbe Weg
  // (E-Mail oder Entwickler-Server, Antwort über meldungen-stand.json), aber typ: "anregung", nur von der Aufsicht,
  // ohne Spiel-Pflicht und ohne Daten über ein Kind. Kinder sehen sie nie; sie zählen nicht als Fehlerfinder.
  const ANREGUNG_ARTEN = {
    neu: "Idee für ein neues Spiel oder Thema",
    verbessern: "Ein Spiel verbessern",
    inhalt: "Inhalte: Wörter, Aufgaben, Lehrmittel",
    bedienung: "Bedienung, Startseite, Statistik",
    anderes: "Etwas anderes",
    korrektur: "Korrektur an einer Inhaltsliste",
  };
  const ANREGUNG_STATUS = {
    neu: "noch nicht gesendet",
    weitergeleitet: "an die Entwicklung geschickt",
    geplant: "Entwicklung: geplant",
    behoben: "Entwicklung: umgesetzt",
    "kein-fehler": "Entwicklung: nicht geplant (siehe Antwort)",
  };
  // Logik im Kern (KERN.meldungen, C11-1 a, Kern 1.32.0); hier nur, was der Eulenpfad anders macht. Die Namen unter LS
  // bleiben, damit Startseite, Verwaltung und Statistik unverändert weiterlaufen.
  /** Version des Eulenpfads aus eulenpfad/version.js (NS3 a; jede Seite lädt sie vor dem Kern). */
  const appVersion = () => (typeof APP_VERSION !== "undefined" ? APP_VERSION.version : "");
  const MELD = KERN.meldungen({
    app: "eulenpfad", titel: "Eulenpfad", speicher: { lies, schreibe }, person: name => person(name), version: appVersion,
    inhalt: { feld: "spiel", wort: "Spiel", name: id => (typeof SPIELE !== "undefined" && SPIELE.find(s => s.id === id)?.name) || null },
    stufe: { text: s => String(s).slice(1), aus: t => (/^\d$/.test(t) ? `s${t}` : null) },
    wer: m => `Kind${m.klasse != null ? `, ${klasseText(m.klasse)}` : ""}`,
    woerter: { eingaben: "Eingaben des Kindes", notiz: "Notiz der Aufsicht" },
    arten: MELDUNG_ARTEN, anregungArten: ANREGUNG_ARTEN, status: MELDUNG_STATUS,
    // Weg zur Entwicklung ohne Entwickler-Server (Entscheid M1 a): E-Mail aus dem Mailprogramm der Aufsicht. Die Adresse
    // steht in eulenpfad/kontakt.js (nur die Startseite lädt sie); leer: kein E-Mail-Knopf, nur Text kopieren.
    kontakt: () => (typeof EULENPFAD_KONTAKT !== "undefined" ? EULENPFAD_KONTAKT : {}),
    entwicklung: () => LS.entwicklung || null,
  });
  const istAnregung = MELD.istAnregung;
  const meldungen = MELD.alle;
  const meldungenVon = MELD.von;
  const anregungen = MELD.anregungen;
  /** Neue Anregung der Aufsicht: { name, art, text, spiel? }; Status „neu“, bis sie gesendet ist. */
  const neueAnregung = MELD.neueAnregung;
  // Korrekturen an Inhaltslisten (LP4 a, LERN_Session11): eine Anregung der Art „korrektur“ mit Liste, Eintrag und dessen
  // Schlüssel (Fingerabdruck); gesendet wie jede Anregung, angezeigt in der Prüfansicht der Liste.
  const neueKorrektur = MELD.neueKorrektur;
  const korrekturen = MELD.korrekturen;
  const entferneMeldung = MELD.entferne;
  /** Echte Fehler, die ein Kind gefunden hat: von der Entwicklung bestätigt und behoben (für die Statistik). */
  const gefundeneFehler = MELD.gefunden;
  const ungeleseneMeldungen = MELD.ungelesen;

  /** Darf diese Person melden? Aufsicht immer; Kinder nach der Einstellung und der Klasse im Profil. */
  function meldenErlaubt(name) {
    if (!name) return false;
    if (istAufsicht(name)) return true;
    const e = einstellung("melden", null);
    if (e === "aus") return false;
    if (e === "alle") return true;
    const k = klasseVon(profil(name));
    return k != null && k >= (e === "ab5" ? 5 : 3);
  }

  const neueMeldung = MELD.neu;
  /** Meldung ändern; ein neuer Status kommt in den Verlauf, neuer Status oder neue Antwort = ungelesen. */
  const setzeMeldung = MELD.setze;
  const meldungenGelesen = MELD.gelesen;
  const meldungAdresse = MELD.adresse;
  const meldungMailLink = MELD.mailLink;
  const meldungAusText = MELD.ausText;
  /** Text für die Entwicklung: ohne den Namen des Kindes, mit Klasse und Kennung. */
  const meldungFuerEntwicklung = MELD.alsText;
  const meldungStandAnwenden = MELD.standAnwenden;
  const meldungStatusAusBemerkung = MELD.statusAusBemerkung;
  /** An die Entwicklung (Server, E-Mail oder Text, ohne Namen): ui { von, bestaetigen, oeffne, kopiere } → Weg oder null. */
  const meldungWeitergeben = MELD.weitergeben;
  /** Antworten der Entwicklung holen (meldungen-stand.json und Bemerkungen); gibt die Zahl der übernommenen zurück. */
  const meldungenAbfragen = MELD.abfragen;
  /** Weg der Meldungen und Adresse des Entwickler-Servers auf diesem Gerät (C11-3 a; Verwaltung → Einstellungen). */
  const meldeweg = MELD.meldeweg;
  const setzeMeldeweg = MELD.setzeMeldeweg;

  // Pause der laufenden Aufgabe für Hilfe und Melden (setzt die Runde je Aufgabe) und Zähler für ❓.
  let aktuellePause = null;
  let hilfeGezaehlt = null;

  /**
   * „❓ So geht das Spiel“ (Entscheid T3 a, LERN_Session9): oben der eigene Text des Spiels (def.hilfe: Text
   * oder Funktion der Stufe), darunter, was gerade auf der Seite zu bedienen ist. Die Aufgabe ist während
   * dessen verdeckt und die Uhr angehalten. Geöffnet zu haben, wird nur notiert.
   */
  /**
   * Eigene Regelseite eines Spiels (Wunsch Patrik, LERN_Session11): Spiele mit Regeln, die man vorher kennen muss
   * (Schach, Go), tragen im Katalog regeln: true und haben neben index.html eine Seite regeln.html. Startblatt und
   * Hilfe verweisen darauf; im laufenden Spiel öffnet sie sich in einem neuen Tab, damit die Runde nicht verloren geht.
   */
  function hatRegeln(id) {
    return typeof SPIELE !== "undefined" && !!SPIELE.find(s => s.id === id)?.regeln;
  }
  const regelnLink = (neuerTab, klasse = "knopf hell klein") => el("a", { class: `${klasse} regeln-link`, href: "regeln.html",
    text: "📖 Regeln", ...(neuerTab ? { target: "_blank", rel: "noopener" } : {}) });

  function hilfeFenster(def) {
    document.querySelector(".melde-hintergrund")?.remove();
    const b = document.querySelector(".buehne") || document;
    const da = sel => !!b.querySelector(sel);
    const sichtbar = sel => [...b.querySelectorAll(sel)].some(e => !e.closest("[hidden]"));
    const stufe = spielStand?.stufe;
    const eigen = typeof def.hilfe === "function" ? def.hilfe(stufe) : def.hilfe;
    const punkte = [
      da(".stufen") && "⭐ Wähle eine Stufe: Stufe 1 ist am leichtesten, Stufe 6 ist der Endgegner.",
      da(".tastatur") && "🔢 Tippe die Zahl mit den Tasten. ⌫ löscht die letzte Ziffer, OK prüft.",
      da(".wahl") && "👆 Tippe auf die Antwort, die passt.",
      da(".korb-reihe") && "🧺 Tippe auf den Korb, in den die Karte gehört.",
      da(".ablage") && "🔀 Tippe die Teile in der richtigen Reihenfolge an.",
      da(".los-knopf") && "▶ Tippe „Los!“, wenn du bereit bist. Dann zählt es 3, 2, 1, und das Bild ist nur kurz zu sehen.",
      da(".hoer-knopf, .hoer-zeile") && "🔊 Mit dem Lautsprecher-Knopf hörst du es nochmal.",
      sichtbar(".tipp-zeile") && "💡 „Tipp“ hilft dir weiter, ohne die Lösung zu verraten.",
      da(".zeitleiste") && "⏱ Der Balken zeigt die Zeit. Ist sie um, zählt das als Fehler — du darfst die Aufgabe trotzdem fertig machen.",
      da(".fortschritt") && "😊 Falsch ist nicht schlimm: Die Eule gibt dir einen Hinweis, und du versuchst es nochmal. Nach drei Versuchen zeigt sie dir die Lösung.",
      da(".eule-zeile .vorlesen") && "🗣️ liest dir die Aufgabe vor.",
      da(".melden") && "🙋 „Melden“: Stimmt im Spiel etwas nicht? Dann sag es deiner Aufsicht.",
    ].filter(Boolean);
    aktuellePause?.an();
    hilfeGezaehlt?.();
    const hintergrund = el("div", { class: "melde-hintergrund" });
    const schliessen = () => { hintergrund.remove(); removeEventListener("keydown", taste); aktuellePause?.aus(); };
    const taste = e => { if (e.key === "Escape") schliessen(); };
    hintergrund.append(el("div", { class: "karte melde-fenster", role: "dialog", "aria-modal": "true", "aria-label": "So geht das Spiel" },
      el("h2", { text: "❓ So geht das Spiel" }),
      eigen ? el("p", { class: "hilfe-eigen", text: eigen }) : null,
      el("ul", { class: "hilfe-liste" }, ...punkte.map(p => el("li", { text: p }))),
      el("div", { class: "knopfzeile" }, hatRegeln(def.id) ? regelnLink(!da(".stufen"), "knopf hell") : null,
        el("button", { type: "button", class: "knopf gruen", text: "Weiter spielen", onclick: schliessen }))));
    hintergrund.addEventListener("click", e => { if (e.target === hintergrund) schliessen(); });
    addEventListener("keydown", taste);
    document.body.append(hintergrund);
  }

  // Eingaben für Fehlermeldungen: Die laufende Runde setzt den Hörer (runde()); einer für die ganze Seite.
  let eingabeHoerer = null;
  if (typeof document !== "undefined") document.addEventListener("click", ev => eingabeHoerer?.(ev), true);

  /**
   * Formular „Fehler melden“ über der Seite (kein dialog-Element, damit es überall läuft).
   * kontext: { name, spiel, stufe, jetzt, vorige } — jetzt/vorige: { nr, text, loesung, eingabe, ergebnis } oder null.
   */
  function meldeFormular(kontext) {
    document.querySelector(".melde-hintergrund")?.remove();
    const aufgaben = [["jetzt", "Diese Aufgabe", kontext.jetzt], ["vorige", "Die Aufgabe davor", kontext.vorige]].filter(([, , a]) => a);
    if (!aufgaben.length) return;
    let welche = aufgaben[0][0];
    let art = null;
    const hintergrund = el("div", { class: "melde-hintergrund" });
    // Während des Meldens hält die Uhr an und die Aufgabe ist verdeckt (wie bei ❓ Hilfe).
    aktuellePause?.an();
    const schliessen = () => { hintergrund.remove(); removeEventListener("keydown", taste); aktuellePause?.aus(); };
    const taste = e => { if (e.key === "Escape") schliessen(); };
    const wahl = (liste, aktiv, setze) => {
      const zeile = el("div", { class: "melde-wahl" });
      for (const [wert, text, zusatz] of liste) {
        const k = el("button", { type: "button", "aria-pressed": String(wert === aktiv()), onclick: () => {
          setze(wert);
          [...zeile.children].forEach(c => c.setAttribute("aria-pressed", String(c === k)));
        } }, el("b", { text }), zusatz ? el("span", { class: "melde-zusatz", text: zusatz }) : null);
        zeile.append(k);
      }
      return zeile;
    };
    const kurz = a => (a.text || "(ohne Text)").slice(0, 80) + ((a.text || "").length > 80 ? " …" : "");
    const begruendung = el("textarea", { rows: "4", "aria-label": "Begründung",
      placeholder: "Schreib genau, was nicht stimmt und warum. Zum Beispiel: Ich habe 42 eingetippt, und 6 · 7 ist 42." });
    const meldung = el("p", { class: "melde-meldung" });
    const fenster = el("div", { class: "karte melde-fenster", role: "dialog", "aria-modal": "true", "aria-label": "Fehler melden" },
      el("h2", { text: "🙋 Stimmt etwas nicht?" }),
      el("p", { class: "leise", text: "Hast du einen Fehler im Spiel gefunden? Super, dass du so genau hinschaust! Deine Aufsicht schaut die Meldung an." }),
      el("h3", { text: "Welche Aufgabe?" }),
      wahl(aufgaben.map(([w, t, a]) => [w, t, kurz(a)]), () => welche, w => { welche = w; }),
      el("h3", { text: "Was stimmt nicht?" }),
      wahl(Object.entries(MELDUNG_ARTEN), () => art, a => { art = a; }),
      el("h3", { text: "Warum?" }),
      begruendung,
      el("p", { class: "leise", text: "Bitte keine Namen schreiben." }),
      meldung,
      el("div", { class: "knopfzeile" },
        el("button", { type: "button", class: "knopf gruen", text: "Senden", onclick: () => {
          if (!art) return (meldung.textContent = "Wähle zuerst, was nicht stimmt.");
          if (begruendung.value.trim().length < 8) return (meldung.textContent = "Schreib bitte genauer, was nicht stimmt.");
          const a = aufgaben.find(([w]) => w === welche)[2];
          neueMeldung({ name: kontext.name, spiel: kontext.spiel, stufe: kontext.stufe, klasse: klasseVon(profil(kontext.name)),
            aufgabeNr: a.nr + 1, aufgabe: a.text, loesung: a.loesung, eingabe: a.eingabe, ergebnis: a.ergebnis, art, text: begruendung.value.trim().slice(0, 1000) });
          ton("richtig");
          fenster.replaceChildren(el("h2", { text: "🙋 Danke!" }), el("p", { text: "Deine Meldung ist gespeichert. Deine Aufsicht schaut sie an — in der Statistik siehst du später, was daraus wurde." }));
          setTimeout(schliessen, 2200);
        } }),
        el("button", { type: "button", class: "knopf hell", text: "Abbrechen", onclick: schliessen })));
    hintergrund.append(fenster);
    hintergrund.addEventListener("click", e => { if (e.target === hintergrund) schliessen(); });
    addEventListener("keydown", taste);
    document.body.append(hintergrund);
    setTimeout(() => begruendung.focus?.(), 0);
  }

  /** Basisklasse eines Spiels aus dem Katalog (null, wenn die Seite den Katalog nicht geladen hat). */
  function basisKlasse(spielId) {
    const eintrag = typeof SPIELE !== "undefined" ? SPIELE.find(s => s.id === spielId) : null;
    return eintrag?.klasse ?? null;
  }

  // Klassen im Profil: 0 = Kindergarten (Wunsch Patrik, LERN_Session8), dann 1. bis 6. Klasse.
  const KLASSEN = [0, 1, 2, 3, 4, 5, 6];
  /** Klasse aus einem Profil als Zahl; 0 = Kindergarten, null = nicht angegeben. */
  function klasseVon(p) {
    const k = p?.klasse;
    return k === null || k === undefined || k === "" || Number.isNaN(Number(k)) ? null : Number(k);
  }

  /**
   * Alter in ganzen Jahren aus dem Geburtsdatum (geboren "JJJJ-MM-TT", Plan B3) über KERN.person.alter; ohne Tag
   * ("JJJJ-MM", Profile seit LERN_Session14) zählt das neue Lebensjahr ab dem Ersten des Geburtsmonats. Ältere Profile
   * ohne Geburtsdatum: die gespeicherte Zahl alter. Sonst null.
   */
  function alterVon(p, jetzt = new Date()) {
    if (!KERN.person.geburtsdatumLies(p?.geboren)) return typeof p?.alter === "number" ? p.alter : null;
    return KERN.person.alter(p.geboren, jetzt);
  }

  /**
   * Klassenaufstieg (Wunsch Patrik, LERN_Session14): Die Aufsicht lässt ein Kind in die nächste Klasse aufsteigen. Die
   * Klasse steigt um eins, der Aufstieg steht in aufstiege (für die Nachricht ans Kind und das Abzeichen „Aufgestiegen“).
   * Nach der 6. Klasse geht es im Lernsteig weiter, dort gibt es keinen Aufstieg mehr. Gibt die neue Klasse oder null.
   */
  function aufsteigen(name) {
    const p = profil(name);
    const k = klasseVon(p);
    if (k === null || k >= KLASSEN[KLASSEN.length - 1]) return null;
    speichereProfil(name, { klasse: k + 1, aufstiege: [...(p.aufstiege || []), { von: k, nach: k + 1, zeit: new Date().toISOString() }] });
    return k + 1;
  }
  /** Den letzten Aufstieg zurücknehmen (aus Versehen ausgelöst): Klasse wieder wie davor, das Abzeichen fällt weg. */
  function aufstiegZuruecknehmen(name) {
    const liste = [...(profil(name).aufstiege || [])];
    const letzter = liste.pop();
    if (!letzter) return null;
    speichereProfil(name, { klasse: letzter.von, aufstiege: liste });
    return letzter.von;
  }
  /** Letzter Aufstieg, den das Kind noch nicht gefeiert hat, sonst null. */
  function neuerAufstieg(name) {
    const p = profil(name);
    const letzter = (p.aufstiege || []).at(-1);
    return letzter && (!p.aufstiegGesehen || p.aufstiegGesehen < letzter.zeit) ? letzter : null;
  }

  /** Schulklasse, für die eine Stufe gedacht ist (Basisklasse + Abstand); die Königsstufe zählt wie Stufe 5. */
  function klasseDerStufe(spielId, stufeId) {
    const b = basisKlasse(spielId);
    const st = SKALA.find(s => s.id === stufeId);
    if (!b || !st) return null;
    return b + (st.rel ?? 1);
  }

  /**
   * Empfohlene Stufe aus der Klasse des Kindes und der Basisklasse des Spiels: gleiche Klasse →
   * Stufe 3, eine Klasse tiefer oder mehr → Stufe 1, eine höher → Stufe 5, zwei und mehr höher →
   * Königsstufe. Ohne Spiel (Filter auf der Startseite) gilt Stufe 3 = die eigene Klasse, für den
   * Kindergarten Stufe 1.
   */
  function empfohleneStufe(name, spielId) {
    const k = klasseVon(profil(name));
    if (k === null) return null;
    // Ohne Spiel: die eigene Klasse als Basisklasse — Spiele für den Kindergarten haben Basisklasse 1.
    const b = spielId ? basisKlasse(spielId) : Math.max(k, 1);
    if (b === null) return null;
    const d = k - b;
    return d < 0 ? "s1" : d === 0 ? "s3" : d === 1 ? "s5" : "s6";
  }

  const protokoll = () => lies("protokoll", []);
  /** Runde ins Protokoll; mit der Kennung der Person (P1 a), der Name bleibt als Kopie für die Anzeige. */
  // Kennung (R1 a) und Person (P1 a); der Name bleibt als Kopie für die Anzeige.
  const mitPerson = eintrag => {
    const p = person(eintrag?.name);
    const e = { ...eintrag, id: eintrag?.id || KERN.runden.neueId() };
    return p ? { ...e, person: p.id, name: p.name } : e;
  };
  /** Runde speichern; gleiche Kennung ersetzt einen Zwischenstand derselben Serie (RA3 a, KERN.runde.eintragen). */
  function protokolliere(eintrag) { if (!schreibe("protokoll", KERN.runde.eintragen(protokoll(), mitPerson(eintrag)))) speicherVoll(); }

  // ---------- Endlos-Rekorde (Vorgabe Patrik 2026-10-31) ----------
  // lernspiele:rekorde = [{ name, zeit, spiel, stufe, timer (Startzeit in Sekunden oder null), punkte,
  //   dauer, alles?, test?, hilfe? }] — eine Zeile je Endlos-Runde, getrennt vom Protokoll der Runden.
  // Zwei Ranglisten je Stufe: ohne und mit Timer. Mit Timer starten alle mit der Vorgabezeit der Stufe
  // (Katalog, ohne persönlichen Faktor), und die Zeit wird je gelöste Aufgabe etwas kürzer
  // (ENDLOS_TEMPO) — so ist der Vergleich gerecht. Das Format ist
  // so gewählt, dass es später auch an einen Server gehen könnte (Rangliste nach Alter, Klasse, Region
  // — noch Idee); heute bleibt alles im Browser.
  const rekorde = () => lies("rekorde", []);
  /** Rekord speichern; ein Zwischenstand derselben Serie (gleiche Kennung) wird ersetzt (KERN.runde). */
  function speichereRekord(eintrag) { if (!schreibe("rekorde", KERN.runde.rekordEintragen(rekorde(), mitPerson(eintrag)))) speicherVoll(); }
  /** Stufen, die den Endlos-Modus anbieten (Katalog: endlos). */
  const endlosStufen = spielId => katalogEintrag(spielId)?.endlos || [];
  const gleicherModus = (e, spiel, stufe, mitTimer) => e.inhalt === spiel && e.stufe === stufe && !!e.timer === !!mitTimer;
  /**
   * Endlos mit Timer (Entscheide Patrik F1 a, F2 a, 2026-10-31): Die Zeit nähert sich einem Boden, der aus
   * den Handgriffen der Aufgabe folgt (ctx.schritte): grundzeit + schritte × jeSchritt. Wartezeit zählt nicht
   * dazu: Die Uhr startet erst, wenn das Kind antworten kann (F1 a, LERN_Session9). Je gelöste Aufgabe
   * fällt 8 % der restlichen Spanne weg — anfangs grosse Schritte, dann immer kleinere, ohne abrupten Halt.
   * Grundzeit und Schrittzeit sind Annahmen, bis gemessene Zeiten von Kindern vorliegen. Ohne Angabe der
   * Handgriffe (darf nicht vorkommen, das Testskript prüft es) gilt als Boden ersatzweise 40 % der Startzeit.
   */
  /**
   * Serienbremse (Vorgabe Patrik 2026-11-01): Ein zufällig gewähltes Merkmal (ctx.serie) kommt höchstens
   * SERIE_MAX-mal hintereinander. Die Suche nach einer neuen Aufgabe (Stufen, Gedächtnis, Kürzen) führt der Kern
   * (KERN.runde.auswahl, RA5 a, RA6 a; docs/kern/rahmen.md 4.22).
   */
  const SERIE_MAX = KERN.runde.SERIE_MAX;

  const ENDLOS_TEMPO = { annaeherung: 0.92, grundzeit: 1.2, jeSchritt: 0.5, ersatzBoden: 0.4 };
  const endlosBoden = (start, schritte) => Math.min(start,
    schritte > 0 ? ENDLOS_TEMPO.grundzeit + schritte * ENDLOS_TEMPO.jeSchritt : start * ENDLOS_TEMPO.ersatzBoden);
  /** Sekunden für die nächste Endlos-Aufgabe, auf eine Zehntelsekunde gerundet. */
  function endlosSekunden(start, geschafft, schritte) {
    const boden = endlosBoden(start, schritte);
    return Math.round((boden + (start - boden) * ENDLOS_TEMPO.annaeherung ** geschafft) * 10) / 10;
  }
  /** Anzeige der Zeit: unter 10 s mit einer Nachkommastelle (Komma), sonst ganze Sekunden. */
  const sekundenText = s => (s < 10 ? s.toFixed(1).replace(".", ",") : String(Math.round(s))) + " s";
  function besterRekord(name, spiel, stufe, timer) {
    return KERN.runde.bestwert(rekorde(), e => e.name === name && gleicherModus(e, spiel, stufe, timer));
  }
  /** Rangliste: bester Wert je Spieler, ohne Testrunden und ohne Aufsicht, absteigend. */
  function ranglisteFuer(spiel, stufe, timer) {
    const beste = new Map();
    for (const e of rekorde()) {
      if (e.test || istAufsicht(e.name) || !gleicherModus(e, spiel, stufe, timer)) continue;
      if (!beste.has(e.name) || e.punkte > beste.get(e.name).punkte) beste.set(e.name, e);
    }
    return [...beste.values()].sort((a, b) => b.punkte - a.punkte || (a.zeit < b.zeit ? -1 : 1));
  }

  /** Rangliste als kleine Tabelle: bester Wert je Spieler (ohne Testrunden), der eigene hervorgehoben. */
  function rangliste(spiel, stufeId, mitTimer, ich, hoechstens = 10) {
    const liste = ranglisteFuer(spiel, stufeId, mitTimer);
    if (!liste.length) return el("div");
    return el("div", { class: "rangliste" },
      el("b", { text: mitTimer ? "⏱ mit Timer" : "ohne Timer" }),
      el("ol", {}, ...liste.slice(0, hoechstens).map(r => el("li", { class: r.name === ich ? "ich" : "" },
        el("span", {}, avatarBild(r.name, 22), ` ${r.name}`), el("b", { text: String(r.punkte) })))));
  }

  function besteSterne(name, spiel, stufe) {
    return protokoll()
      .filter(e => e.name === name && e.inhalt === spiel && e.stufe === stufe)
      .reduce((m, e) => Math.max(m, e.sterne), 0);
  }

  // ---------- Sprachausgabe (Entscheid G2 a) ----------
  // Offline nur über die Stimmen des Geräts (speechSynthesis); welche es gibt, hängt vom Gerät ab.

  // Bevorzugte Varianten: britisches Englisch wie im Schweizer Lehrmittel, Schweizer bzw. deutsches Deutsch,
  // Französisch aus der Schweiz, sonst aus Frankreich (LERN_Session8).
  const BEVORZUGT = { en: ["en-gb", "en"], de: ["de-ch", "de-de", "de"], fr: ["fr-ch", "fr-fr", "fr"] };
  /** Stimme für eine Sprache ("en", "de", …) oder null; zuerst die bevorzugte Variante. */
  function stimme(sprache) {
    try {
      const stimmen = speechSynthesis.getVoices();
      for (const lang of BEVORZUGT[sprache] || [sprache]) {
        const v = stimmen.find(s => (s.lang || "").toLowerCase().replace("_", "-").startsWith(lang));
        if (v) return v;
      }
      return null;
    } catch { return null; }
  }
  /** Gibt es eine Stimme für die Sprache? Wartet kurz, weil manche Browser die Stimmen erst nachladen. */
  function stimmeBereit(sprache) {
    if (stimme(sprache)) return Promise.resolve(true);
    return new Promise(fertig => {
      let erledigt = false;
      const ende = () => { if (!erledigt) { erledigt = true; fertig(!!stimme(sprache)); } };
      try { speechSynthesis.addEventListener("voiceschanged", ende, { once: true }); } catch { /* ohne Ereignis */ }
      setTimeout(ende, 1500);
    });
  }
  // Stimmlage je Art (Wunsch Patrik, LERN_Session8): Lob höher und lebhafter, Tipps tiefer und ruhiger,
  // damit man Rückmeldung und Aufgabe am Klang unterscheidet. Mehr als Tonhöhe und Tempo bietet die
  // Sprachausgabe der Browser nicht.
  const STIMMLAGE = { "": { pitch: 1, rate: 0.85 }, gut: { pitch: 1.35, rate: 1 }, hinweis: { pitch: 0.85, rate: 0.78 } };
  /**
   * Text vorlesen; art: "" (Aufgabe), "gut" (Lob), "hinweis" (Tipp). false ohne Stimme, bei Ton aus oder in der Ruhezeit.
   * kanal (Ruhezeit, AN3-T a): "vorlesen" (die Eule liest vor), "hoeren" (Hören als Inhalt: LS.sprich der Spiele), null
   * (Probe auf dem Startblatt: auf Knopfdruck der Aufsicht, immer).
   */
  function sprich(text, sprache = "en", art = "", fertig = null, kanal = null) {
    // fertig: einmal gerufen, wenn die Stimme fertig ist (ctx.uhrWarten) — gleich danach, wenn nichts gesprochen wird.
    let gerufen = false;
    const ende = () => { if (!gerufen && fertig) { gerufen = true; fertig(); } };
    const nichts = () => { setTimeout(ende, 0); return false; };
    if (!tonAn) return nichts(); // Ton aus (🔇 in der Kopfzeile) gilt auch für die Stimme
    if (kanal && ruhe(kanal)) return nichts();
    // Leerer Text: nichts sagen — und nichts abbrechen, was gerade gesprochen wird (Meldung Hör-Reporter).
    if (!String(text).trim()) return nichts();
    const v = stimme(sprache);
    if (!v) return nichts();
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v;
      u.lang = v.lang;
      const lage = STIMMLAGE[art] || STIMMLAGE[""];
      u.rate = lage.rate;
      u.pitch = lage.pitch;
      u.onend = ende;
      // Fehler sichtbar machen (Meldung Patrik, LERN_Session11: in Au café war nicht zu sehen, ob eine Stimme da ist
      // oder etwas scheitert). Abgebrochen und unterbrochen sind keine Fehler: das tut sprich selbst (cancel).
      u.onerror = e => {
        ende();
        if (["interrupted", "canceled"].includes(e?.error)) return;
        stimmFehler = { sprache, fehler: e?.error || "unbekannt", stimme: v.name };
        stimmFehlerHoerer?.(stimmFehler);
      };
      // Manche Browser melden das Ende nicht: spätestens nach einer groben Sprechdauer.
      if (fertig) setTimeout(ende, (1 + text.length * 0.1) / lage.rate * 1000);
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      return true;
    } catch { return nichts(); }
  }
  /** LS.sprich der Spiele: Hören als Inhalt (Aussprache, Hörtexte) — ruht in der Ruhezeit für das Hören (AN3-T a). */
  const sprichInhalt = (text, sprache, art, fertig) => sprich(text, sprache, art, fertig, "hoeren");
  /**
   * fn rufen, sobald keine Stimme mehr spricht (Lob der vorigen Aufgabe, Vorlesen); spätestens nach max ms.
   * Abgefragt statt auf onend gewartet: Manche Browser melden das Ende nicht, und sprich bricht Fremdes ab.
   */
  function nachStimme(fn, max = 10000) {
    const bis = Date.now() + max;
    const schau = () => {
      let laeuft = false;
      try { laeuft = tonAn && (speechSynthesis.speaking || speechSynthesis.pending); } catch { /* ohne Stimme */ }
      if (laeuft && Date.now() < bis) setTimeout(schau, 120); else fn();
    };
    schau();
  }
  /**
   * Spiel starten, das eine Stimme braucht: sofort, wenn sie schon da ist (so auch im Testskript),
   * sonst nach stimmeBereit. Ohne Stimme erklärt die Eule es und bietet keine Runde an.
   */
  function spielMitStimme(def, sprache = "en") {
    const ohne = () => spiel({ ...def, stufen: {}, stimme: sprache,
      einleitung: "Oh! Dieses Gerät hat keine passende Stimme, darum kannst du hier nichts hören. Bitte einen Erwachsenen, eine Stimme einzuschalten, oder spiel ein anderes Spiel." });
    if (stimme(sprache)) spiel({ ...def, stimme: sprache });
    else stimmeBereit(sprache).then(ok => (ok ? spiel({ ...def, stimme: sprache }) : ohne()));
  }

  // ---------- Stimmen sichtbar machen (Meldung Patrik, LERN_Session11) ----------
  // Auf dem Startblatt: welche Stimme das Spiel nutzt (def.stimme aus spielMitStimme, „de“ fürs Vorlesen), ob sie
  // noch lädt oder fehlt, und ein Probeknopf. Im Spiel sagt die Eule einmal je Runde, wenn das Sprechen scheitert.
  const SPRACHNAME = { de: "Deutsch", fr: "Französisch", en: "Englisch" };
  const SPRACH_ADJ = { de: "deutsche", fr: "französische", en: "englische" };
  const PROBE = { de: "Hallo, ich bin die Eule.", fr: "Bonjour !", en: "Hello!" };
  let stimmFehler = null;        // letzter echter Fehler beim Sprechen { sprache, fehler, stimme }
  let stimmFehlerHoerer = null;  // setzt die laufende Seite (Startblatt oder Runde)
  /** Zeile „🗣️ Französisch: Google français ✓ · ▶ Probe“ je Sprache; aktualisiert sich, wenn Stimmen nachladen. */
  function stimmenZeile(sprachen) {
    const zeile = el("div", { class: "stimmen-zeile leise" });
    const zeichne = () => {
      zeile.innerHTML = "";
      for (const sp of sprachen) {
        const v = stimme(sp);
        const teil = el("span", { class: "stimme-eintrag" });
        teil.append(`🗣️ ${SPRACHNAME[sp] || sp}${sp === "de" && sprachen.length > 1 ? " (Vorlesen)" : ""}: `);
        if (!v) teil.append(el("b", { text: geladen ? "⚠ keine Stimme auf diesem Gerät" : "⏳ wird geladen …" }),
          geladen ? ` — eine ${SPRACH_ADJ[sp] || sp} Stimme lässt sich in den Einstellungen des Geräts (Sprache oder Bedienungshilfen) dazuladen.` : "");
        else {
          teil.append(`${v.name} (${v.lang}) ✓ `);
          const meldung = el("span", { class: "stimme-meldung" });
          teil.append(el("button", { type: "button", class: "knopf hell klein", text: "▶ Probe", onclick: () => {
            stimmFehler = null;
            meldung.textContent = !tonAn ? " Der Ton ist aus — oben rechts 🔊 einschalten." : "";
            if (!tonAn) return;
            sprich(PROBE[sp] || "Test", sp, "", () => { meldung.textContent = stimmFehler?.sprache === sp ? ` ⚠ Fehler beim Sprechen: ${stimmFehler.fehler}` : " ✓ gesprochen"; });
          } }), meldung);
        }
        zeile.append(teil);
      }
    };
    let geladen = sprachen.every(sp => stimme(sp));
    zeichne();
    if (!geladen) Promise.all(sprachen.map(stimmeBereit)).then(() => { geladen = true; if (zeile.isConnected) zeichne(); });
    return zeile;
  }
  /** Hinweis der Eule bei einem echten Fehler beim Sprechen, einmal je Runde. */
  function stimmFehlerFuer(eule) {
    let gesagt = false;
    return f => {
      if (gesagt) return;
      gesagt = true;
      eule.sag(`🗣️ Die ${SPRACH_ADJ[f.sprache] || f.sprache} Stimme hat nicht gesprochen (${f.fehler}). Ist der Ton an? Sonst bitte einen Erwachsenen, die Stimmen des Geräts zu prüfen.`, "hinweis");
    };
  }

  // ---------- Vorlesen (Wunsch Patrik, LERN_Session8) ----------
  // Für Kinder, die noch nicht sicher lesen: Die Eule liest ihre Sprechblase und den Auftrag der Aufgabe
  // vor, also nur die Elemente .frage und .auftrag — nie Satz, Wortkarte oder Sachtext und damit nie den
  // Stoff eines Lesespiels. Profil-Feld vorlesen: "auto" (jede Aufgabe und jeder Tipp), "knopf" (nur auf 🔊),
  // fehlt = nach Klasse: Kindergarten und 1. Klasse automatisch. Ein Spiel schliesst es im Katalog mit
  // vorlesen: false aus; Englisch und Französisch sind ausgeschlossen (fremde Wörter, eigene Stimmen).
  const OHNE_VORLESEN = ["Englisch", "Französisch"];
  const VORLESEN_ARTEN = { "": "nach Klasse", auto: "automatisch", knopf: "nur auf 🗣️" };
  function vorlesenErlaubt(spielId) {
    const s = typeof SPIELE !== "undefined" ? SPIELE.find(x => x.id === spielId) : null;
    if (!s) return false;
    if (s.vorlesen !== undefined) return s.vorlesen;
    const fach = typeof THEMEN !== "undefined" ? THEMEN.find(t => t.id === s.thema)?.fach : null;
    return !OHNE_VORLESEN.includes(fach);
  }
  /** Antwortknöpfe durch langes Drücken vorlesen? Nicht in Deutsch (Buchstaben und Wörter sind dort Stoff). */
  function knoepfeVorlesen(spielId) {
    const s = typeof SPIELE !== "undefined" ? SPIELE.find(x => x.id === spielId) : null;
    if (!s || !vorlesenErlaubt(spielId)) return false;
    if (s.knoepfeVorlesen !== undefined) return s.knoepfeVorlesen;
    return (typeof THEMEN !== "undefined" ? THEMEN.find(t => t.id === s.thema)?.fach : null) !== "Deutsch";
  }
  function vorlesenArt(name) {
    const p = profil(name);
    const w = wahlFuer(name, "vorlesen");
    if (w === "auto" || w === "knopf") return w;
    if (p.vorlesen === "auto" || p.vorlesen === "knopf") return p.vorlesen;
    const k = klasseVon(p);
    return k !== null && k <= 1 ? "auto" : "knopf";
  }
  /**
   * Langes Drücken (0.5 s) auf einen Knopf in der Fläche liest seinen Text vor; der Knopf wird dabei nicht
   * ausgelöst (der folgende Klick wird in der Einfangphase verworfen). Kurzes Tippen wirkt wie bisher.
   */
  // Die Hörer hängen einmal am Dokument (nicht an jeder Fläche einer Runde) und gelten für die aktuelle Fläche.
  let langDrueckenFlaeche = null;
  function langDruecken(flaeche) {
    const ersteMal = !langDrueckenFlaeche;
    langDrueckenFlaeche = flaeche;
    if (!ersteMal) return;
    let uhr = null, gelesen = false, start = null;
    const halt = () => { clearTimeout(uhr); uhr = null; };
    // Knöpfe, Links (Stufenknöpfe der Startseite) und alles mit data-vorlesen (Spielkarten der Startseite)
    const knopf = e => { const k = e.target.closest?.("[data-vorlesen], button, a"); return k && langDrueckenFlaeche.contains(k) ? k : null; };
    document.addEventListener("pointerdown", e => {
      const k = knopf(e);
      if (!k) return;
      gelesen = false; start = [e.clientX, e.clientY];
      halt();
      uhr = setTimeout(() => {
        const text = fuerStimme(k.dataset.vorlesen || k.getAttribute("aria-label") || k.textContent || "");
        if (text && sprich(text, "de", "", null, "vorlesen")) gelesen = true; // ohne Stimme bleibt der Klick erhalten
      }, 500);
    });
    document.addEventListener("pointermove", e => { if (uhr && start && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 12) halt(); });
    for (const t of ["pointerup", "pointercancel"]) document.addEventListener(t, halt);
    document.addEventListener("click", e => { if (gelesen) { gelesen = false; e.stopPropagation(); e.preventDefault(); } }, true);
    document.addEventListener("contextmenu", e => { if (knopf(e)) e.preventDefault(); });
  }

  /**
   * Text für die Stimme: ohne Bildzeichen (sonst liest sie „roter Apfel“ mit), Rechenzeichen ausgeschrieben.
   * Uhrzeiten stehen ohne Leerzeichen („7:42“), die Division mit („21 : 3“) — so liest sie „7 Uhr 42“ und
   * „21 durch 3“ (Meldung Fahrplan-Rechner, LERN_Session9).
   */
  function fuerStimme(text) {
    return text
      .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}]/gu, " ")
      .replace(/(?<![\d:])(\d{1,2}):(\d{2})(?![\d:])(?:\s*Uhr\b)?/g, (_, h, m) => (m === "00" ? `${h} Uhr` : `${h} Uhr ${Number(m)}`))
      .replace(/(\d)\s*[×·]\s*(\d)/g, "$1 mal $2").replace(/(\d)\s*:\s*(\d)/g, "$1 durch $2")
      .replace(/\s*=\s*\?/g, " gleich wie viel?")
      // zwischen Wörtern: „gross/klein“, „Wort antippen = …“, „A · B“ — sonst „Schrägstrich“, „gleich“, „Punkt“
      .replace(/(\p{L})\s*\/\s*(\p{L})/gu, "$1 oder $2").replace(/(\p{L})\s*=\s*(\p{L})/gu, "$1: $2")
      .replace(/\s+·\s+/g, ", ").replace(/\s+/g, " ").trim();
  }

  // ---------- Töne ----------

  let audio = null;
  let tonAn = lies("ton", true);

  /** Kurzer Klang: art ist ein Name unten oder eine eigene Folge [[Frequenz, Dauer], …] (Abschluss-Animation). */
  function ton(art) {
    if (!tonAn || ruhe("klaenge")) return; // Ruhezeit (AN3-T a): Klänge schweigen, die Abschluss-Animation spielt hierüber
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const folgen = Array.isArray(art) ? art : {
        tipp:    [[660, 0.05]],
        richtig: [[523, 0.10], [659, 0.10], [784, 0.16]],
        falsch:  [[330, 0.12], [262, 0.18]],
        huepf:   [[440, 0.06], [880, 0.08]],
        fertig:  [[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.3]],
      }[art] || [];
      let t = audio.currentTime;
      for (const [freq, dauer] of folgen) {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dauer);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + dauer);
        t += dauer * 0.9;
      }
    } catch { /* ohne Ton weiter */ }
  }

  /** Knopf „Ton an/aus“ in der Kopfzeile; beimWechsel(an) erfährt jede Änderung (der Mix gibt sie an seine Spiele weiter). */
  function tonSchalter(knopf, beimWechsel = null) {
    if (!knopf) return;
    const setze = () => { knopf.textContent = tonAn ? "🔊" : "🔇"; };
    knopf.addEventListener("click", () => {
      tonAn = !tonAn; schreibe("ton", tonAn); setze(); ton("tipp"); beimWechsel?.(tonAn);
      if (!tonAn) try { speechSynthesis.cancel(); } catch { /* ohne Stimme */ }
    });
    setze();
  }
  /** Ton an oder aus, ohne zu speichern (im Mix: Meldung der Mix-Seite). */
  const setzeTon = an => { tonAn = !!an; if (!tonAn) try { speechSynthesis.cancel(); } catch { /* ohne Stimme */ } };

  // ---------- Eule ----------

  const EULE_SVG = `
<svg class="eule" viewBox="0 0 84 92" aria-hidden="true">
  <ellipse cx="42" cy="88" rx="26" ry="4" fill="rgba(0,0,0,.08)"/>
  <path d="M14 30 L10 10 L28 22 Z M70 30 L74 10 L56 22 Z" fill="#8a5a3c"/>
  <ellipse cx="42" cy="52" rx="32" ry="36" fill="#a8714d"/>
  <ellipse cx="42" cy="62" rx="20" ry="22" fill="#f3d9b8"/>
  <path d="M30 58 q4 4 8 0 M38 66 q4 4 8 0 M46 58 q4 4 8 0" stroke="#d9b48c" stroke-width="2" fill="none"/>
  <circle cx="29" cy="36" r="13" fill="#fff"/>
  <circle cx="55" cy="36" r="13" fill="#fff"/>
  <circle cx="31" cy="37" r="6" fill="#2d3047"/>
  <circle cx="53" cy="37" r="6" fill="#2d3047"/>
  <circle cx="33" cy="35" r="2" fill="#fff"/>
  <circle cx="55" cy="35" r="2" fill="#fff"/>
  <path d="M38 46 L46 46 L42 53 Z" fill="#ffb02e"/>
  <path d="M16 78 q-4 6 2 8 M68 78 q4 6 -2 8" stroke="#ffb02e" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="20" y="6" width="44" height="6" rx="2" fill="#2d3047"/>
  <rect x="34" y="0" width="16" height="8" rx="2" fill="#2d3047"/>
</svg>`;

  /**
   * Eule mit Sprechblase. kuerzen (in der Runde, Entscheid BH2 a, LERN_Session13): Die Blase zeigt höchstens zwei
   * Zeilen; ist der Text länger, steht „…“ und ▾ — Antippen zeigt alles, nochmals Antippen klappt zu. Ein Hinweis nach
   * einem Fehler (art „hinweis“) steht immer ganz. 🗣️ liest immer den ganzen Text. Der Text der Blase bleibt dabei
   * gleich (nur CSS), damit Vorlesen und Prüfung ihn ganz sehen.
   */
  function euleZeile({ kuerzen = false } = {}) {
    const zeile = el("div", { class: "eule-zeile" });
    zeile.innerHTML = EULE_SVG;
    const blase = el("div", { class: "blase", "aria-live": "polite" });
    zeile.append(blase);
    const eule = zeile.querySelector(".eule");
    const pruefeLaenge = () => {
      const t = blase.firstElementChild; // span.blase-text: gekürzt wird nur der Text, die Blase behält Zipfel und Rand
      const zu = blase.classList.contains("kurz") && !!t && t.scrollHeight > t.clientHeight + 2;
      blase.classList.toggle("gekuerzt", zu);
      if (zu || blase.classList.contains("offen")) blase.setAttribute("aria-expanded", String(blase.classList.contains("offen")));
      else blase.removeAttribute("aria-expanded");
    };
    if (kuerzen) {
      blase.addEventListener("click", () => {
        pruefeLaenge(); // frisch messen: die Breite kann sich seit dem Sprechen geändert haben
        if (!blase.classList.contains("gekuerzt") && !blase.classList.contains("offen")) return;
        const auf = !blase.classList.contains("offen");
        blase.classList.toggle("offen", auf);
        blase.classList.toggle("kurz", !auf);
        pruefeLaenge();
      });
      addEventListener("resize", pruefeLaenge);
    }
    const api = {
      element: zeile,
      blase,
      /** Nur anzeigen, ohne Hüpfen und ohne Vorlesen (wiederhergestellter Auftrag; der war schon vorgelesen). */
      zeige(text) {
        blase.className = "blase" + (kuerzen ? " kurz" : "");
        if (kuerzen) { blase.replaceChildren(el("span", { class: "blase-text", text })); pruefeLaenge(); setTimeout(pruefeLaenge, 0); }
        else blase.textContent = text;
      },
      beiSag: null, // Vorlesen: hört mit, was die Eule sagt
      sag(text, art = "") {
        blase.className = "blase" + (art ? " " + art : "") + (kuerzen && art !== "hinweis" ? " kurz" : "");
        if (kuerzen) {
          blase.replaceChildren(el("span", { class: "blase-text", text }));
          pruefeLaenge(); // gleich, wenn die Blase schon im Bild steht; sonst nach dem Einhängen nochmals
          setTimeout(pruefeLaenge, 0);
        } else blase.textContent = text;
        eule.classList.remove("huepft");
        void eule.offsetWidth; // Animation neu starten
        eule.classList.add("huepft");
        if (api.beiSag && text) api.beiSag(text, art);
      },
    };
    return api;
  }

  // ---------- Konfetti ----------

  function konfetti(anzahl = 60) {
    const farben = ["#8e5bd6", "#e0569a", "#f07c2a", "#e9b300", "#2fb36b", "#2f8fe0", "#e5484d"];
    for (let i = 0; i < anzahl; i++) {
      const k = el("div", { class: "konfetti" });
      k.style.left = Math.random() * 100 + "vw";
      k.style.background = waehle(farben);
      k.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      k.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.append(k);
      setTimeout(() => k.remove(), 4500);
    }
  }

  // ---------- Bildschirmtastatur ----------

  let aktiveTastatur = null;

  // Notizfeld als Ziel der Bildschirmtastatur (Meldung Patrik, LERN_Session14: mit der Maus liess sich ein Notizfeld
  // nicht füllen, die Tasten schrieben nur ins Antwortfeld). Ist ein Notizfeld (zw-notiz) oder ein Häuschen des
  // Notizblocks (nb-feld) gewählt, schreiben Ziffern, Zeichen und ⌫ dort hinein, ✕ leert es, OK heisst „✓ Notiz fertig“
  // und führt zurück zur Antwort. Die Tasten nehmen dem Feld den Fokus nicht (pointerdown); die Tastatur des Geräts
  // bleibt zu, solange die Bildschirmtastatur da ist (inputmode none).
  const NOTIZ_ZIEL = ".zw-notiz, .nb-feld";
  const notizImFokus = () => (document.activeElement?.matches?.(NOTIZ_ZIEL) ? document.activeElement : null);
  /** Zeichen ins Notizfeld f (an der Schreibmarke), höchstens maxlength; meldet es wie eine Eingabe von Hand. */
  function inNotiz(f, was) {
    const max = Number(f.getAttribute("maxlength")) || 99;
    const a = f.selectionStart ?? f.value.length, b = f.selectionEnd ?? f.value.length;
    if (was === "⌫") {
      const von = a === b ? Math.max(0, a - 1) : a;
      f.value = f.value.slice(0, von) + f.value.slice(b);
      f.setSelectionRange?.(von, von);
    } else if (was === "✕") f.value = "";
    else {
      if (f.value.length - (b - a) >= max) return;
      f.value = f.value.slice(0, a) + was + f.value.slice(b);
      f.setSelectionRange?.(a + was.length, a + was.length);
      ton("tipp");
    }
    f.dispatchEvent(new Event("input", { bubbles: true }));
  }
  document.addEventListener("focusin", e => {
    if (!e.target?.matches?.(NOTIZ_ZIEL)) return;
    const mitTastatur = !!aktiveTastatur && document.body.contains(aktiveTastatur.element);
    e.target.inputMode = mitTastatur ? "none" : "numeric";
    if (mitTastatur) aktiveTastatur.notizModus(true);
  });
  document.addEventListener("focusout", e => {
    if (e.target?.matches?.(NOTIZ_ZIEL) && aktiveTastatur) setTimeout(() => { if (!notizImFokus()) aktiveTastatur?.notizModus(false); }, 0);
  });

  document.addEventListener("keydown", (e) => {
    if (!aktiveTastatur || !document.body.contains(aktiveTastatur.element)) return;
    if (e.target?.closest?.("input, textarea, select, [contenteditable]")) return; // Notizfeld u. ä.: dort wird getippt
    if (/^[0-9]$/.test(e.key)) aktiveTastatur.tippe(e.key);
    else if ((e.key === "." || e.key === ",") && aktiveTastatur.dezimal) aktiveTastatur.zeichen();
    else if (e.key === "Backspace") aktiveTastatur.loesche();
    else if (e.key === "Enter") aktiveTastatur.ok();
    else return;
    e.preventDefault();
  });

  /**
   * Zifferntastatur, die in ein Anzeigefeld schreibt.
   * opt.anzeige: Element, in dem die Zahl formatiert erscheint
   * opt.maxStellen: höchstens so viele Ziffern vor dem Dezimalzeichen
   * opt.dezimal: Taste für das Dezimalzeichen (Punkt oder Komma nach LS.einstellung("dezimal"))
   * opt.nachkomma: höchstens so viele Ziffern danach (Standard 3)
   * opt.onOk(wert, text): beim Drücken von OK (wert als Zahl; text wie getippt mit „.“, z. B. „3.0“ —
   *   für Spiele, bei denen die Zahl der Nachkommastellen zählt)
   */
  function tastatur(opt) {
    let ziffern = ""; // wie getippt, Dezimalzeichen intern immer "."
    const max = opt.maxStellen || 7;
    const nachkomma = opt.nachkomma ?? 3;
    const t = el("div", { class: "tastatur" });
    let okKnopf;

    /** Angezeigt wie dezimalText, aber mit den getippten Nullen am Ende („4.50“). */
    function text() {
      const [ganz, rest] = ziffern.split(".");
      return zahlText(Number(ganz)) + (rest === undefined ? "" : (einstellung("dezimal") === "komma" ? "," : ".") + rest);
    }

    function zeige() {
      opt.anzeige.classList.remove("richtig", "falsch");
      opt.anzeige.classList.toggle("leer", ziffern === "");
      opt.anzeige.textContent = ziffern === "" ? "" : text();
      okKnopf.disabled = ziffern === "" || ziffern.endsWith(".");
      if (opt.onAenderung) opt.onAenderung(ziffern === "" || ziffern.endsWith(".") ? null : Number(ziffern));
    }

    // Taste: ins gewählte Notizfeld, sonst in die Antwort
    const taste = (was, sonst) => () => { const f = notizImFokus(); if (f) inNotiz(f, was); else sonst(); };
    const api = {
      element: t,
      dezimal: !!opt.dezimal,
      /** Schreibt die Tastatur gerade in ein Notizfeld? OK heisst dann „✓ Notiz fertig“. */
      notizModus(an) {
        t.classList.toggle("notiz-ziel", an);
        okKnopf.textContent = an ? "✓ Notiz fertig" : "OK ✓";
        if (an) okKnopf.disabled = false; else zeige();
      },
      tippe(z) {
        if (api.gesperrt) return;
        const [ganz, rest] = ziffern.split(".");
        if (rest === undefined ? ganz.length >= max : rest.length >= nachkomma) return;
        if (ziffern === "0") ziffern = "";
        ziffern += z;
        ton("tipp");
        zeige();
      },
      zeichen() {
        if (api.gesperrt || !api.dezimal || ziffern.includes(".")) return;
        ziffern = (ziffern === "" ? "0" : ziffern) + ".";
        ton("tipp");
        zeige();
      },
      loesche() {
        if (api.gesperrt) return;
        ziffern = ziffern.slice(0, -1);
        zeige();
      },
      ok() {
        if (api.gesperrt || ziffern === "" || ziffern.endsWith(".")) return;
        opt.onOk(Number(ziffern), ziffern);
      },
      leeren() { ziffern = ""; zeige(); },
      gesperrt: false,
    };

    for (const z of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
      t.append(el("button", { type: "button", text: z, onclick: taste(z, () => api.tippe(z)) }));
    }
    if (api.dezimal) {
      const zeichen = einstellung("dezimal") === "komma" ? "," : ".";
      t.append(el("button", { type: "button", class: "zeichen", text: zeichen, "aria-label": zeichen === "," ? "Komma" : "Punkt", onclick: taste(zeichen, () => api.zeichen()) }));
    }
    t.append(el("button", { type: "button", class: "loeschen", text: "⌫", "aria-label": "Löschen", onclick: taste("⌫", () => api.loesche()) }));
    t.append(el("button", { type: "button", class: "loeschen", text: "✕", "aria-label": "Alles löschen", onclick: taste("✕", () => api.leeren()) }));
    okKnopf = el("button", { type: "button", class: "ok", text: "OK ✓", onclick: () => { const f = notizImFokus(); if (f) f.blur(); else api.ok(); } });
    t.append(okKnopf);
    // Tasten nehmen dem Notizfeld den Fokus nicht, sonst wüsste die Taste nicht mehr, wohin sie schreibt
    t.addEventListener("pointerdown", e => { if (e.target.closest("button") && notizImFokus()) e.preventDefault(); });
    t.addEventListener("mousedown", e => { if (e.target.closest("button") && notizImFokus()) e.preventDefault(); });

    aktiveTastatur = api;
    zeige();
    return api;
  }

  /**
   * Handgriffe, um wert auf der Zifferntastatur einzutippen: je Ziffer und Dezimalzeichen ein Tipp, dazu OK
   * (für ctx.schritte). Die Null vor dem Zeichen („0.5“) setzt die Tastatur selbst.
   * stellen: verlangte Nachkommastellen („3.0“ sind vier Handgriffe, nicht zwei).
   */
  const tippSchritte = (wert, stellen) => {
    const s = stellen === undefined ? String(Math.abs(wert)) : Math.abs(wert).toFixed(stellen);
    return (s.startsWith("0.") ? s.length - 1 : s.length) + 1;
  };

  // ---------- Notizfeld für ein Zwischenergebnis (Entscheid NZ1 a, LERN_Session13) ----------
  /**
   * Kleines Feld, in das das Kind ein Zwischenergebnis schreibt — nicht bewertet, nie ein Fehler. Das Spiel setzt es
   * genau dorthin, wo das Zwischenergebnis hingehört, und nur, wenn ctx.notizen(…) true gab. opt.breite in Zeichen.
   */
  function notizFeld({ breite = 6, label = "Notiz für ein Zwischenergebnis" } = {}) {
    const f = el("input", { class: "zw-notiz", type: "text", inputmode: "numeric", maxlength: String(breite + 3), autocomplete: "off",
      placeholder: "✏️", "aria-label": label, title: "Notiz (wird nicht bewertet)" });
    f.style.setProperty("--zw-breite", breite + "ch");
    return f;
  }

  // ---------- Lesetext (Entscheid BH3 a, LERN_Session13) ----------
  // Bei Lesespielen ist der Text der Stoff und darf lang sein: Er scrollt in seinem eigenen Feld, Auftrag, Frage und
  // Antworten bleiben im Bild. Die Höhe rechnet der Rahmen aus dem Platz, den der Rest der Seite übrig lässt
  // (mindestens LESETEXT_MIN px); bei jeder Grössenänderung neu.
  const LESETEXT_MIN = 120;
  const lesetexte = new Set();
  function lesetextHoehe(feld) {
    if (!feld.isConnected) { lesetexte.delete(feld); return; }
    const stelle = feld.scrollTop; // beim Messen spränge das Feld sonst an den Anfang (Hinweis Paket B, LERN_Session13)
    feld.style.maxHeight = "none";
    const seite = document.scrollingElement;
    const ueber = seite.scrollHeight - innerHeight; // so viel ist die Seite zu hoch
    const hoehe = feld.getBoundingClientRect().height;
    if (ueber > 0) feld.style.maxHeight = Math.max(LESETEXT_MIN, Math.floor(hoehe - ueber - 8)) + "px";
    feld.classList.toggle("scrollt", feld.scrollHeight > feld.clientHeight + 2);
    feld.scrollTop = stelle;
  }
  /** Macht feld zum Lesetext; das Spiel ruft es, wenn die Aufgabe ganz steht. */
  function lesetext(feld) {
    feld.classList.add("lesetext");
    lesetexte.add(feld);
    lesetextHoehe(feld);
    setTimeout(() => lesetextHoehe(feld), 0);
  }
  addEventListener("resize", () => lesetexte.forEach(lesetextHoehe));

  // ---------- Kurztasten für Antwortknöpfe (Entscheid TK1 a mit Zusatz Patrik, LERN_Session13) ----------
  // Wer mit einer echten Tastatur spielt, wählt Antworten auch mit Tasten. Zwei Arten von Tasten:
  //  • nach dem Ort (KeyboardEvent.code), ausgelegt für die Schweizer Tastatur (QWERTZ): Gleiche Zeichen liegen in
  //    jedem Spiel auf denselben, benachbarten Tasten — < = > auf Y X C, + − · : auf V B N M. Alle anderen Antworten
  //    in Bildschirm-Reihenfolge auf der Grundreihe A S D F G H J K L, danach Q W E R T Z U I O P; nie Ziffern,
  //    damit die Taste 5 nie die Antwort „5“ meint.
  //  • nach dem Zeichen (KeyboardEvent.key): Ist jede Antwort ein einzelner Buchstabe oder eine einzelne Ziffer, ist
  //    sie selbst die Taste (Ziffern nur, wenn keine Zifferntastatur offen ist); die Stellen E Z H T M ebenso, ZT und
  //    HT mit ⇧Z und ⇧H. Die Zeichen < = > + - * / : wirken immer auch so, wie man sie tippt.
  // Beschriftet wird nach der erkannten Belegung (navigator.keyboard.getLayoutMap, nur Chrome und Edge); ohne gilt
  // die Schweizer. Die Marke am Knopf (data-marke, gezeichnet in stil.css) erscheint am Computer mit Maus oder nach
  // dem ersten Tastendruck (gemerkt je Gerät). Spiele mit eigener Tastenbedienung schalten mit LS.kurztastenAus() ab.
  const KT_REIHE = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
    "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"];
  const KT_FEST = {
    "<": { code: "KeyZ", zeichen: ["<"] }, "=": { code: "KeyX", zeichen: ["="] }, ">": { code: "KeyC", zeichen: [">"] },
    "+": { code: "KeyV", zeichen: ["+"] }, "−": { code: "KeyB", zeichen: ["-", "−"] }, "-": { code: "KeyB", zeichen: ["-", "−"] },
    "·": { code: "KeyN", zeichen: ["*", "·", "×"] }, "×": { code: "KeyN", zeichen: ["*", "·", "×"] },
    ":": { code: "KeyM", zeichen: [":", "/", "÷"] }, "÷": { code: "KeyM", zeichen: [":", "/", "÷"] },
    // Satzzeichen: unten rechts, wo , . - auf der Schweizer Tastatur liegen; getippt wirken sie auch
    ",": { code: "Comma", zeichen: [","] }, ".": { code: "Period", zeichen: ["."] }, "?": { code: "Slash", zeichen: ["?"] },
    "!": { code: "KeyN", zeichen: ["!"] }, "„": { code: "KeyB", zeichen: ["„"] }, "“": { code: "KeyV", zeichen: ["“", "\""] },
    "⌫": { code: "Backspace", zeichen: [] },
  };
  const KT_STELLEN = { E: ["e"], Z: ["z"], H: ["h"], T: ["t"], M: ["m"], ZT: ["z", true], HT: ["h", true] };
  // Ja und Nein auf ihrem Anfangsbuchstaben, auch mit Bild davor („✅ Ja“; Meldung Patrik zum Netz-Falter, LERN_Session14)
  const KT_WORT = { ja: "j", nein: "n" };
  /** Erstes Wort eines Knopfs ohne Bild und Satzzeichen, klein: „✅ Ja“ → „ja“. */
  const ktWort = k => ((k.dataset.taste ?? k.textContent).replace(/[^\p{L}\s]/gu, " ").trim().split(/\s+/)[0] || "").toLowerCase();
  // Schweizer Belegung, wo sie vom Namen des Codes abweicht
  const KT_CH = { KeyZ: "Y", KeyY: "Z", Comma: ",", Period: ".", Slash: "-", Backspace: "⌫" };
  let ktBelegung = null; // Map code → Zeichen der erkannten Belegung
  let ktAus = false;
  const ktGruppen = [];
  const ktName = code => (ktBelegung?.get(code) || KT_CH[code] || code.replace(/^Key/, "")).toUpperCase();
  try {
    navigator.keyboard?.getLayoutMap?.().then(m => { if (m && m.size) { ktBelegung = m; ktGruppen.forEach(ktBeschriften); } }).catch(() => {});
  } catch { /* ohne Erkennung: Schweizer Belegung */ }

  /** Zeichen eines Knopfs: data-taste des Spiels, sonst der erste Text (ohne Zusatz wie „kleiner“). */
  const ktZeichen = k => (k.dataset.taste ?? (k.firstChild?.textContent || k.textContent)).trim();

  function ktBeschriften(g) {
    for (const a of g.tasten) {
      // Steht der Buchstabe oder die Ziffer sichtbar auf dem Knopf, ist er seine Taste: keine zweite Marke daneben.
      // Nennt nur data-taste das Zeichen (etwa N für „Nomen“), bleibt die Marke.
      const sichtbar = (a.knopf.firstChild?.textContent || a.knopf.textContent).trim().toLowerCase();
      if (a.key && !a.stelle && sichtbar === a.key) delete a.knopf.dataset.marke;
      else a.knopf.dataset.marke = a.code ? ktName(a.code) : a.shift ? "⇧" + a.key.toUpperCase() : a.key.toUpperCase();
      a.knopf.setAttribute("aria-keyshortcuts", a.code ? ktName(a.code) : (a.shift ? "Shift+" : "") + a.key.toUpperCase());
    }
  }

  /**
   * Gibt den Knöpfen in box (oder der Liste knoepfe) Kurztasten. Die Bausteine rufen es selbst; Spiele mit eigenen
   * Antwortknöpfen rufen es, wenn die Knöpfe stehen. data-taste am Knopf nennt sein Zeichen, wo der Text es nicht ist.
   */
  function kurztasten(box, knoepfe, { reihe = false } = {}) {
    const liste = [...(knoepfe || box.querySelectorAll("button"))];
    if (!liste.length) return;
    const zeichen = liste.map(ktZeichen);
    const verschieden = new Set(zeichen.map(z => z.toLowerCase())).size === zeichen.length;
    const woerter = liste.map(ktWort);
    const jaNein = woerter.every(w => KT_WORT[w]) && new Set(woerter).size === woerter.length;
    let tasten;
    // reihe: das Spiel verlangt die Grundreihe (gleiche Zeichen meinen verschiedene Plätze, Stellen-Detektiv)
    if (reihe) tasten = liste.slice(0, KT_REIHE.length).map((knopf, i) => ({ knopf, code: KT_REIHE[i] }));
    else if (verschieden && zeichen.every(z => KT_FEST[z])) tasten = liste.map((knopf, i) => ({ knopf, code: KT_FEST[zeichen[i]].code, zeichen: KT_FEST[zeichen[i]].zeichen }));
    else if (jaNein) tasten = liste.map((knopf, i) => ({ knopf, key: KT_WORT[woerter[i]] }));
    else if (verschieden && zeichen.every(z => KT_STELLEN[z])) tasten = liste.map((knopf, i) => ({ knopf, key: KT_STELLEN[zeichen[i]][0], shift: !!KT_STELLEN[zeichen[i]][1], stelle: true }));
    // Einzelne Buchstaben oder Ziffern sind selbst die Taste, auch doppelte (Buchstabier-Kacheln „apple“): dann wählt
    // die Taste den ersten noch freien Knopf mit diesem Zeichen (ktFinde).
    else if (zeichen.every(z => /^[\p{L}\d]$/u.test(z))) tasten = liste.map((knopf, i) => ({ knopf, key: zeichen[i].toLowerCase(), ziffer: /\d/.test(zeichen[i]) }));
    else tasten = liste.slice(0, KT_REIHE.length).map((knopf, i) => ({ knopf, code: KT_REIHE[i] }));
    const g = { box, tasten };
    // Baut ein Spiel die Knöpfe in derselben Box neu auf, ersetzt die neue Gruppe die alte.
    for (let i = ktGruppen.length - 1; i >= 0; i--) if (ktGruppen[i].box === box) ktGruppen.splice(i, 1);
    ktGruppen.push(g);
    ktBeschriften(g);
  }

  const ktSichtbar = k => k.isConnected && !k.disabled && k.offsetParent !== null && getComputedStyle(k).visibility !== "hidden";

  /** Knopf zur Taste: die jüngste sichtbare Gruppe zuerst. */
  function ktFinde(e) {
    for (let i = ktGruppen.length - 1; i >= 0; i--) {
      const g = ktGruppen[i];
      if (!g.box.isConnected) { ktGruppen.splice(i, 1); continue; }
      for (const a of g.tasten) {
        // schon gelegt oder gewählt (Kachel, Reihe): bei doppelten Zeichen kommt der nächste freie dran
        if (!ktSichtbar(a.knopf) || a.knopf.classList.contains("gewaehlt") || a.knopf.getAttribute("aria-disabled") === "true") continue;
        if (a.code ? e.code === a.code || a.zeichen?.includes(e.key)
          : e.key.toLowerCase() === a.key && (!a.stelle || a.shift === e.shiftKey) && !(a.ziffer && aktiveTastatur?.element.isConnected)) return a.knopf;
      }
    }
    return null;
  }

  // Marken zeigen: am Computer mit Maus gleich, sonst ab dem ersten echten Tastendruck (gemerkt auf dem Gerät).
  function ktMarkenZeigen(merken) {
    document.documentElement.classList.add("mit-tasten");
    if (merken) try { localStorage.setItem("lernspiele:tasten", "1"); } catch { /* ohne Speicher: nur diese Seite */ }
  }
  try {
    if (matchMedia("(hover: hover) and (pointer: fine)").matches || localStorage.getItem("lernspiele:tasten")) ktMarkenZeigen(false);
  } catch { /* kein matchMedia/Speicher (Testumgebung) */ }

  document.addEventListener("keydown", (e) => {
    if (ktAus || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target?.closest?.("input, textarea, select, [contenteditable]")) return;
    if (e.isTrusted && !document.documentElement.classList.contains("mit-tasten") && e.key.length === 1) ktMarkenZeigen(true);
    const k = ktFinde(e);
    if (!k) return;
    e.preventDefault();
    k.click();
  });

  // ---------- Bereit machen: ▶ Los, 3-2-1 (Wunsch Patrik, LERN_Session8) ----------

  /**
   * Für Aufgaben, die etwas nur kurz zeigen (einprägen, aufblitzen): Erst ist element verdeckt. Bei der ersten
   * Aufgabe einer Runde, nach einer Aufgabe mit Fehler und im Mix (ctx.losKnopf) steht darüber „▶ Los!“; nach dem
   * Tippen zählt es 3, 2, 1 herunter. Sonst erscheint nur kurz 👀 (LERN-38). Dann wird element sichtbar und
   * weiter(uhrLos) läuft (dort startet das Spiel seine Zeigezeit). Die Uhr wartet so lange (F1 a, LERN_Session9):
   * Sie startet nach weiter() — oder mit { uhr: false } erst, wenn das Spiel uhrLos() ruft (Merk-Blick: wenn
   * das veränderte Bild erscheint). element muss schon in der Fläche hängen. Wird die Aufgabe inzwischen
   * ersetzt, passiert nichts mehr.
   */
  const AUFPASSEN_MS = 1000;
  const BLITZ_HOECHSTENS_MS = 8000; // losGehts mit antwortenNachBlitz: spätestens dann die Antworten zeigen
  function losGehts(ctx, element, weiter, { zaehlen = 3, uhr = true, antwortenNachBlitz = false } = {}) {
    const uhrStart = ctx.uhrWarten();
    // antwortenNachBlitz (Bemerkung 7, LERN_Session11): Antworten verdeckt, bis das Spiel mit dem zweiten Argument von
    // weiter() meldet, dass das Aufblitzen vorbei ist — sonst vergleicht das Kind während des Blitzes. Erst dann läuft die
    // Uhr (F1 a). Ruft das Spiel es nicht, zeigt der Rahmen sie spätestens nach BLITZ_HOECHSTENS_MS.
    let antwortenDa = !antwortenNachBlitz;
    const blitzVorbei = () => {
      if (antwortenDa) return;
      antwortenDa = true;
      ctx.flaeche.classList.remove("antworten-warten");
      if (uhr) uhrStart();
    };
    if (antwortenNachBlitz) ctx.flaeche.classList.add("antworten-warten");
    const uhrLos = antwortenNachBlitz ? () => {} : uhrStart;
    const huelle = el("div", { class: "los-huelle wartet" });
    element.replaceWith(huelle);
    const zahl = el("div", { class: "los-zahl" });
    const ueber = el("div", { class: "los-ueber" }, zahl);
    huelle.append(element, ueber);
    const noch = () => ctx.flaeche.contains(huelle) && !ctx.vorbei();
    const zeigen = () => {
      if (!noch()) return;
      huelle.classList.remove("wartet");
      ueber.remove();
      weiter(uhrLos, blitzVorbei);
      if (uhr) uhrLos();
      if (antwortenNachBlitz) setTimeout(() => { if (ctx.flaeche.contains(huelle)) blitzVorbei(); }, BLITZ_HOECHSTENS_MS);
    };
    const zaehle = n => {
      if (!noch()) return;
      if (n === 0) return zeigen();
      zahl.textContent = String(n);
      ton("tipp");
      setTimeout(() => zaehle(n - 1), 800);
    };
    if (!ctx.losKnopf) {
      zahl.textContent = "👀";
      setTimeout(zeigen, AUFPASSEN_MS);
      return;
    }
    const los = el("button", { type: "button", class: "knopf gruen los-knopf", text: "▶ Los!", "aria-label": "Los, ich bin bereit",
      onclick: () => { los.remove(); zaehle(zaehlen); } });
    ueber.prepend(los);
  }

  // ---------- Flug in einen Korb ----------

  /**
   * Eine Kopie von 'quelle' fliegt auf geradem, also meist schrägem Weg in die Mitte von 'ziel'
   * (den gewählten Korb). verstecken: die Quelle selbst dabei ausblenden (eine Karte, nicht ein
   * markiertes Wort im Satz).
   */
  function fliegen(quelle, ziel, verstecken = true) {
    const von = quelle.getBoundingClientRect();
    const nach = ziel.getBoundingClientRect();
    const stil = getComputedStyle(quelle);
    const flug = quelle.cloneNode(true);
    flug.classList.add("flug");
    Object.assign(flug.style, {
      left: `${von.left}px`, top: `${von.top}px`, width: `${von.width}px`, height: `${von.height}px`,
      fontSize: stil.fontSize, fontWeight: stil.fontWeight,
    });
    document.body.append(flug);
    if (verstecken) quelle.style.visibility = "hidden";
    const dx = nach.left + nach.width / 2 - (von.left + von.width / 2);
    const dy = nach.top + nach.height / 2 - (von.top + von.height / 2);
    void flug.offsetWidth; // Startpunkt festhalten, damit der Übergang greift
    flug.style.transform = `translate(${dx}px, ${dy}px) scale(.3)`;
    flug.style.opacity = "0";
    setTimeout(() => flug.remove(), 800);
  }

  // ---------- Auswahlknöpfe und Reihenfolge (für Spiele mit Antwort per Antippen) ----------

  // ---------- Bilder (Entscheid B1 a, LERN_Session16; rahmen.md Abschnitt 22) ----------
  /** Ist das Bild eine Zeichnung aus der Bildersammlung („svg:<name>“) statt eines Emojis? */
  const istZeichnung = b => typeof b === "string" && b.startsWith("svg:");
  /**
   * Bild als Element: ein Emoji als Text, „svg:<name>“ gezeichnet aus spiele/gemeinsam/bilder.js (die Seite lädt sie).
   * Fehlt die Sammlung oder der Name, steht „❔“ und die Konsole meldet es (das Testskript wertet das als Fehler).
   */
  function bild(b, klasse = "bild") {
    if (!istZeichnung(b)) return el("span", { class: klasse, text: b || "" });
    const z = typeof BILDER !== "undefined" ? BILDER[b.slice(4)] : null;
    if (!z) {
      console.error(`Bild ${b} fehlt${typeof BILDER === "undefined" ? " (bilder.js nicht geladen)" : " in bilder.js"}`);
      return el("span", { class: klasse, text: "❔" });
    }
    return el("span", { class: `${klasse} gezeichnet`, html: `<svg viewBox="${z.box}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${z.svg}</svg>` });
  }
  /**
   * Zelle einer Prüfansicht: Text, in dem jedes „svg:<name>“ als Zeichnung erscheint (z. B. „svg:waschbrett / Waschbrett“).
   * Gibt ein <td> zurück; title nennt den Rohtext, damit sich Bild und Name abgleichen lassen.
   */
  function zelleMitBildern(text, klasse = "") {
    // Farbe als Inhalt (etwa die Glacesorten): Feld in der Farbe vor dem Code (Bemerkung 36, LERN_Session30)
    const code = String(text ?? "").trim();
    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(code)) {
      const feld = el("span", { class: "pruef-farbfeld", "aria-hidden": "true" });
      feld.style.background = code;
      return el("td", { class: `${klasse} pruef-farbe`.trim() }, feld, code);
    }
    const teile = String(text ?? "").split(/(svg:[a-z0-9-]+)/);
    if (teile.length === 1) return el("td", { class: klasse, text: teile[0] });
    // Nur ein Bild: gross (Bildspalte); Bilder im Text: so gross wie die Emojis daneben
    const allein = teile.length === 3 && !teile[0].trim() && !teile[2].trim();
    return el("td", { class: `${klasse} ${allein ? "pruef-bild" : "pruef-text-bild"}`.trim(), title: text },
      ...teile.map((t, i) => (i % 2 ? bild(t) : t)).filter(t => t !== ""));
  }
  /** Bild vor einem Text in Fliesstext (Lösungssatz, Ablage): Emoji davor, eine Zeichnung entfällt. */
  const mitBildText = (b, text) => (b && !istZeichnung(b) ? `${b} ${text}` : text);

  /** Knopfinhalt: Text, Element oder { bild, text, klein }. */
  function wahlInhalt(knopf, inhalt) {
    if (inhalt instanceof Node || typeof inhalt !== "object") { knopf.append(inhalt); return; }
    if (inhalt.bild) knopf.append(bild(inhalt.bild));
    if (inhalt.text) knopf.append(el("span", { text: inhalt.text }));
    if (inhalt.klein) knopf.append(el("small", { text: inhalt.klein }));
  }

  const wackeln = k => { k.classList.remove("falsch"); void k.offsetWidth; k.classList.add("falsch"); };

  /**
   * Auswahlknöpfe mit genau einer richtigen Antwort; hängt sie an ctx.flaeche an.
   * opt.optionen: Werte; opt.richtig: richtiger Wert (Vergleich mit ===)
   * opt.inhalt(wert): Knopfinhalt (Text, Element oder { bild, text, klein }), Vorgabe der Wert selbst
   * opt.hinweis(wert): Hinweis nach falscher Wahl (Text oder Funktion des gewählten Werts)
   * opt.loesung: Lösungstext nach dem dritten Fehlversuch
   * opt.lob, opt.erklaerung: Rückmeldung bei richtiger Antwort nach einem Fehlversuch (Bestätigung, Begründung); auf
   *   Anhieb zeigt der Rahmen nur ein Lob aus seiner Liste (LB1 a, WZ2 a) — siehe ctx.richtig
   * opt.breite: Mindestbreite der Knöpfe (px)
   * opt.beiRichtig(knopf): zusätzlich bei richtiger Antwort, z. B. einen Ton vorspielen
   */
  /** Lösung für die Testhilfe: opt.loesung, sonst der richtige Wert, wenn er ein einfacher Wert ist. */
  const loesungFuer = (opt, wert) => opt.loesung || (["string", "number"].includes(typeof wert) ? String(wert) : null);

  function auswahl(ctx, opt) {
    ctx.loesung(loesungFuer(opt, opt.richtig));
    ctx.schritte(1, true);
    const box = el("div", { class: "wahl" });
    if (opt.breite) box.style.setProperty("--wahl-breite", opt.breite + "px");
    let fertig = false;
    for (const wert of opt.optionen) {
      const k = el("button", { type: "button", class: "wahl-knopf" });
      wahlInhalt(k, opt.inhalt ? opt.inhalt(wert) : String(wert));
      k.addEventListener("click", () => {
        if (fertig || k.classList.contains("gewaehlt")) return;
        if (wert === opt.richtig) {
          fertig = true;
          k.classList.add("richtig");
          if (opt.beiRichtig) opt.beiRichtig(k);
          ctx.richtig(opt.lob, opt.erklaerung);
          return;
        }
        wackeln(k);
        k.classList.add("gewaehlt");
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    }
    ctx.flaeche.append(box);
    kurztasten(box);
    return box;
  }

  /**
   * Teile der Reihe nach antippen; jedes richtig getippte Teil wandert in die Ablage.
   * opt.reihe: Werte in richtiger Reihenfolge (gezeigt werden sie gemischt)
   * opt.inhalt(wert), opt.hinweis(wert, erwartet), opt.loesung, opt.lob wie bei auswahl
   * opt.ablage(wert): Text des Teils in der Ablage, Vorgabe der Wert selbst
   * opt.pfeile: zwischen den gelegten Teilen „→“ zeigen; opt.beiRichtig() wie bei auswahl
   */
  function reihenfolge(ctx, opt) {
    ctx.loesung(opt.loesung || opt.reihe.map(w => (opt.ablage ? opt.ablage(w) : String(w))).join(" → "));
    ctx.schritte(opt.reihe.length, true);
    const ablage = el("div", { class: "ablage", "aria-live": "polite" });
    const box = el("div", { class: "wahl" });
    if (opt.breite) box.style.setProperty("--wahl-breite", opt.breite + "px");
    let pos = 0;
    let fertig = false;
    for (const wert of mische(opt.reihe)) {
      const k = el("button", { type: "button", class: "wahl-knopf" });
      wahlInhalt(k, opt.inhalt ? opt.inhalt(wert) : String(wert));
      k.addEventListener("click", () => {
        if (fertig || k.classList.contains("gewaehlt")) return;
        // Gleiche Werte dürfen mehrfach vorkommen: zählt, ob der Wert an der Reihe ist.
        if (wert === opt.reihe[pos]) {
          pos++;
          k.classList.add("gewaehlt");
          ton("tipp");
          if (opt.pfeile && pos > 1) ablage.append(el("span", { class: "pfeil", text: "→" }));
          const teil = opt.ablage ? opt.ablage(wert) : String(wert);
          ablage.append(istZeichnung(teil) ? bild(teil) : el("span", { text: teil })); // Zeichnung aus der Bildersammlung (B1 a)
          if (pos === opt.reihe.length) { fertig = true; if (opt.beiRichtig) opt.beiRichtig(); ctx.richtig(opt.lob, opt.erklaerung); }
          return;
        }
        wackeln(k);
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert, opt.reihe[pos]) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    }
    ctx.flaeche.append(ablage, box);
    kurztasten(box);
    return { ablage, box };
  }

  const KORB_FARBEN = ["var(--deko-6)", "var(--deko-3)", "var(--deko-5)", "var(--deko-2)", "var(--deko-1)", "var(--deko-4)"];

  /**
   * Karte und Körbe: Die Karte (Bild und Name) gehört in genau einen Korb; bei richtiger Wahl
   * fliegt sie hinein. Hängt Karte und Körbe an ctx.flaeche an.
   * opt.karte: { bild, text } der Karte
   * opt.koerbe: Werte der Körbe; opt.korbInhalt(wert): { bild, text, klein }; opt.farbe(wert, i): CSS-Farbe
   * opt.richtig, opt.hinweis(wert), opt.loesung, opt.lob wie bei auswahl
   */
  function koerbe(ctx, opt) {
    ctx.loesung(opt.loesung || opt.korbInhalt?.(opt.richtig)?.text || loesungFuer(opt, opt.richtig));
    ctx.schritte(1, true);
    const karte = el("div", { class: "korb-karte" },
      opt.karte.bild ? bild(opt.karte.bild) : null, el("b", { text: opt.karte.text }));
    const box = el("div", { class: "korb-reihe" });
    let fertig = false;
    opt.koerbe.forEach((wert, i) => {
      const k = el("button", { type: "button", class: "korb-knopf" });
      wahlInhalt(k, opt.korbInhalt ? opt.korbInhalt(wert) : String(wert));
      k.style.setProperty("--k", opt.farbe ? opt.farbe(wert, i) : KORB_FARBEN[i % KORB_FARBEN.length]);
      k.addEventListener("click", () => {
        if (fertig) return;
        if (wert === opt.richtig) {
          fertig = true;
          fliegen(karte, k);
          ctx.richtig(opt.lob, opt.erklaerung);
          return;
        }
        wackeln(k);
        ctx.falsch(typeof opt.hinweis === "function" ? opt.hinweis(wert) : opt.hinweis, opt.loesung);
        if (ctx.vorbei()) fertig = true;
      });
      box.append(k);
    });
    ctx.flaeche.append(karte, box);
    kurztasten(box);
    return { karte, box };
  }

  // ---------- Rahmen eines Spiels ----------

  /** Schwierigkeitsskala, bezogen auf die Basisklasse des Spiels (Katalog, Feld 'klasse'):
      Stufe 3 ist das Lernziel der Basisklasse, 2 leichter und 4 schwerer in derselben Klasse,
      1 eine Klasse tiefer, 5 eine Klasse höher. Die Königsstufe ist der Endgegner: besonders
      herausfordernd, über alles hinweg. (Entscheid Patrik 2026-10-31) */
  const SKALA = [
    { id: "s1", nr: 1, icon: "🌱", name: "Einstieg",       rel: -1,  farbe: "var(--deko-5)" },
    { id: "s2", nr: 2, icon: "🌿", name: "Üben",           rel: 0,   zusatz: "leichter", farbe: "var(--deko-6)" },
    { id: "s3", nr: 3, icon: "🌳", name: "Klassenziel",    rel: 0,   farbe: "var(--deko-4)" },
    { id: "s4", nr: 4, icon: "⭐", name: "Knifflig",       rel: 0,   zusatz: "schwerer", farbe: "var(--deko-3)" },
    { id: "s5", nr: 5, icon: "🚀", name: "Nächste Klasse", rel: 1,   farbe: "var(--deko-1)" },
    { id: "s6", nr: 6, icon: "👑", name: "Königsstufe",    rel: null, farbe: "var(--deko-2)" },
  ];

  const klasseText = k => (k <= 0 ? "Kindergarten" : `${k}. Klasse`);

  // Was gerade gespielt wird ({ spiel, stufe?, nr?, aufgabe?() }), für die Bemerkungen im Entwickler-Modus.
  let spielStand = null;

  /** Für wen ist die Stufe? „2. Klasse, leichter“ — aus der Basisklasse des Spiels. */
  function stufeFuer(spielId, stufeId) {
    const st = SKALA.find(s => s.id === stufeId);
    if (!st) return "";
    if (st.rel === null) return "Endgegner";
    const b = basisKlasse(spielId);
    if (!b) return st.name;
    return klasseText(b + st.rel) + (st.zusatz ? `, ${st.zusatz}` : "");
  }

  const LOB = ["Super!", "Genau richtig!", "Toll gemacht!", "Prima!", "Stark!", "Richtig! 🎉", "Bravo!"];
  const LOB_MAX = 20; // Länge eines eigenen Lobs (def.lob, LB2 a): länger ist es eine Erklärung

  function sterneFuer(fehler) {
    if (fehler <= 1) return 3;
    if (fehler <= 4) return 2;
    return 1;
  }

  function sterneText(n) {
    return "★".repeat(n) + "☆".repeat(3 - n);
  }

  /**
   * Startet ein Spiel.
   * def.id, def.titel, def.einleitung
   * def.stufen: { s1: "Beschreibung", …, s6: "…" } — welche Stufen der SKALA das Spiel anbietet
   * def.anzahl: Aufgaben je Runde
   * def.aufgabe(ctx): zeichnet Aufgabe ctx.nr in ctx.flaeche. Ruft ctx.richtig() oder
   *   ctx.falsch(hinweis, loesungText) auf. ctx.sag(text) lässt die Eule sprechen.
   * def.lob: eigene Lobliste für richtig auf Anhieb statt LOB (LB2 a: Lob in der Fremdsprache, etwa ["Great!", "Yes!"]);
   *   nur reines Lob, jedes höchstens LOB_MAX Zeichen — sonst gilt LOB (und die Konsole sagt es)
   */
  function spiel(def) { return nachBereit(() => spielJetzt(def)); }
  /** Ein Spiel starten, wenn Runden, Rekorde, Meldungen und Löschvermerke geladen sind (Kern 1.34.0; spiel). */
  function spielJetzt(def) {
    if (typeof STIL !== "undefined") STIL.anwenden(); // Stil um die Runde herum (Einstellung stil)
    // Abschluss-Animation nur aus dem Katalog (Entscheide GS1 a, SK1 a, LERN_Session32): dort ist sie die einzige Quelle,
    // damit auch die Startseite das Kartenbild zeichnen kann; Daten eines Spiels nennt sie beim Namen (feier.karte).
    if (def.feier) console.error(`${def.id}: feier steht im Katalog, nicht in der Seite (GS1 a)`);
    def.feier = katalogEintrag(def.id)?.feier || null;
    const buehne = document.querySelector(".buehne");
    const eigenesLob = Array.isArray(def.lob) && def.lob.length && def.lob.every(t => typeof t === "string" && t.trim() && t.length <= LOB_MAX);
    if (def.lob && !eigenesLob) console.warn(`${def.id}: def.lob ist keine Liste kurzer Lobe (höchstens ${LOB_MAX} Zeichen) — es gilt LOB`);
    const lobListe = eigenesLob ? def.lob : LOB;
    const stufenListe = SKALA.filter(s => def.stufen[s.id]).map(s => ({ ...s, text: def.stufen[s.id] }));
    spielStand = { spiel: def.id };
    // Spiele mit Stimme starten erst, wenn sie geladen ist (spielMitStimme) — oft nach DOMContentLoaded. Die
    // Entwickler-Leiste wartet deshalb auf dieses Ereignis statt nur auf das Laden der Seite (LERN_Session11).
    document.dispatchEvent(new Event("lernspiele:spiel"));
    tonSchalter(document.querySelector(".kopf .ton"));
    // ❓ Hilfe zur Bedienung (Entscheid T3 a, LERN_Session9): in der Kopfzeile, auch auf der Stufenwahl.
    const tonKnopf = document.querySelector(".kopf .ton");
    tonKnopf?.before(el("button", { type: "button", class: "hilfe-knopf", text: "❓", "aria-label": "Hilfe: So geht das Spiel", title: "So geht das Spiel", onclick: () => hilfeFenster(def) }));
    // Kam beim Abgleich etwas von einem anderen Gerät dazu: die Stufenwahl mit Sternen und Ranglisten neu zeichnen.
    addEventListener("lernspiele:abgeglichen", () => { if (buehne.querySelector(".stufen")) stufenwahl(); });

    // Angemeldet wird nur auf der Startseite (Entscheid L1 a); dorthin führt auch „wechseln“.
    const START = "../../index.html";

    /** Darf es losgehen? Sonst eine Karte: erst anmelden, oder das Spiel ist noch nicht freigegeben. */
    function zugang() {
      if (aktuellerSpieler() && spielSichtbar(def.id)) return true;
      buehne.innerHTML = "";
      const karte = el("div", { class: "karte mitte" });
      const eule = euleZeile();
      karte.append(eule.element, el("div", { class: "knopfzeile" },
        el("a", { class: "knopf", href: aktuellerSpieler() ? START : `${START}#anmelden`, text: "Zur Startseite" })));
      buehne.append(karte);
      eule.sag(aktuellerSpieler() ? "Dieses Spiel ist noch nicht freigegeben. Such dir auf der Startseite ein anderes aus!"
        : "Hallo! Melde dich zuerst auf der Startseite an.");
      return false;
    }

    function spielerZeile() {
      const name = aktuellerSpieler();
      return el("div", { class: "spieler-zeile" },
        el("span", { text: "Du spielst als " }),
        avatarBild(name, 30),
        el("b", { text: spielerName(name) }),
        el("a", { class: "link", href: `${START}#anmelden`, text: "wechseln" }));
    }

    /** Schalter „Mit Timer“ für dieses Spiel; die Sekunden je Stufe stellt man im Profil ein. */
    function timerZeile(neuZeichnen) {
      const name = aktuellerSpieler();
      const an = stufenListe.some(st => timerFuer(name, def.id, st.id).an);
      const fest = istFest(name, "timer");
      // Symbol wie auf den Kacheln und das Wort dazu (FB2 a, LERN_Session32): hier lernt das Kind, was die Uhr heisst
      return el("div", { class: "timer-zeile" },
        fest
          ? el("span", { class: "timer-schalter aufsicht-fest" + (an ? " an" : ""), title: FEST_TEXT }, "🔒 ", schalterSymbol("uhr", an), an ? " Timer an" : " Timer aus")
          : el("button", {
            type: "button", class: "timer-schalter" + (an ? " an" : ""), "aria-pressed": String(an),
            onclick: () => { waehleTimer(name, def.id, !an); ton("tipp"); neuZeichnen(); },
          }, schalterSymbol("uhr", an), an ? " Timer an" : " Timer aus"),
        el("span", { class: "leise", text: fest ? FEST_TEXT : an ? "Jede Aufgabe hat eine Zeit. Ist sie um, zählt es als Fehler." : "Für mehr Spannung: Timer einschalten." }));
    }

    /**
     * Schalter „Teile: nach Stufe / geordnet / gemischt“ für Spiele mit `reihenfolge: true` im Katalog
     * (Entscheid R1 a, LERN_Session6); schreibt die Wahl des Kindes (VR1 a), die Vorgabe steht im Profil.
     */
    function reihenfolgeZeile(neuZeichnen) {
      if (typeof SPIELE === "undefined" || !SPIELE.find(s => s.id === def.id)?.reihenfolge) return null;
      const name = aktuellerSpieler();
      return optionsZeile({
        titel: "🔀 Teile:", wert: reihenfolgeFuer(name, def.id), fest: istFest(name, "reihenfolge"),
        werte: { stufe: "nach Stufe", geordnet: "geordnet", gemischt: "gemischt" },
        erklaerung: {
          stufe: "Stufe 1–3 geordnet, ab Stufe 4 gemischt.",
          geordnet: "Grösste Stelle links, kleinste rechts.",
          gemischt: "Die Teile stehen durcheinander. Das ist kniffliger.",
        },
      }, k => setzeWahl(name, "reihenfolge", def.id, k), neuZeichnen);
    }

    /** Eine Zeile mit Knöpfen je Wert, der gewählte gefüllt, darunter leise, was er heisst; o.fest: nur der Wert mit 🔒. */
    function optionsZeile(o, setze, neuZeichnen) {
      if (o.fest) return el("div", { class: "option-zeile" },
        el("b", { text: o.titel }),
        el("span", { class: "option-schalter an aufsicht-fest", title: FEST_TEXT, text: `🔒 ${o.werte[o.wert]}` }),
        el("span", { class: "leise", text: `${o.erklaerung[o.wert]} ${FEST_TEXT}` }));
      return el("div", { class: "option-zeile" },
        el("b", { text: o.titel }),
        ...Object.entries(o.werte).map(([k, text]) => el("button", {
          type: "button", class: "option-schalter" + (k === o.wert ? " an" : ""), "aria-pressed": String(k === o.wert),
          onclick: () => { setze(k); ton("tipp"); neuZeichnen(); },
        }, text)),
        el("span", { class: "leise", text: o.erklaerung[o.wert] }));
    }

    /** Spieloptionen aus def.optionen (z. B. Übertrag selbst schreiben), je eine Zeile auf der Stufenwahl. */
    function spielOptionsZeilen(neuZeichnen) {
      const name = aktuellerSpieler();
      return Object.entries(def.optionen || {}).map(([id, o]) => optionsZeile({ ...o, wert: optionFuer(name, def.id, id) },
        k => setzeOption(name, def.id, id, k), neuZeichnen));
    }

    /** Schalter „Vorlesen: gleich / auf Knopfdruck“ (Wunsch Patrik, LERN_Session8); gilt wie im Profil für alle Spiele. */
    function vorlesenZeile(neuZeichnen) {
      if (!vorlesenErlaubt(def.id)) return null;
      const name = aktuellerSpieler();
      return optionsZeile({
        titel: "🗣️ Vorlesen:", wert: vorlesenArt(name), fest: istFest(name, "vorlesen"),
        werte: { auto: "gleich", knopf: "auf Knopfdruck" },
        erklaerung: {
          auto: "Die Eule liest jede Aufgabe und jeden Tipp gleich vor. 🔇 oben schaltet alles stumm.",
          knopf: "Die Eule liest vor, wenn du auf 🗣️ neben ihr tippst.",
        },
      }, k => setzeWahl(name, "vorlesen", null, k), neuZeichnen);
    }

    /** Vorschau des Schlussbilds (?feier=): Animation der Stufe mit den Sternen aus ?sterne, „Nochmal“ spielt sie neu. */
    function feierVorschau(stufe) {
      const sterne = Math.max(1, Math.min(3, Number(adresse.get("sterne")) || 3));
      const ruhig = adresse.get("ruhig") === "1" ? true : undefined; // sonst „Bewegung reduzieren“ des Geräts
      const zeichne = () => {
        buehne.innerHTML = "";
        const f = LS_FEIER.zeige(def.feier, { stufe: stufe.id, sterne, klang: ton, ...(ruhig ? { ruhig } : {}) });
        buehne.append(el("div", { class: "karte mitte", "data-vorschau": "feier" },
          el("div", { class: "auftrag", text: `Vorschau · Stufe ${stufe.nr} · ${"★".repeat(sterne)}` }),
          f || el("p", { class: "leise-text", text: "Für diese Stufe gibt es keine Animation." }),
          el("div", { class: "knopfzeile" }, el("button", { type: "button", class: "knopf hell", text: "↻ Nochmal", onclick: zeichne }))));
      };
      zeichne();
    }

    /** „🎧 Diese Runde braucht Ton“ (AN3-T a): mit „Ton für diese Runde an“ weiter, sonst zurück zur Stufenwahl. */
    function tonHinweis(weiter) {
      buehne.innerHTML = "";
      const eule = euleZeile();
      buehne.append(el("div", { class: "karte" }, eule.element,
        el("div", { class: "auftrag", text: "🎧 Diese Runde braucht Ton — mit Kopfhörern spielen" }),
        el("div", { class: "knopfzeile" },
          el("button", { type: "button", class: "knopf gruen", "data-aktion": "ton-fuer-runde", text: "🔊 Ton für diese Runde an",
            onclick: () => { tonFuerRunde = true; weiter(); } }),
          el("button", { type: "button", class: "knopf hell", text: "Zurück", onclick: () => stufenwahl() }))));
      eule.sag("Gerade ist Ruhezeit. Mit Kopfhörern kannst du trotzdem spielen — nach der Runde ist der Ton wieder still.");
    }

    function stufenwahl() {
      if (!zugang()) return;
      tonFuerRunde = false; // „Ton für diese Runde an“ gilt nur bis zum Ende der Runde (AN3-T a)
      buehne.innerHTML = "";
      aktuellePause = null; // keine Aufgabe, die eine Hilfe anhalten müsste
      hilfeGezaehlt = null;
      const name = aktuellerSpieler();
      // data-stil-bereich: um die Runde herum gilt der Stil (STIL, SP1 Patrik LERN_Session32)
      const karte = el("div", { class: "karte", "data-stil-bereich": "stufenwahl" });
      const eule = euleZeile();
      karte.append(spielerZeile(), eule.element, timerZeile(stufenwahl), vorlesenZeile(stufenwahl) || "", reihenfolgeZeile(stufenwahl) || "", ...spielOptionsZeilen(stufenwahl));
      // Stimmen des Spiels (def.stimme) und fürs Vorlesen sichtbar, mit Probe (LERN_Session11)
      const sprachen = [...new Set([def.stimme, vorlesenErlaubt(def.id) ? "de" : null].filter(Boolean))];
      if (sprachen.length) karte.append(stimmenZeile(sprachen));
      stimmFehlerHoerer = stimmFehlerFuer(eule);
      eule.sag(def.einleitung);
      const stufen = el("div", { class: "stufen" });
      for (const st of stufenListe) {
        const beste = besteSterne(name, def.id, st.id);
        const timer = timerFuer(name, def.id, st.id);
        // aria-label: was langes Drücken vorliest (Vorlesen auf dem Startblatt, Wunsch Patrik LERN_Session8)
        const empfohlen = st.id === empfohleneStufe(name, def.id);
        const aufsichtHier = aufsichtAngemeldet();
        // Stufe wie ein Level (FB2 a, LERN_Session32): gross Symbol und Nummer, darunter der Name, drei Sterne (auch die
        // nicht erreichten) und als Untertitel, für wen sie ist. Den Lehrplantext der Stufe sieht das Kind über ⓘ und
        // hört ihn mit langem Drücken; die Aufsicht sieht ihn offen.
        const knopf = el("button", { class: "stufe", type: "button", onclick: () => runde(st),
          "aria-label": `Stufe ${st.nr}, ${st.name}. ${stufeFuer(def.id, st.id)}${empfohlen ? ", für dich empfohlen" : ""}. ${st.text}` },
          el("div", { class: "stufe-kopf" }, el("span", { class: "stufe-symbol", text: st.icon }), el("span", { class: "stufe-nr", text: String(st.nr) })),
          el("div", { class: "stufe-name", text: st.name }),
          el("div", { class: "sterne-gross", "aria-hidden": "true", html: `<span style="color:#f5b301">${"★".repeat(beste)}</span><span class="aus">${"★".repeat(3 - beste)}</span>` }),
          el("div", { class: "fuer", text: stufeFuer(def.id, st.id) + (empfohlen ? " · 👍 für dich" : "") }),
          aufsichtHier ? el("span", { class: "stufe-text", text: st.text }) : null,
          timer.an ? el("div", { class: "fuer", style: "margin-top:4px", text: `⏱ ${timer.sekunden} s je Aufgabe` }) : null);
        knopf.style.setProperty("--farbe", st.farbe);
        const huelle = el("div", { class: "stufe-huelle" }, knopf);
        if (!aufsichtHier) {
          const text = el("div", { class: "stufe-text blase-klein", hidden: true, text: st.text });
          const info = el("button", { type: "button", class: "stufe-info", "aria-expanded": "false", "aria-label": `Was übt Stufe ${st.nr}?`, title: "Was übt diese Stufe?", text: "ⓘ",
            onclick: () => { text.hidden = !text.hidden; info.setAttribute("aria-expanded", String(!text.hidden)); } });
          huelle.append(info, text);
        }
        stufen.append(huelle);
      }
      karte.append(stufen);
      // Ähnliche Spiele (Wunsch Patrik, LERN_Session10): die Startseite zeigt sie als Liste (start/spiele.js, ?aehnlich=).
      karte.append(el("div", { class: "knopfzeile" }, hatRegeln(def.id) ? regelnLink(false) : null,
        el("a", { class: "knopf hell klein", href: `${START}?aehnlich=${def.id}#spiele`, text: "🔗 Ähnliche Spiele" })));
      // Inhalte prüfen (LP1 a, LP4 a, LERN_Session11): Aufsicht, Lehrperson und Entwicklung sehen je eigene Liste des
      // Spiels einen Knopf, sobald das Spiel eine pruefung.js hat; ?pruefen=<liste> öffnet sie gleich (Verwaltung).
      const eigeneListen = spielListen(def.id).filter(l => !l.von);
      if (eigeneListen.length && (istAufsicht(name) || LS.entwicklung?.aktiv?.())) {
        ladeSkript("pruefung.js").then(() => {
          const defs = pruefungDefinition(def.id);
          if (!defs || !document.body.contains(karte)) return;
          const mit = eigeneListen.filter(l => defs[l.id]);
          if (mit.length) karte.append(el("div", { class: "knopfzeile pruef-zeile" }, el("span", { class: "leise", text: "🔍 Inhalte prüfen:" }),
            ...mit.map(l => el("button", { type: "button", class: "knopf hell klein", text: `${l.geprueft ? "✓" : "○"} ${l.name}`, onclick: () => listenPruefen(def.id, l.id) }))));
          const gefragt = new URLSearchParams(location.search).get("pruefen");
          if (gefragt && mit.some(l => l.id === gefragt)) listenPruefen(def.id, gefragt);
        }).catch(() => { /* noch keine Prüfansicht für dieses Spiel */ });
      }
      // Vorlesen auf dem Startblatt: 🗣️ liest die Einleitung, langes Drücken einen Stufenknopf — nur auf
      // Knopfdruck; automatisch liest die Eule nur im Spiel selbst (Vorgabe Patrik, LERN_Session8).
      if (vorlesenErlaubt(def.id)) {
        const einleitung = () => sprich(fuerStimme(def.einleitung), "de", "", null, "vorlesen");
        const einrichten = ok => {
          if (!ok) return;
          eule.element.append(el("button", { type: "button", class: "vorlesen", text: "🗣️", "aria-label": "Vorlesen", onclick: einleitung }));
          langDruecken(karte);
        };
        // Kommt die Stimme erst später, nur noch einrichten, wenn das Startblatt noch zu sehen ist.
        if (stimme("de")) einrichten(true); else stimmeBereit("de").then(ok => document.body.contains(karte) && einrichten(ok));
      }
      // Endlos: so viele wie möglich bis zum ersten Fehler — nur Stufen mit genug verschiedenen Aufgaben (Katalog).
      const endlosListe = stufenListe.filter(st => endlosStufen(def.id).includes(st.id));
      if (endlosListe.length) {
        const mitTimer = st => timerFuer(name, def.id, st.id).an;
        karte.append(el("div", { class: "endlos-wahl" },
          el("b", { class: "endlos-titel" }, schalterSymbol("endlos", true), " Endlos — wie viele schaffst du ohne Fehler?"),
          el("span", { class: "leise", text: "Mit Timer wird die Zeit nach jeder richtigen Aufgabe etwas knapper." }),
          el("div", { class: "endlos-knoepfe" }, ...endlosListe.map(st => {
            const rekord = besterRekord(name, def.id, st.id, mitTimer(st));
            const k = el("button", { class: "knopf hell klein", type: "button", onclick: () => runde(st, true) },
              `${st.icon} ${st.nr}`, el("small", { text: rekord ? ` · Rekord ${rekord}` : "" }));
            return k;
          })),
          // Vollständige Ranglisten je Endlos-Stufe, ohne und mit Timer (Wunsch Patrik 2026-10-31).
          ...endlosListe.filter(st => ranglisteFuer(def.id, st.id, false).length || ranglisteFuer(def.id, st.id, true).length)
            .map(st => el("div", { class: "ranglisten" }, el("b", { text: `${st.icon} Stufe ${st.nr}` }),
              rangliste(def.id, st.id, false, name, Infinity), rangliste(def.id, st.id, true, name, Infinity)))));
      }
      buehne.append(karte);
    }

    /** Text der Aufgabe, wie das Kind sie sieht — fürs Protokoll. */
    function aufgabenText(flaeche) {
      return [...flaeche.querySelectorAll(".auftrag, .vorgabe, .raetsel, .bausteine, .zahl-gross, .zahl-ziffern, .rechnung, .satz, .wortkarte, .lueckenwort, .frage, .ziel-zahl, .auf, .sachtext, .theke, .familie, .digital")]
        .map(e => e.innerText.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" · ")
        .slice(0, 240);
    }

    /**
     * Eine Runde. endlos (Vorgabe Patrik 2026-10-31): Aufgaben, bis die erste falsch ist oder die Zeit
     * um ist; gezählt werden die richtigen. Rekord je Spieler, Spiel, Stufe und mit/ohne Timer.
     * mix (Entscheid M1 a, LERN_Session5): Das Spiel läuft im iframe des Zufallsmix (mix.html) und stellt
     * eine Aufgabe nur, wenn der Mix sie verlangt; das Ergebnis meldet es zurück. Serie, Ende, Protokoll
     * und Rekord führt der Mix. mix = { timer: true/false }.
     */
    function runde(stufe, endlos = false, mix = null) {
      if (!zugang()) return;
      // Ruhezeit für das Hören (AN3-T a): ein Spiel, das Ton braucht, fragt vor der Runde nach Kopfhörern (im Mix nicht:
      // der Mix nimmt solche Spiele in der Ruhezeit nicht)
      if (!mix && !tonFuerRunde && tonSpielRuht(def.id)) return tonHinweis(() => runde(stufe, endlos, mix));
      const name = aktuellerSpieler();
      const timer = mix ? { ...timerFuer(name, def.id, stufe.id), an: mix.timer } : timerFuer(name, def.id, stufe.id);
      let nr = 0;
      // Endlos: richtig gelöste Aufgaben zählt der Kern (L.geschafft)
      const startSekunden = endlos ? vorgabeZeit(def.id, stufe.id) : timer.sekunden; // Endlos: für alle gleich
      // Mix: Die Aufgabe darf erst gezeichnet werden, wenn der Mix sie verlangt (freigabe). Im Endlos-Mix
      // zählt für die knapper werdende Zeit die Serie über alle Spiele (mixGeschafft).
      let mixFreigabe = false;
      let mixGeschafft = 0;
      let mixGemeldet = 0;      // Aufgaben, deren Ergebnis schon an den Mix ging
      let mixBereit = false;
      let mixVorher = null;     // Stand von Fehlern und Hilfen vor der Aufgabe
      const anMix = daten => parent.postMessage({ lern: "mix", spiel: def.id, ...daten }, "*");
      // Ablauf im Kern (KERN.runde.lauf, AR1 a; RA1–RA4 a, RA7 a): zählt Versuche und Fehler (Zeit um ist einer), misst die
      // Zeit je Aufgabe ab „bereit“ ohne Pausen, sagt, wann die Lösung kommt und die Serie vorbei ist, und baut Eintrag und
      // Rekord mit einer Liste je Aufgabe (bis LERN_Session18: aufgabenZeiten und fehlerAufgaben). Oberfläche, Uhr, Lob
      // und Sterne bleiben hier.
      const L = KERN.runde.lauf({ endlos, anzahl: endlos || mix ? Infinity : def.anzahl });
      let uhr = null;            // laufender Timer der aktuellen Aufgabe
      let aufgabeLauf = 0;       // zählt die gestellten Aufgaben; ein später Uhrstart der vorigen (ctx.uhrWarten) bleibt wirkungslos
      // Wiederholungen (Vorgabe Patrik 2026-10-31; RA5 a, RA6 a, KERN.runde.auswahl): In einer Runde kommt höchstens eine
      // Aufgabe ein zweites Mal, nie direkt hintereinander. Gibt die Stufe nicht genug verschiedene Aufgaben her, endet
      // die Runde früher (anzahl wird kleiner). Endlos: keine Aufgabe zweimal; findet sich keine neue mehr, ist alles
      // geschafft (bis LERN_Session18: keine der letzten 30).
      let anzahl = endlos || mix ? Infinity : def.anzahl;
      // Gedächtnis über Runden (Wunsch Patrik, LERN_Session11; RA5 a): je Person, Spiel und Stufe die Fingerabdrücke der
      // schon gestellten Aufgaben, auch für Serien. Eine Aufgabe kommt erst wieder, wenn (fast) alle verschiedenen einmal
      // dran waren; dann beginnt ein neuer Durchgang. Nur dieses Gerät, höchstens 400 je Stufe. Bis LERN_Session18 nach
      // dem Namen statt der Kennung der Person — der alte Schlüssel wird übernommen.
      const wer = person(name);
      const wahl = KERN.runde.auswahl({ endlos, gedaechtnis: KERN.runde.gedaechtnis({ speicher: { lies, schreibe },
        schluessel: `${wer ? wer.id : name}|${def.id}/${stufe.id}`, alt: wer ? [`${name}|${def.id}/${stufe.id}`] : [] }) });
      let allesGeschafft = false;
      const mitTimer = timer.an ? startSekunden : null; // Endlos: Startzeit des Rekords oder null
      let rekordVorher = null; // Endlos: bisheriger Rekord, sobald diese Runde gespeichert ist
      let rundeGespeichert = false;
      buehne.innerHTML = "";

      const punkte = el("div", { class: "fortschritt" + (endlos ? " endlos" : "") });
      if (endlos) punkte.textContent = "♾ 0";
      else for (let i = 0; i < def.anzahl; i++) punkte.append(el("span"));
      const karte = el("div", { class: "karte" });
      const flaeche = el("div");
      // Notizen (NZ1 a): wurden in dieser Aufgabe Notizfelder angeboten, und hat das Kind eines benutzt?
      let notizAngeboten = false;
      let notizBenutzt = false;
      let blockBenutzt = false; // Notizblock (NB3 a): hat das Kind darin geschrieben?
      // Auftrag statt altem Lob (Hinweis Patrik, LERN_Session13): sagt ein Spiel beim Stellen nichts, zeigt die Eule
      // den Auftrag, den es zuletzt beim Stellen gesagt hat — nie „Richtig wäre …“ der vorigen neben einer neuen Aufgabe.
      let letzterAuftrag = "";
      let gesagtBeimZeichnen = false;
      flaeche.addEventListener("input", e => { if (e.target?.classList?.contains("zw-notiz") && e.target.value.trim()) notizBenutzt = true; });
      const eule = euleZeile({ kuerzen: true });
      stimmFehlerHoerer = stimmFehlerFuer(eule);
      const zeitleiste = el("div", { class: "zeitleiste", "aria-hidden": "true" }, el("div", { class: "zeitbalken" }));
      // Testhilfen (Entscheid T2 a): nur beim Testspieler; wirken auf die gerade gezeigte Aufgabe.
      const test = istAufsicht(name);
      let hilfen = 0;
      let bedienhilfe = 0; // ❓ Hilfe in dieser Runde geöffnet (nur notiert)
      hilfeGezaehlt = () => { bedienhilfe++; };
      let jetzt = null; // { loesung(): Text oder null, ueberspringen() } der aktuellen Aufgabe
      const loesungKnopf = el("button", { type: "button", class: "knopf hell klein", text: "🔑 Lösung zeigen", onclick: () => {
        const text = jetzt?.loesung();
        hilfen++;
        eule.sag(text ? `🔑 ${text}` : "🔑 Dieses Spiel nennt seine Lösung erst nach drei Fehlversuchen.", "hinweis");
      } });
      const weiterKnopf = el("button", { type: "button", class: "knopf hell klein", text: "⏭ Aufgabe überspringen", onclick: () => { hilfen++; jetzt?.ueberspringen(); } });
      // Vorlesen: Knopf 🔊 neben der Eule; automatisch liest sie jede neue Aufgabe und jeden Tipp vor.
      // Während eine Aufgabe gezeichnet wird, schweigt sie (sonst doppelt: Tipp und dann Tipp mit Auftrag).
      // Die Stimmen lädt der Browser oft erst nach; kommt die Stimme nach der ersten Aufgabe, liest die Eule
      // diese nachträglich.
      let zeichnet = false;
      let gezeigt = false; // steht schon eine Aufgabe?
      let blaseNeu = false; // hat die Eule in der laufenden Aufgabe etwas gesagt?
      // Ist die Stimme schon da, sofort einrichten (so auch im Testskript), sonst sobald sie geladen ist.
      const vorlesenEinrichten = ok => {
        if (!ok) return;
        const auto = vorlesenArt(name) === "auto";
        const auftrag = () => [...flaeche.querySelectorAll(".frage, .auftrag")]
          .filter(e => !e.parentElement.closest(".frage, .auftrag")).map(e => e.textContent.trim()).filter(Boolean);
        const satz = t => (/[.!?…:]$/.test(t) ? t : `${t}.`);
        // Die Blase nur, wenn die Eule in dieser Aufgabe etwas gesagt hat — sonst steht dort noch das Lob der
        // vorigen, und es käme zweimal (Meldung Patrik, LERN_Session8).
        const text = auftragAuch => fuerStimme([blaseNeu ? eule.blase.textContent.trim() : "", ...(auftragAuch ? auftrag() : [])]
          .filter(Boolean).map(satz).join(" "));
        const lies = () => sprich(text(true), "de", "", null, "vorlesen");
        // Automatisch liest die Eule den Auftrag nur, wenn er anders lautet als bei der vorigen Aufgabe: Bleibt
        // die Frage gleich („Wohin geht die Melodie?“), kennt das Kind sie schon (Meldung Patrik, LERN_Session11).
        // 🗣️ liest ihn immer. fertig: wenn die Stimme fertig ist (ctx.nachAnsage).
        let zuletztGelesen = null;
        const liesNeu = fertig => {
          const jetzt = auftrag().join(" ");
          const neu = jetzt !== zuletztGelesen;
          zuletztGelesen = jetzt;
          sprich(text(neu), "de", "", fertig, "vorlesen");
        };
        // 🗣️ statt 🔊: Das Lautsprecher-Zeichen ist der Ton-Schalter in der Kopfzeile.
        eule.element.append(el("button", { type: "button", class: "vorlesen", text: "🗣️", "aria-label": "Vorlesen", onclick: lies }));
        eule.beiSag = (t, art) => { blaseNeu = true; if (auto && !zeichnet) sprich(fuerStimme(t), "de", art, null, "vorlesen"); };
        if (auto) { eule.vorlesen = liesNeu; if (gezeigt) liesNeu(); }
        if (knoepfeVorlesen(def.id)) langDruecken(flaeche);
      };
      if (vorlesenErlaubt(def.id)) {
        if (stimme("de")) vorlesenEinrichten(true);
        else stimmeBereit("de").then(vorlesenEinrichten);
      }
      // Eule oben, damit ihre Rückmeldung auch auf kleinen Bildschirmen neben der Aufgabe sichtbar bleibt.
      karte.append(eule.element);
      // Fehler melden (LERN_Session9): „🙋 Melden“ neben der Eule (Entscheid K1 a: sich melden wie in der Schule). Die Runde merkt sich die laufende und die vorige
      // Aufgabe samt dem, was das Kind angetippt oder eingetippt hat — damit die Meldung nachvollziehbar ist.
      let eingaben = [];
      let laufendeAufgabe = () => null;
      let abgeschlossen = null; // die zuletzt beendete Aufgabe; wird mit der nächsten zur „vorigen“
      let vorigeAufgabe = null;
      // Ein Hörer am Dokument (nicht an der Fläche: die soll nicht selbst als antippbar gelten).
      eingabeHoerer = ev => {
        const k = ev.target?.closest?.("button");
        if (!k || !flaeche.contains(k) || k.closest(".tipp-zeile")) return; // 💡 ist keine Eingabe
        // OK der Zifferntastatur: das Getippte zählt, nicht das „OK“
        const anzeige = /^\s*(OK|✓)/.test(k.textContent || "") ? flaeche.querySelector(".anzeige")?.textContent?.trim() : "";
        const was = (anzeige || k.getAttribute("aria-label") || k.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
        if (was) { eingaben = [...eingaben, was].slice(-6); if (L.offen) L.eingabe(was); }
      };
      // Eigene kleine Zeile unter der Eule: neben der Blase würde das Wort sie auf dem Handy zu schmal machen.
      // Davor der Platz für „📝 Notizblock“ (NB2 a): immer an derselben Stelle, nicht im Aufbau des Spiels.
      const blockPlatz = el("span", { class: "nb-platz" });
      // Platz für den Balken der Rückmeldung (WZ1 a) fest in dieser Zeile, links (Hinweis Patrik, LERN_Session14): Früher kam
      // eine eigene Leiste unter die Eule und ging wieder weg — die Aufgabe rutschte jedes Mal hinunter und hinauf.
      const weiterPlatz = el("div", { class: "weiter-leiste" });
      const werkzeugZeile = el("div", { class: "melde-zeile" }, weiterPlatz, blockPlatz);
      if (meldenErlaubt(name)) {
        werkzeugZeile.append(el("button", { type: "button", class: "melden", text: "🙋 Melden", "aria-label": "Fehler melden", title: "Fehler im Spiel melden",
          onclick: () => meldeFormular({ name, spiel: def.id, stufe: stufe.id, jetzt: laufendeAufgabe(), vorige: vorigeAufgabe }) }));
      }
      karte.append(werkzeugZeile);
      /**
       * Knopf „📝 Notizblock“ zeigen (NB2 a), wenn die Einstellung ihn in dieser Stufe erlaubt (Standard ab Stufe 4) und
       * notizblock.js geladen ist. Gerufen beim Stellen und, wenn ein Spiel Notizen oder den Block erst in einem späteren
       * Schritt anbietet, in diesem Moment (Meldung Patrik, LERN_Session14: im Probe-Stempel fehlte er deshalb).
       */
      const blockKnopfZeigen = () => {
        if (typeof SCHRIFTLICH === "undefined" || blockPlatz.childElementCount || einstellung("notizen") === "nie") return;
        const e = einstellung("notizblock");
        if (e === "immer" || (e === "stufe" && Number(stufe.id.slice(1)) >= 4))
          blockPlatz.replaceChildren(SCHRIFTLICH.knopf(() => { blockBenutzt = true; }));
      };
      if (test) karte.append(el("div", { class: "testhilfe" }, el("span", { text: "🧪 Test" }), loesungKnopf, weiterKnopf));
      if (timer.an) karte.append(zeitleiste);
      karte.append(flaeche);
      // Tipp (Entscheide T1 a, T3 a, LERN_Session9): unter der Aufgabe, nur wenn das Spiel Tipps mitgibt
      // (ctx.tipp), nie im Endlos-Modus. Ein Tipp zählt für die Sterne wie ein halber Fehler; „auf Anhieb“
      // heisst ohne Tipp. Die Uhr läuft weiter.
      let tippsRunde = 0;
      let tippGeben = () => {};
      // Entscheide BH2 a und BH2-T a (LERN_Session13, ersetzen den Ort aus T1 a): 💡 beim Antwortbereich, ohne eigene
      // Zeile — die lag auf kleinen Bildschirmen oft unter dem Rand. Den Ort wählt platziereTipp() je Aufgabe.
      const tippKnopf = el("button", { type: "button", class: "tipp-knopf", text: "💡", "aria-label": "Tipp", title: "Tipp", onclick: () => tippGeben() });
      const tippZeile = el("span", { class: "tipp-zeile" }, tippKnopf);
      tippZeile.hidden = true;
      /**
       * Mit Zifferntastatur eine Taste in ihrer untersten Reihe; sonst rechts in der letzten Zeile „auftrag“ oder
       * „frage“ (der Text fliesst darum herum); fehlen beide, rechts oben in der Spielfläche. Nie unter den Antworten,
       * damit niemand ihn für eine Antwort hält.
       */
      const platziereTipp = () => {
        // Noch keine Aufgabe in der Fläche (Mix wartet): 💡 nicht hineinlegen
        if (![...flaeche.children].some(c => c !== tippZeile)) { tippZeile.remove(); return; }
        const t = flaeche.querySelector(".tastatur");
        if (t) {
          tippZeile.className = "tipp-zeile in-tastatur";
          if (tippZeile.parentElement !== t) t.append(tippZeile);
          return;
        }
        // nur Zeilen direkt in der Fläche: eine „frage“ in einer Karte (Znüni-Teller) liesse 💡 aus der Karte ragen
        const fragen = flaeche.querySelectorAll(":scope > .auftrag, :scope > .frage");
        // data-tipp-ziel: das Spiel nennt die Zeile selbst (Frage in einer eigenen Hülle, Kompass, Plan-Leser)
        const ziel = flaeche.querySelector("[data-tipp-ziel]") || fragen[fragen.length - 1] || flaeche;
        tippZeile.className = "tipp-zeile schwebt";
        if (ziel.firstChild !== tippZeile) ziel.prepend(tippZeile);
        // Ist die Zeile kürzer als 💡, ragte er unten heraus und machte die Antworten darunter schmaler: Die Zeile
        // umschliesst ihn (nur bei gewöhnlichen Blöcken, damit Flex- und Rasterzeilen des Spiels bleiben, wie sie sind).
        if (getComputedStyle(ziel).display === "block") ziel.style.display = "flow-root";
      };
      buehne.append(punkte, karte);

      /** Mix: Ergebnis der letzten Aufgabe melden — oder, vor der ersten, dass das Spiel bereit ist. */
      function meldeMix() {
        // zeit: der Eintrag der Aufgabe aus der Liste des Kerns (RA4 a; mit Fehler auch text, loesung, eingaben)
        const zeit = L.liste[mixGemeldet];
        if (!zeit) {
          if (!mixBereit) { mixBereit = true; anMix({ typ: "bereit" }); }
          return;
        }
        mixGemeldet++;
        anMix({ typ: "ergebnis", zeit, fehler: L.fehler - mixVorher.fehler, hilfen: hilfen - mixVorher.hilfen });
      }

      function naechste() {
        clearTimeout(uhr);
        if (mix && !mixFreigabe) return meldeMix();
        mixFreigabe = false;
        mixVorher = { fehler: L.fehler, hilfen };
        if (nr >= anzahl) return endlos ? schlussEndlos() : schluss();
        if (endlos) punkte.textContent = `♾ ${L.geschafft}`;
        else [...punkte.children].forEach((p, i) => {
          p.classList.toggle("fertig", i < nr);
          p.classList.toggle("aktiv", i === nr);
        });
        flaeche.innerHTML = "";
        flaeche.classList.remove("antworten-warten"); // LS.losGehts: eine vorige Aufgabe kann mitten im Blitz geendet haben
        let versuche = 0;
        let erledigt = false;
        let zeitUm = false;
        let loesungGemerkt = ""; // Lösung, die das Spiel bei einem Fehlversuch nannte (für eine Fehlermeldung)
        let loesungVorab = null; // vom Spiel mit ctx.loesung() genannt, für die Testhilfe
        let eigeneKennung = null; // vom Spiel mit ctx.kennung() genannt, gegen Wiederholungen
        let schritte = 0; // Handgriffe der Aufgabe (ctx.schritte), für den Boden der Endlos-Zeit
        let schritteFest = false; // gestellt: die Zahl gilt (HG1 a)
        let warten = 0;   // Sekunden, in denen das Kind nur warten kann (ctx.wartezeit): so viel später startet die Uhr
        let uhrWartet = false; // startet die Uhr erst auf ctx.uhrWarten() hin?
        let zug = 0; // zählt die Züge beim Zeichnen; eine verworfene Fassung startet die Uhr nicht
        let serien = {};  // Merkmale dieser Aufgabe (ctx.serie): Name → Wert
        let vorgehen = null; // wie das Kind vorging (ctx.vorgehen): Art → Wert, für die Statistik
        notizAngeboten = false;
        notizBenutzt = false;
        blockBenutzt = false;
        if (typeof SCHRIFTLICH !== "undefined") SCHRIFTLICH.schliessen(); // jede Aufgabe beginnt mit leerem Block
        blockPlatz.replaceChildren();
        let ansagen = [];    // ctx.nachAnsage: Töne und Stimmen des Spiels, die auf Lob und Vorlesen warten
        let angesagt = false;
        let bereit = null; // ab wann das Kind antworten kann (performance.now()); ab da laufen Uhr und Zeitmessung (L.bereit)
        let uhrEnde = null;   // wann die Zeit um ist, solange die Uhr läuft (performance.now())
        let pauseSeit = null; // Hilfe oder Melden offen: seit wann (die Zeit der Aufgabe hält der Kern an: L.pause)
        let restMs = null;    // Restzeit der Uhr während einer Pause
        let tipps = [];       // gestufte Tipps dieser Aufgabe (ctx.tipp); nie die Lösung
        let tippsGenutzt = 0; // geholte Tipps dieser Aufgabe (zählen für die Sterne)
        let tippRueckruf = null; // ctx.tipp(texte, beiTipp)
        let tippPos = 0;      // nächster Tipp der aktuellen Liste
        const lauf = ++aufgabeLauf;
        // Fehler melden: diese Aufgabe so, wie das Kind sie gerade sieht; die beendete davor wird zur „vorigen“.
        const meineNr = nr;
        let ergebnisText = "noch nicht beantwortet";
        vorigeAufgabe = abgeschlossen;
        eingaben = [];
        const aufgabeJetzt = () => ({ nr: meineNr, text: aufgabenText(flaeche), loesung: loesungVorab || loesungGemerkt || "",
          eingabe: eingaben.join(" → "),
          ergebnis: erledigt || !versuche ? ergebnisText : `noch offen, ${versuche} Fehlversuch${versuche === 1 ? "" : "e"} als falsch gewertet` });
        laufendeAufgabe = aufgabeJetzt;
        // „▶ Los!“ (LS.losGehts) bei der ersten Aufgabe, nach einer Aufgabe mit Fehler und im Mix (dort kommt
        // dazwischen meist ein anderes Spiel); sonst nur kurz 👀 (LERN-38).
        const vorige = L.liste.at(-1);
        const losKnopf = mix || !vorige || !vorige.geloest || vorige.versuche > 0 || vorige.zeitUm;
        pruefung.haken?.("aufgabe", { nr });

        /**
         * Felder des Eulenpfads je Aufgabe an den Kern, vor jeder Meldung, die die Aufgabe abschliessen kann: geholte Tipps,
         * Vorgehen (ctx.vorgehen) mit Notizen (NZ1 a: nur wo sie angeboten waren — „ohne“ zählt für das Abzeichen
         * „Kopfrechner“; NB3 a: „block“ geht vor „benutzt“).
         */
        const zusatzJetzt = () => {
          const v = notizAngeboten ? { ...vorgehen, notiz: blockBenutzt ? "block" : notizBenutzt ? "benutzt" : "ohne" } : vorgehen;
          L.zusatz({ ...(tippsGenutzt ? { tipps: tippsGenutzt } : {}), ...(v ? { vorgehen: v } : {}) });
        };

        /** Oberfläche nach dem Abschluss einer Aufgabe (gemessen und eingetragen hat der Kern). */
        const abschliessen = (geloest, uebersprungen = false) => {
          clearTimeout(uhr);
          // Balken dort anhalten, wo er gerade steht.
          const balken = zeitleiste.firstChild;
          balken.style.width = getComputedStyle(balken).width;
          balken.style.transition = "none";
          uhrEnde = null;
          tippZeile.hidden = true;
          tippsRunde += tippsGenutzt;
          // Für eine Fehlermeldung: wie die Aufgabe gewertet wurde, und sie als „vorige“ für die nächste merken.
          ergebnisText = uebersprungen ? "übersprungen" : geloest
            ? (versuche ? `richtig nach ${versuche} Fehlversuch${versuche === 1 ? "" : "en"}` : "richtig") + (zeitUm ? ", Zeit um" : "")
            : `nicht gelöst, Lösung gezeigt nach ${versuche} Fehlversuch${versuche === 1 ? "" : "en"}`;
          abgeschlossen = aufgabeJetzt();
        };

        jetzt = {
          loesung: () => loesungVorab,
          ueberspringen() {
            // Gelöst oder aufgelöst: es geht ohnehin gleich bzw. mit „Weiter“ weiter.
            if (erledigt) return;
            erledigt = true;
            zusatzJetzt();
            L.uebersprungen();
            abschliessen(false, true);
            nr++;
            naechste();
          },
        };

        /** Balken voll und still, solange die Uhr noch nicht läuft. */
        function balkenVoll() {
          const balken = zeitleiste.firstChild;
          zeitleiste.classList.remove("um");
          balken.style.transition = "none";
          balken.style.width = "100%";
          return balken;
        }

        // Uhr und Zeitmessung beginnen, wenn das Kind antworten kann (Entscheide F1 a, F2 a, LERN_Session9):
        // gleich nach dem Zeichnen, nach der Wartezeit (ctx.wartezeit: vorgespielte Töne) oder erst auf
        // ctx.uhrWarten() hin (LS.losGehts: nach „▶ Los!“, 3-2-1 und Zeigen; Stimme fertig). Wer wartet,
        // verliert keine Zeit. Spielt das Spiel seine Töne erst nach der Ansage (ctx.nachAnsage), zählt die
        // Wartezeit ab dann.
        function bereitMachen() {
          if (timer.an) balkenVoll();
          if (uhrWartet) return;
          if (warten > 0 && ansagen.length) ansagen.push(() => { uhr = setTimeout(starteUhr, warten * 1000); });
          else if (warten > 0) uhr = setTimeout(starteUhr, warten * 1000);
          else starteUhr();
        }

        // Im Endlos-Modus hängt die Zeit an den Handgriffen der Aufgabe.
        // Gleiche Startzeit für alle, je gelöste Aufgabe knapper (ENDLOS_TEMPO).
        function starteUhr() {
          if (erledigt || bereit !== null || lauf !== aufgabeLauf) return;
          bereit = performance.now();
          if (L.offen) L.bereit(); // ab hier zählt die Zeit der Aufgabe (RA7 a)
          pruefung.haken?.("uhr", { nr });
          if (!timer.an) return;
          const sekunden = endlos ? endlosSekunden(startSekunden, mix ? mixGeschafft : L.geschafft, schritte) : timer.sekunden;
          // Balken läuft per CSS-Übergang von voll auf leer; der Fehler zählt einmal, die Aufgabe bleibt offen.
          const balken = balkenVoll();
          void balken.offsetWidth;
          balken.style.transition = `width ${sekunden}s linear`;
          balken.style.width = "0%";
          uhrEnde = performance.now() + sekunden * 1000;
          uhr = setTimeout(zeitIstUm, sekunden * 1000);
          if (endlos) punkte.textContent = `♾ ${L.geschafft} · ⏱ ${sekundenText(sekunden)}`;
        }
        function zeitIstUm() {
          if (erledigt) return;
          uhrEnde = null;
          zeitUm = true;
          zusatzJetzt();
          const z = L.zeitUm({ text: aufgabenText(flaeche) }); // ein Fehler; in einer Serie ist sie vorbei
          zeitleiste.classList.add("um");
          ton("falsch");
          if (z.vorbei) return endlosVorbei("⏰ Die Zeit ist um!");
          eule.sag("⏰ Die Zeit ist um! Mach die Aufgabe trotzdem fertig.", "hinweis");
        }

        // Pause für Hilfe und Melden (Wunsch Patrik, LERN_Session9): Die Uhr hält an und die Aufgabe ist
        // verdeckt, damit niemand in der Pause weiterdenkt; die Pause zählt nicht zur Zeit der Aufgabe.
        // Ein Tipp pausiert nicht — er ist gleich da.
        function pausiere() {
          if (pauseSeit !== null) return;
          pauseSeit = performance.now();
          if (L.offen) L.pause();
          flaeche.classList.add("pause-verdeckt");
          if (uhrEnde !== null && !erledigt) {
            clearTimeout(uhr);
            restMs = Math.max(0, uhrEnde - pauseSeit);
            const balken = zeitleiste.firstChild;
            balken.style.width = getComputedStyle(balken).width;
            balken.style.transition = "none";
          }
        }
        function fortsetzen() {
          if (pauseSeit === null) return;
          const jetztMs = performance.now();
          if (L.offen) L.weiter();
          pauseSeit = null;
          flaeche.classList.remove("pause-verdeckt");
          if (restMs !== null && !erledigt) {
            const balken = zeitleiste.firstChild;
            void balken.offsetWidth;
            balken.style.transition = `width ${restMs / 1000}s linear`;
            balken.style.width = "0%";
            uhrEnde = jetztMs + restMs;
            uhr = setTimeout(zeitIstUm, restMs);
          }
          restMs = null;
        }
        aktuellePause = { an: pausiere, aus: fortsetzen };

        /** Den nächsten Tipp in der Eulenblase zeigen; der Knopf sagt, ob noch einer kommt. */
        const zeigeTippKnopf = () => {
          tippZeile.hidden = endlos || erledigt || !tipps.length;
          if (!tippZeile.hidden) platziereTipp();
          tippKnopf.disabled = tippPos >= tipps.length;
          const tippText = tippPos >= tipps.length ? "Keine Tipps mehr" : tippPos ? "Noch ein Tipp" : "Tipp";
          tippKnopf.setAttribute("aria-label", tippText);
          tippKnopf.title = tippText;
        };
        tippGeben = () => {
          if (erledigt || tippPos >= tipps.length) return;
          const text = tipps[tippPos++];
          tippsGenutzt++;
          ton("tipp");
          eule.sag(`💡 ${text}`, "hinweis");
          pruefung.haken?.("tipp", { nr, hinweis: text, flaeche, vorab: loesungVorab });
          zeigeTippKnopf();
          tippRueckruf?.(tippPos - 1, tippPos >= tipps.length);
        };

        /** Endlos: erste falsche Antwort oder Zeit um — Lösung zeigen, dann zum Ergebnis. */
        function endlosVorbei(text) {
          erledigt = true;
          abschliessen(false);
          if (!mix) speichereEndlos(); // zählt sofort, auch wenn das Kind „Zum Ergebnis“ nicht mehr antippt
          const loesung = loesungVorab;
          eule.sag(`${text}${loesung ? ` Schau mal: ${loesung}` : ""}`, "hinweis");
          // Im Mix führt „Weiter“ zurück zum Mix; er zeigt das Ergebnis der ganzen Serie.
          const weiter = el("button", { class: "knopf", type: "button", text: mix ? "Weiter ➜" : "Zum Ergebnis ➜", onclick: mix ? naechste : schlussEndlos });
          flaeche.append(el("div", { class: "knopfzeile" }, weiter));
          weiter.focus();
        }

        spielStand = { spiel: def.id, stufe: stufe.id, nr, aufgabe: () => aufgabenText(flaeche) };
        const ctx = {
          stufe: stufe.id,
          geordnet: geordnet(name, def.id, stufe.id),
          /** Wert einer Spieloption aus def.optionen für diese Stufe („nach Stufe“ schon aufgelöst). */
          option: id => optionWert(name, def, id, stufe.id),
          nr,
          flaeche,
          losKnopf, // LS.losGehts: „▶ Los!“ und 3-2-1 (true) oder nur kurz 👀
          /**
           * Uhr und Zeitmessung starten nicht gleich nach dem Zeichnen, sondern erst, wenn die zurückgegebene
           * Funktion gerufen wird: das Kind kann jetzt antworten (LS.losGehts; Stimme fertig, LS.sprich mit
           * fertig). Beim Zeichnen rufen; wirkt einmal, auch wenn mehrere warten.
           */
          uhrWarten() {
            uhrWartet = true;
            const meinZug = zug;
            return () => { if (meinZug === zug) starteUhr(); };
          },
          sag: (t, art) => {
            // Was das Spiel beim Stellen sagt, ist sein Auftrag: Er ersetzt bei späteren Aufgaben das Lob der vorigen.
            if (zeichnet) { gesagtBeimZeichnen = true; if (!art) letzterAuftrag = t; }
            eule.sag(t, art);
          },
          /**
           * fn erst rufen, wenn die Eule fertig ist: Lob der vorigen Aufgabe ausgesprochen, Auftrag vorgelesen
           * (falls automatisch). Für alles, was ein Spiel beim Zeichnen vorspielt oder vorspricht (Melodie,
           * Hörtext) — sonst überlagern sich die Stimmen oder die Eule bricht den Hörtext ab. Ohne Stimme
           * kurz nach dem Zeichnen; nach einem Neuziehen der Aufgabe nie.
           */
          nachAnsage(fn) { if (angesagt) fn(); else ansagen.push(fn); },
          /** Lösung der Aufgabe gleich beim Zeichnen nennen (Text wie loesungText); zeigt sie nur die Testhilfe. */
          loesung(text) { loesungVorab = text || null; },
          /**
           * Woran diese Aufgabe zu erkennen ist, wenn man es nicht sieht (Hör-Aufgaben: die Melodie).
           * Ohne Angabe nimmt der Rahmen Text und Bilder der Fläche; dient der Regel gegen Wiederholungen.
           */
          kennung(wert) { eigeneKennung = wert == null ? null : String(wert); },
          /**
           * Ein zufällig gewähltes Merkmal der Aufgabe, das das Kind als Muster erkennen kann: Richtung,
           * Aufgabenart, Antwort bei wenigen festen Antworten (ja/nein, <, =, >). Der Rahmen zieht neu,
           * statt dasselbe Merkmal öfter als SERIE_MAX-mal hintereinander zu stellen. Nur angeben, wo die
           * Stufe wirklich mehrere Werte hat.
           */
          serie(name, wert) { serien[name] = String(wert); },
          /**
           * Wie das Kind die Aufgabe angegangen ist (systematisch, in Paaren, mit Umwegen …). Vor
           * ctx.richtig() melden; landet in der Liste je Aufgabe (liste) und in der Statistik („Vorgehen“). Die Arten
           * und ihre Werte stehen in AUSWERTUNG.VORGEHEN (auswertung.js).
           */
          vorgehen(art, wert) { vorgehen = { ...vorgehen, [art]: String(wert) }; },
          /**
           * Notizfelder anbieten? (NZ1 a) empfohlen: ob das Spiel sie bei „nach Stufe“ zeigt (ab welcher Stufe oder
           * Schrittzahl Kopfrechnen vor allem das Merken prüft). Gibt zurück, ob das Spiel Felder (LS.notizFeld) zeigt.
           */
          notizen(empfohlen) {
            const e = einstellung("notizen");
            const an = e === "immer" || (e === "stufe" && !!empfohlen);
            if (an) { notizAngeboten = true; if (schritteFest) blockKnopfZeigen(); }
            return an;
          },
          /**
           * Nur den Notizblock anbieten, ohne Notizfelder (LERN_Session14): wo es kein Zwischenergebnis gibt, aber ein
           * schriftliches Verfahren hilft (Probe-Stempel: 98 107 − 27 346). empfohlen wie bei notizen; „Notizen: nie“
           * schaltet auch den Block ab. Zählt fürs Vorgehen wie Notizen (im Kopf / mit Notizblock).
           */
          notizblock(empfohlen) {
            const e = einstellung("notizen");
            const an = e !== "nie" && !!empfohlen;
            if (an) { notizAngeboten = true; if (schritteFest) blockKnopfZeigen(); }
            return an;
          },
          /**
           * Diese Aufgabe braucht n Handgriffe mehr (Tipps, Ziffern samt OK, Züge) — wie viele mindestens,
           * wer sie fehlerfrei löst. Die Bausteine zählen ihre selbst; Pflicht in Endlos-Stufen.
           */
          // Entscheid HG1 a (LERN_Session13): Mit dem Stellen der Aufgabe gilt die Zahl fest — Uhr und Testskript
          // haben sie dann gelesen. Ein Baustein, der erst danach entsteht (zweiter Schritt), zählt nicht mehr;
          // ein späterer Aufruf des Spiels selbst ist ein Fehler, den das Testskript meldet.
          schritte(n, vomBaustein) {
            if (!schritteFest) { schritte += n; return; }
            if (!vomBaustein) pruefung.haken?.("schritteSpaet", { nr, n });
          },
          /**
           * Die Aufgabe hält das Kind s Sekunden auf, ohne dass es etwas tun kann (gleich vorgespielte Töne):
           * Uhr und Zeitmessung beginnen so viel später.
           */
          wartezeit(s) { warten += s; },
          /**
           * Tipps zur Aufgabe, vom kleinen Anstoss zum grösseren (Text oder Liste; Entscheid T2 a). Das Kind holt
           * sie mit „💡 Tipp“ einzeln; keiner verrät die Lösung (das Testskript prüft es). Beim Zeichnen rufen.
           */
          // Auch später aufrufbar (zweiter Schritt einer Aufgabe): neue Tipps beginnen wieder beim ersten, gezählt
          // werden alle geholten. beiTipp(i, letzter): gerufen, nachdem Tipp i gezeigt ist — für Tipps mit Bild
          // (Steine fangen zeigt beim letzten die Freiheiten; LERN_Session11).
          tipp(texte, beiTipp = null) {
            tipps = [].concat(texte).filter(t => typeof t === "string" && t.trim());
            tippRueckruf = beiTipp;
            tippPos = 0;
            if (!zeichnet) zeigeTippKnopf();
          },
          /** Ist die Aufgabe gelöst oder nach drei Fehlversuchen aufgelöst? Dann nimmt sie keine Antwort mehr an. */
          vorbei: () => erledigt,
          /**
           * Richtige Antwort. Auf Anhieb steht nur ein Lob aus der Liste des Rahmens (LB1 a, LERN_Session18): Was das
           * Spiel mitgibt — text (oft „Richtig: 7 + 4 = 11“) und erklaerung (WZ2 a) —, kommt nur nach einem Fehlversuch
           * bei dieser Aufgabe; wer sich geirrt (oder verklickt) hat, bekommt es und kann mit „Weiter ➜“ überspringen.
           * Vorher zeigte der Rahmen text immer, und 137 von 169 Spielen gaben darin Rechnungen oder Begründungen mit.
           */
          richtig(text, erklaerung) {
            if (erledigt) return;
            erledigt = true;
            const mitErklaerung = versuche > 0 && !!(text || erklaerung);
            pruefung.haken?.("richtig", { nr, vorab: loesungVorab, erklaerung: mitErklaerung });
            zusatzJetzt();
            L.richtig();
            abschliessen(true);
            ton("richtig");
            const gesagtText = versuche > 0 ? [text || waehle(lobListe), erklaerung].filter(Boolean).join(" ") : waehle(lobListe);
            eule.sag(gesagtText, "gut");
            // für das Testskript: was nach der richtigen Antwort in der Blase steht (auf Anhieb nur ein Lob der Liste)
            pruefung.haken?.("gelobt", { nr, text: eule.blase.textContent || "", aufAnhieb: versuche === 0, liste: lobListe });
            nr++;
            if (endlos) punkte.textContent = `♾ ${L.geschafft}`;
            // Die nächste Aufgabe erst, wenn die Stimme fertig ist (Lob, gesprochene Antwort des Spiels; höchstens 6 s):
            // sonst sprach in Au café der Satz der vorigen Antwort noch, als die neue Aufgabe schon stand (Meldung 6,
            // LERN_Session11). Und erst, wenn eine längere Rückmeldung gelesen sein kann („Gut aufgepasst! Richtig wäre
            // 14 289.“; Hinweis Patrik, LERN_Session13): 1,3 s, dazu 30 ms je Zeichen über 20, höchstens 3 s (WZ2 a,
            // LERN_Session17; vorher 45 ms und 5 s — lange Erklärungen bremsten den Spielfluss).
            const gesagt = eule.blase.textContent || "";
            const lesen = endlos ? 900 : Math.min(3000, 1300 + Math.max(0, gesagt.length - 20) * 30);
            // Überspringen (Entscheid WZ1 a): ablaufender Balken mit „Weiter ➜“ unter der Eule; Antippen der Blase oder
            // des Knopfs, Enter oder Leertaste führt sofort weiter. Endlos bleibt bei 0,9 s ohne Balken.
            let weiterGegangen = false;
            let leiste = null;
            const weiterJetzt = () => {
              if (weiterGegangen) return;
              weiterGegangen = true;
              clearTimeout(wartet);
              if (leiste) { weiterPlatz.replaceChildren(); werkzeugZeile.classList.remove("weiter-an"); }
              eule.blase.removeEventListener("click", weiterJetzt);
              removeEventListener("keydown", tasteWeiter, true);
              naechste();
            };
            const tasteWeiter = e => {
              if (e.key !== "Enter" && e.key !== " ") return;
              if (e.target?.closest?.("input, textarea, select")) return;
              e.preventDefault();
              e.stopPropagation();
              try { speechSynthesis.cancel(); } catch { /* ohne Stimme */ }
              weiterJetzt();
            };
            const wartet = setTimeout(() => nachStimme(weiterJetzt, 6000), lesen);
            if (!endlos) {
              const balken = el("div", { class: "weiter-balken" });
              balken.style.animationDuration = lesen + "ms";
              leiste = weiterPlatz;
              weiterPlatz.replaceChildren(balken,
                el("button", { type: "button", class: "knopf hell klein weiter-knopf", text: "Weiter ➜",
                  onclick: () => { try { speechSynthesis.cancel(); } catch { /* ohne Stimme */ } weiterJetzt(); } }));
              werkzeugZeile.classList.add("weiter-an");
              eule.blase.addEventListener("click", weiterJetzt);
              addEventListener("keydown", tasteWeiter, true);
            }
          },
          falsch(hinweis, loesungText) {
            if (erledigt) return;
            versuche++;
            if (loesungText && !loesungGemerkt) loesungGemerkt = loesungText;
            // Der Kern zählt den Fehler und sagt, ob die Lösung kommt (nach dem dritten Fehlversuch mit Lösung) oder
            // die Serie vorbei ist; dann ist die Aufgabe dort abgeschlossen.
            zusatzJetzt();
            const f = L.falsch({ text: aufgabenText(flaeche), loesung: loesungText || "" });
            ton("falsch");
            const aufgeloest = f.vorbei || f.loesungZeigen;
            pruefung.haken?.("falsch", { nr, hinweis: hinweis || "", loesung: loesungText || "", aufgeloest, flaeche, vorab: loesungVorab });
            if (endlos) {
              if (loesungText && !loesungVorab) loesungVorab = loesungText;
              return endlosVorbei("Schade, das war nicht richtig.");
            }
            if (aufgeloest) {
              erledigt = true;
              abschliessen(false);
              eule.sag(`Schau mal: ${loesungText}`, "hinweis");
              const weiter = el("button", { class: "knopf", type: "button", text: "Weiter ➜", onclick: () => { nr++; naechste(); } });
              flaeche.append(el("div", { class: "knopfzeile" }, weiter));
              weiter.focus();
            } else {
              eule.sag(hinweis || "Fast! Versuch es nochmal.", "hinweis");
            }
          },
        };
        // Aufgabe zeichnen; ist sie in dieser Runde nicht mehr erlaubt, neu ziehen (die Spiele ziehen in aufgabe()
        // zufällig, die Menge der möglichen Aufgaben kennt der Rahmen nicht). Ob sie passt, entscheidet der Kern
        // (KERN.runde.auswahl: Suche in fünf Stufen mit Gedächtnis und Serienbremse, RA5 a, RA6 a). Findet sich nach vielen
        // Zügen keine, ist die Stufe erschöpft. Gilt eine Aufgabe trotz zu langer Serie (die Stufe hat dann wohl nur diesen
        // Wert), meldet es das Testskript.
        zeichnet = true;
        blaseNeu = false;
        wahl.neueSuche();
        for (let versuch = 0; ; versuch++) {
          gesagtBeimZeichnen = false;
          def.aufgabe(ctx);
          const k = kennung(flaeche, loesungVorab, eigeneKennung);
          const messen = !!pruefung.zaehle?.(k); // nur das Testskript: weiter ziehen, nichts stellen
          const wahlErg = messen ? { weiter: true } : wahl.pruefe(k, serien, versuch);
          if (wahlErg.nehmen) {
            L.gestellt();
            pruefung.haken?.("gestellt", { nr, kennung: k, schritte, serien, tipps: tipps.length, serieErzwungen: wahlErg.serieErzwungen });
            schritteFest = true;
            // Notizblock (NB2 a): wenn die Aufgabe Notizen oder den Block anbietet. Der Knopf steht in der Zeile von „Melden“,
            // nicht beim Feld — dort zerrisse er den Aufbau mancher Spiele (Rechen-Maschine: das Feld sitzt auf dem Pfeil).
            if (notizAngeboten) blockKnopfZeigen();
            // Sagt das Spiel beim Stellen nichts: der Auftrag dieser Aufgabe aus der Fläche (.frage, .auftrag — dieselben
            // Elemente, die das Vorlesen nimmt), erst sonst der zuletzt gesagte; ein früherer Auftrag kann zu einer
            // anderen Aufgabenart gehören (Pentomino-Puzzle: Formen finden, dann legen; Hinweis Patrik, LERN_Session14).
            // Ohne Knöpfe darin: 💡 steht seit BH3 a oft in der Frage (data-tipp-ziel).
            const auftragEl = flaeche.querySelector(".frage, .auftrag")?.cloneNode(true);
            auftragEl?.querySelectorAll("button").forEach(b => b.remove());
            const auftragHier = auftragEl?.textContent.replace(/\s+/g, " ").trim();
            if (nr > 0 && !gesagtBeimZeichnen) eule.zeige(auftragHier || letzterAuftrag || "Weiter geht's mit der nächsten Aufgabe.");
            zeichnet = false;
            gezeigt = true;
            // Reihenfolge: Lob der vorigen Aufgabe ausreden lassen, dann vorlesen, dann die Töne des Spiels.
            const meinLauf = lauf;
            const ansagenLos = () => {
              if (meinLauf !== aufgabeLauf) return;
              angesagt = true;
              const faellig = ansagen;
              ansagen = [];
              faellig.forEach(fn => fn());
            };
            setTimeout(() => nachStimme(() => {
              if (meinLauf !== aufgabeLauf) return;
              if (eule.vorlesen) eule.vorlesen(ansagenLos); else ansagenLos();
            }), 300);
            break;
          }
          if (wahlErg.erschoepft) {
            clearTimeout(uhr);
            L.erschoepft(); // Runde gekürzt, Serie „alles geschafft“ (RA6 a)
            // Mix: Das Spiel hat keine neue Aufgabe mehr; der Mix nimmt dann die anderen.
            if (mix) { flaeche.innerHTML = ""; return anMix({ typ: "erschoepft" }); }
            anzahl = nr;
            if (endlos) { allesGeschafft = true; return schlussEndlos(); }
            return schluss();
          }
          flaeche.innerHTML = "";
          flaeche.classList.remove("antworten-warten");
          loesungVorab = null;
          eigeneKennung = null;
          schritte = 0;
          schritteFest = false;
          notizAngeboten = false;
          warten = 0;
          uhrWartet = false;
          ansagen = [];
          tipps = [];
          tippRueckruf = null;
          tippPos = 0;
          zug++;
          serien = {};
        }
        bereitMachen();
        zeigeTippKnopf();
      }

      /**
       * Woran man eine Aufgabe wiedererkennt: der Text, den das Kind sieht, ohne die Antwortknöpfe
       * (deren Reihenfolge ist gemischt), dazu die Lösung. Leer, wenn es nichts zu vergleichen gibt.
       */
      function kennung(wurzel, loesung, eigeneKennung) {
        if (eigeneKennung != null) return `eigen|${eigeneKennung}|${loesung || ""}`;
        const teile = [];
        // Gezeichnete Bilder (Noten, Formen, Uhr) zählen mit ihren Formen und Lagen, ohne Stil-Angaben.
        const ZEICHNUNG = /^(circle|ellipse|line|path|polygon|polyline|rect|text|use)$/;
        const sammle = (k, imBild) => {
          if (k.nodeType === 3) { teile.push(k.data); return; }
          if (k.nodeType !== 1 || k.localName === "button" || k.localName === "input" || k.localName === "a") return;
          const bild = imBild || k.localName === "svg";
          if (bild && ZEICHNUNG.test(k.localName)) {
            teile.push(k.localName + ["cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2", "d", "points", "width", "height", "href"].map(a => k.getAttribute?.(a) ?? "").join(","));
          }
          for (const c of k.childNodes) sammle(c, bild);
        };
        sammle(wurzel, false);
        const text = teile.join(" ").replace(/\s+/g, " ").trim();
        return text || loesung ? `${text}|${loesung || ""}` : null;
      }

      /**
       * Felder des Eulenpfads im Eintrag einer Runde oder Serie; den Rest (zeit am Ende, dauer auf 0,1 s, aufgaben, fehler,
       * gezeigt, liste je Aufgabe, gekuerzt, endlos) setzt der Kern (L.eintrag, RA1–RA4 a).
       */
      const eintragFelder = sterne => ({
        name, inhalt: def.id, stufe: stufe.id, sterne,
        geordnet: geordnet(name, def.id, stufe.id),
        ...(def.optionen ? { optionen: Object.fromEntries(Object.keys(def.optionen).map(id => [id, optionWert(name, def, id, stufe.id)])) } : {}),
        timer: endlos ? mitTimer : timer.an ? timer.sekunden : null,
        // Testrunden zählen nicht in der Statistik (Entscheid T1 a); hilfe = Testhilfen benutzt.
        ...(test ? { test: true } : {}),
        ...(hilfen ? { hilfe: hilfen } : {}),
        ...(tippsRunde ? { tipps: tippsRunde } : {}),
        ...(bedienhilfe ? { bedienhilfe } : {}), // ❓ Hilfe geöffnet: nur notiert, ohne Folgen
      });

      function schluss() {
        // Ein Tipp zählt wie ein halber Fehler (Entscheid T1 a): fragen ist günstiger als raten, aber nicht gratis.
        const fehler = L.fehler;
        const sterne = sterneFuer(fehler + tippsRunde / 2);
        protokolliere(L.eintrag(eintragFelder(sterne)));
        ton("fertig");
        tonFuerRunde = false; // nach der Runde ist das Hören wieder still (AN3-T a)
        // Abschluss-Animation des Spiels (feier.js, Entscheide AN1–AN3 a), sonst wie bisher Konfetti
        const feier = def.feier && typeof LS_FEIER !== "undefined" && einstellung("feier", def.id) === "an" && !ruhe("feier", def.id)
          ? LS_FEIER.zeige(def.feier, { stufe: stufe.id, sterne, klang: ton }) : null; // klang: nur mit Ton an (Regel 8)
        if (!feier) konfetti();
        pruefung.haken?.("schluss", { stufe: stufe.id, stufen: Object.keys(def.stufen || {}), sterne, feierDef: def.feier || null, feier });
        buehne.innerHTML = "";
        const karte = el("div", { class: "karte schluss mitte", "data-stil-bereich": "schluss" });
        const st = el("div", { class: "sterne" });
        for (let i = 0; i < 3; i++) st.append(el("span", { class: i < sterne ? "" : "aus", style: i < sterne ? "color:#f5b301" : "", text: "★" }));
        const eule = euleZeile();
        karte.append(
          el("div", { class: "auftrag", text: `Geschafft, ${name}!` }),
          ...(feier ? [feier] : []),
          st,
          eule.element,
          el("div", { class: "knopfzeile" },
            el("button", { class: "knopf gruen", type: "button", text: "Nochmal spielen", onclick: () => runde(stufe) }),
            el("button", { class: "knopf hell", type: "button", text: "Andere Stufe", onclick: stufenwahl }),
            el("a", { class: "knopf hell", href: `${START}?aehnlich=${def.id}#spiele`, text: "🔗 Ähnliche Spiele" })));
        buehne.append(karte);
        // Text nach der Fehlerzahl dieser Runde — 3 Sterne gibt es auch mit einem Fehler. Tipps werden genannt.
        const mitTipps = tippsRunde ? ` Du hast ${tippsRunde === 1 ? "einen Tipp" : `${tippsRunde} Tipps`} geholt.` : "";
        eule.sag((fehler === 0 && !tippsRunde ? "Perfekt! Alles auf Anhieb richtig! 🏆"
          : fehler === 0 ? "Alles richtig!"
          : fehler === 1 ? "Wow, fast alles auf Anhieb richtig!"
          : sterne === 2 ? "Gut gemacht! Mit etwas Übung schaffst du drei Sterne."
          : "Du hast durchgehalten! Spiel nochmal, dann wird es leichter.") + mitTipps, "gut");
      }

      /**
       * Endlos: Rekord und Eintrag im Protokoll speichern (eine Serie ist eine Runde, RA3 a), sobald sie vorbei ist
       * (Fehler, Zeit um, alles geschafft) — nicht erst beim Ergebnisbild. Endgültig nur einmal je Runde; gibt den
       * bisherigen Rekord zurück. abgebrochen (Entscheid Patrik E1 a): Das Kind verlässt die Seite mitten in der Serie,
       * sie zählt bis dahin. Kommt es zurück und spielt weiter, ersetzt der nächste Stand diesen Zwischenstand — eine
       * Kennung je Serie (L.id), auch auf anderen Geräten (R1 a).
       */
      function speichereEndlos(abgebrochen = false) {
        if (rundeGespeichert) return rekordVorher;
        if (rekordVorher === null) rekordVorher = besterRekord(name, def.id, stufe.id, mitTimer);
        speichereRekord(L.rekord({ name, inhalt: def.id, stufe: stufe.id, timer: mitTimer,
          ...(test ? { test: true } : {}), ...(hilfen ? { hilfe: hilfen } : {}) }, { abgebrochen }));
        protokolliere(L.eintrag(eintragFelder(null), { abgebrochen }));
        if (!abgebrochen) {
          rundeGespeichert = true;
          waechter?.aus();
        }
        return rekordVorher;
      }
      // Verlassen: Tab zu, Zurück-Pfeil (pagehide); Tablet aus oder App gewechselt (visibilitychange, auf
      // Tablets zuverlässiger als pagehide) — KERN.runde.waechter. Eine Serie ohne richtige Aufgabe gibt keinen Eintrag.
      const waechter = endlos && !mix ? KERN.runde.waechter(() => { if (L.geschafft > 0) speichereEndlos(true); }) : null;
      // Mix: Aufgaben nur auf Verlangen des Mix (mix.html), Nachrichten nur von ihm.
      if (mix) addEventListener("message", e => {
        if (e.source !== parent || e.data?.lern !== "mix") return;
        if (e.data.typ === "ton") return setzeTon(e.data.an);
        if (e.data.typ === "hilfe") return hilfeFenster(def); // ❓ in der Leiste des Mix
        if (e.data.typ !== "aufgabe") return;
        mixGeschafft = e.data.geschafft || 0;
        mixFreigabe = true;
        naechste();
      });

      /** Endlos: Ergebnis speichern (falls noch nicht geschehen), Rekord und Rangliste zeigen. */
      function schlussEndlos() {
        clearTimeout(uhr);
        const vorher = speichereEndlos();
        const neuerRekord = L.geschafft > 0 && L.geschafft > vorher;
        ton("fertig");
        tonFuerRunde = false; // nach der Runde ist das Hören wieder still (AN3-T a)
        if (neuerRekord) konfetti();
        buehne.innerHTML = "";
        const karte = el("div", { class: "karte schluss mitte", "data-stil-bereich": "schluss" });
        const eule = euleZeile();
        karte.append(
          el("div", { class: "auftrag", text: `♾ ${L.geschafft} richtig in Folge!` }),
          eule.element,
          rangliste(def.id, stufe.id, mitTimer, name),
          el("div", { class: "knopfzeile" },
            el("button", { class: "knopf gruen", type: "button", text: "♾ Nochmal", onclick: () => runde(stufe, true) }),
            el("button", { class: "knopf hell", type: "button", text: "Andere Stufe", onclick: stufenwahl }),
            el("a", { class: "knopf hell", href: `${START}?aehnlich=${def.id}#spiele`, text: "🔗 Ähnliche Spiele" })));
        buehne.append(karte);
        eule.sag(allesGeschafft ? "Unglaublich — du hast alle Aufgaben dieser Stufe geschafft! 🏆"
          : neuerRekord ? `Neuer Rekord, ${name}! 🎉` + (vorher ? ` Vorher waren es ${vorher}.` : "")
          : vorher ? `Dein Rekord bleibt ${vorher}. Gleich nochmal?` : "Gut gemacht! Schaffst du nächstes Mal mehr?", "gut");
      }

      naechste();
    }

    // ?stufe=<id> startet direkt in dieser Stufe (Startseite verlinkt so ein erweitertes Lernziel),
    // mit &endlos=1 im Endlos-Modus, wenn die Stufe ihn anbietet.
    const adresse = new URLSearchParams(location.search);
    const direkt = stufenListe.find(st => st.id === adresse.get("stufe"));
    // ?feier=<stufe>&sterne=1–3[&ruhig=1]: nur das Schlussbild mit der Abschluss-Animation, für die Abnahme der Piloten
    // (tools/feier_vorschau.html, LERN_Session27). Ohne Anmeldung und ohne Runde: es wird nichts gespeichert. Die
    // Einstellung „Abschluss-Animation“ und die Ruhezeit gelten hier nicht (es ist eine Vorschau), der Ton schon.
    // aus der Skala, nicht aus den angebotenen Stufen: die hängen an freigegebenen Inhaltslisten, die Animation nicht
    const vorschau = SKALA.find(st => st.id === adresse.get("feier"));
    if (vorschau && def.feier && typeof LS_FEIER !== "undefined") return feierVorschau(vorschau);
    // &mix=1 im iframe des Zufallsmix (Entscheid M1 a): ohne Kopfzeile, mit &timer=1 und &endlos=1 vom Mix.
    // Kann das Spiel die verlangte Stufe nicht stellen (nicht frei, keine Stimme), sagt es das dem Mix.
    if (adresse.get("mix") === "1" && parent !== window) {
      document.body.classList.add("im-mix");
      const endlos = adresse.get("endlos") === "1";
      // Endlos im Mix in jeder Stufe (Wunsch Patrik, LERN_Session12): ein Spiel stellt dort nur wenige Aufgaben am Stück.
      if (!direkt || !aktuellerSpieler() || !spielSichtbar(def.id))
        return parent.postMessage({ lern: "mix", spiel: def.id, typ: "geht-nicht" }, "*");
      return runde(direkt, endlos, { timer: adresse.get("timer") === "1" });
    }
    if (direkt) runde(direkt, adresse.get("endlos") === "1" && endlosStufen(def.id).includes(direkt.id));
    else stufenwahl();
  }

  // ---------- Zufallsmix (Entscheid M1 a, LERN_Session5) ----------
  // Rekorde des Endlos-Mix stehen unter spiel "mix:<Auswahl>" (alle, fokus oder Fächer mit +), damit
  // Ranglisten nur gleiche Mischungen vergleichen; stufe ist eine Stufe der Skala oder "passend".
  const MIX_PRAEFIX = "mix:";
  const istMix = spielId => String(spielId).startsWith(MIX_PRAEFIX);
  /** Anzeigename einer Mix-Kennung: „🎲 Zufallsmix · ⭐ Fokus + Mathe“. */
  function mixName(spielId) {
    const auswahl = String(spielId).slice(MIX_PRAEFIX.length);
    return "🎲 Zufallsmix" + (auswahl === "alle" ? "" : " · " + auswahl.split("+").map(t => (t === "fokus" ? "⭐ Fokus" : t)).join(" + "));
  }

  /**
   * Nur für tools/pruefe_spiele.js: pruefung.haken(art, angaben) erfährt jede neue Aufgabe
   * (art "aufgabe", { nr }; nach der Wiederholungsprüfung art "gestellt", { nr, kennung })
   * und jede Antwort (art "richtig" oder "falsch";
   * angaben { nr, hinweis, loesung, aufgeloest, flaeche, vorab }).
   * pruefung.zaehle(kennung) misst, wie viele verschiedene Aufgaben eine Stufe hat (Entscheid EN1 a, LERN_Session12):
   * Solange sie true gibt, zieht der Rahmen neu, ohne eine Aufgabe zu stellen — mit derselben Kennung wie gegen
   * Wiederholungen.
   */
  const pruefung = { haken: null, zaehle: null };

  /**
   * CSS-Klassen des Rahmens (Vertrag in docs/rahmen.md; einzige Liste, das Testskript liest sie hier).
   * reserviert: baut Startbild, Namenswahl, Runde und Schlusskarte — ein Spiel definiert sie im eigenen
   *   <style> nie auf oberster Ebene neu (Vergleichs-Krokodil: eigene .mitte liess die Schlusskarte schrumpfen).
   * bausteine: Teile der Bausteine (auswahl, reihenfolge, koerbe, tastatur, Noten), die ein Spiel anpassen darf.
   */
  // Symbole der Schalter (seit LERN_Session32 hier, vorher start/spiele.js): auf den Kacheln der Startseite und auf
  // der Stufenwahl gleich (FB2 a: dort mit Wort, damit Kinder lernen, was die Symbole heissen)
  const SCHALTER_SYMBOL = {
    stern: KERN.uebersicht.STERN,
    endlos: '<path class="linie" d="M7.6 8.2C5.3 8.2 3.5 9.9 3.5 12s1.8 3.8 4.1 3.8c3.6 0 5.2-7.6 8.8-7.6 2.3 0 4.1 1.7 4.1 3.8s-1.8 3.8-4.1 3.8c-3.6 0-5.2-7.6-8.8-7.6z"/>',
    uhr: '<rect x="10.2" y="1.8" width="3.6" height="2.6" rx="1"/><circle cx="12" cy="13.6" r="7.6"/><path class="zeiger" d="M12 13.6V9.2M12 13.6l3 2"/>',
    // Reihenfolge der Teile (RF1 a, Satz B): drei absteigende Balken (grösste Stelle links), gemischt ein Mischpfeil
    balken: '<rect x="3.4" y="4.5" width="4.4" height="15.5" rx="1"/><rect x="9.8" y="8.8" width="4.4" height="11.2" rx="1"/><rect x="16.2" y="13.2" width="4.4" height="6.8" rx="1"/>',
    mischen: '<path d="M3 7h3.5c4.5 0 6.5 10 11 10H20M3 17h3.5c4.5 0 6.5-10 11-10H20M17.5 4.5 20.5 7l-3 2.5M17.5 14.5l3 2.5-3 2.5"/>',
  };
  function schalterSymbol(art, an) {
    if (!document.getElementById("gold-verlauf")) {
      const defs = document.createElement("div");
      defs.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gold-verlauf" x1="0" y1="0" x2="0" y2="1">'
        + '<stop offset="0" stop-color="#ffe27a"/><stop offset=".55" stop-color="#ffc107"/><stop offset="1" stop-color="#f29a00"/></linearGradient></defs></svg>';
      document.body.append(defs.firstChild);
    }
    const box = document.createElement("span");
    box.innerHTML = `<svg class="symbol ${art}${an ? " an" : ""}" viewBox="0 0 24 24" aria-hidden="true">${SCHALTER_SYMBOL[art]}</svg>`;
    return box.firstChild;
  }

  const RAHMEN_KLASSEN = {
    reserviert: ["buehne", "kopf", "zurueck", "ton", "karte", "mitte", "schluss", "auftrag", "knopf", "knopfzeile", "hell", "gruen", "klein", "vorlesen", "los-huelle", "los-ueber", "los-zahl", "los-knopf",
      "eule", "eule-zeile", "blase", "fortschritt", "sterne", "sterne-klein", "aus", "konfetti", "flug", "leise", "link",
      "spieler-zeile", "speicher-voll",
      "stufen", "stufe", "fuer", "stufe-huelle", "stufe-kopf", "stufe-symbol", "stufe-nr", "stufe-name", "sterne-gross", "stufe-info", "stufe-text", "blase-klein", "stil-hand", "hand-rahmen", "raster-luecke", "timer-zeile", "timer-schalter", "option-zeile", "option-schalter", "aufsicht-fest", "avatar", "avatar-ersatz", "avatar-bild", "entwickler-leiste", "entwickler-feld", "zeitleiste", "zeitbalken", "testhilfe",
      "endlos", "endlos-wahl", "endlos-knoepfe", "rangliste", "ranglisten", "ich",
      "melden", "melde-zeile", "melde-hintergrund", "melde-fenster", "melde-wahl", "melde-zusatz", "melde-meldung",
      "hilfe-knopf", "hilfe-eigen", "hilfe-liste", "tipp-zeile", "tipp-knopf", "pause-verdeckt", "antworten-warten", "regeln-link",
      "stimmen-zeile", "stimme-eintrag", "stimme-meldung", "pruef-zeile", "mit-tasten", "blase-text", "lesetext", "zw-notiz", "weiter-leiste", "weiter-balken", "weiter-knopf",
      "notizblock", "nb-knopf", "nb-feld", "nb-kopf", "nb-inhalt", "nb-platz"],
    bausteine: ["wahl", "wahl-knopf", "bild", "gezeichnet", "pruef-bild", "pruef-text-bild", "pruef-farbe", "pruef-farbfeld", "ablage", "pfeil", "korb-karte", "korb-reihe", "korb-knopf",
      "tastatur", "anzeige", "ok", "loeschen", "zeichen", "hoer-zeile", "hoer-knopf", "notenblatt", "noten-zeile"],
  };

  // Laden der grossen Schlüssel: ohne IndexedDB jetzt gleich (Umzug wie bis Kern 1.33 beim Laden der Seite), sonst
  // sofort anstossen; die Seiten warten über nachBereit (spiel, Startseite, Mix), der Abgleich über beiBereit.
  if (SPEICHER.modus() === "lokal") laden(); else bereit();

  return {
    bereit, nachBereit, beiBereit, SPEICHER, speicherVoll,
    STELLEN, SKALA, zahlText, dezimalText, geldText, klasseDerStufe, EINSTELLUNGEN, EINSTELLUNG_BLOECKE, einstellung, einstellungSpiel, setzeEinstellung, einstellungenZuruecksetzen,
    RUHE_ARTEN, WOCHENTAGE, ruhezeiten, setzeRuhezeiten, ruheZeitGueltig, ruhe, ruheJetzt, ruheStand, ruheTageText, brauchtTon, tonSpielRuht, ruheAusgeblendet, dativ, zufall, waehle, mische, zerlege, el, ton, konfetti, tastatur, tippSchritte, lesetext, notizFeld, kurztasten, kurztastenAus: () => { ktAus = true; }, SERIE_MAX, spiel, lies, schreibe, sterneText, sterneFuer,
    LOB, MIX_PRAEFIX, istMix, mixName, speichereRekord, protokolliere, euleZeile, tonSchalter, rangliste,
    spielerListe, aktuellerSpieler, setzeSpieler, neuerSpieler, loescheSpieler, profil, speichereProfil, empfohleneStufe,
    person, umbenennen, gehoert, PERSONEN,
    beiAenderung, abgleichDaten, sicherung, gesperrt, freischalten, spielStand: () => spielStand,
    angezeigt, istAusgeblendet, darfAusblenden, ausblenden, zeigen,
    MELDUNG_ARTEN, MELDUNG_STATUS, ANREGUNG_ARTEN, ANREGUNG_STATUS, istAnregung, anregungen, neueAnregung,
    bild, istZeichnung, mitBildText, zelleMitBildern,
    neueKorrektur, korrekturen, entferneMeldung, fingerabdruck, listenPruefung, pruefungDefinition, pruefungLokal, setzePruefungLokal,
    listenPruefen, katalogEintrag,
    meldungen, meldungenVon, gefundeneFehler, ungeleseneMeldungen, meldenErlaubt, neueMeldung,
    setzeMeldung, meldungenGelesen, meldungFuerEntwicklung, meldeFormular, meldungStandAnwenden, meldungStatusAusBemerkung,
    meldungAdresse, meldungMailLink, meldungAusText, meldungWeitergeben, meldungenAbfragen, meldeweg, setzeMeldeweg,
    istAufsicht, kinderListe, aufsichtListe, spielerName, aufsichtAngemeldet, abmelden, setzePin, meldeAufsichtAn, pinStimmt, pinGueltig, neuerCode, setzeWiederherstellung, wiederherstellung, codeStimmt,
    antwortStimmt, zuruecksetzenStand, zuruecksetzenAnfordern, zuruecksetzenAbbrechen, zuruecksetzenAbbrechenMit, zuruecksetzenFaellig, ZURUECKSETZEN_TAGE,
    freigabe, spielFrei, spielZuPruefen, spielGeprueft, setzeSpielFrei, spielSichtbar, fuerKinderSichtbar, sperrGrund, suche, aehnlich, passung, spielListen, listeFrei, setzeListeFrei, freieListen,
    basisKlasse, stufeFuer, klasseText, KLASSEN, klasseVon, alterVon, aufsteigen, aufstiegZuruecknehmen, neuerAufstieg, sortierungFuer, VORLESEN_ARTEN, vorlesenArt, langDruecken, losGehts, loescheRunden, zusammenfuehren,
    REIHENFOLGEN, geordnet, reihenfolgeFuer, vorgabeZeit, timerFuer, waehleTimer, zeitVorschlag,
    WAHL_ARTEN, istFest, wahlFuer, setzeWahl, wahlZuruecksetzen, setzeFest, wahlAnzahl, FEST_TEXT, avatarBild,
    stimmeBereit, sprich: sprichInhalt, spielMitStimme, rekorde, besterRekord, ranglisteFuer, endlosStufen, schalterSymbol,
    protokoll, besteSterne, auswahl, reihenfolge, fliegen, koerbe, pruefung, RAHMEN_KLASSEN,
  };
})();

/* ---------- Stil „wie von Hand gezeichnet“ (STIL) ----------
   Einstellung stil: hand (Standard) | glatt; Wunsch Patrik LERN_Session32, docs/eulenpfad/konzept_gestaltung.md.
   Gilt auf der Startseite (Tabs Spiele, Profil, Erfolge, Statistik) und auf jeder Spielseite um die Runde herum:
   Stufenwahl mit Timer, Endlos und Ranglisten, Schlussbild ohne die Abschluss-Animation (SP1, Patrik). Die laufende
   Runde bleibt glatt (GS0 a). Bereiche einer Spielseite tragen data-stil-bereich.

   „hand“: alles wie von Hand gezeichnet, in denselben Farben wie glatt —
   - Rahmen: Über Spielkarten, Weiterspielen, den Filter und die Karten in Profil, Erfolge und Statistik legt STIL ein SVG
     (svg.hand-rahmen): eine gefüllte Fläche zwischen zwei leicht krummen Linien, auf der Kopfseite dick (wo die glatte
     Karte ihren Farbstreifen hat: Spielkarte oben, kompakt und Weiterspielen links), sonst dünn; die Dicke wechselt
     langsam. Farbe --f der Karte, sonst eine helle Linie. Die Form hängt an der Kennung des Elements (Zufall mit
     Startwert) und wird neu gerechnet, wenn sich die Grösse ändert.
   - Raster: Spielkarten in den Kacheln leicht verschoben, mal etwas höher oder tiefer, etwas grösser oder kleiner, mit
     wechselndem Abstand; ab und zu eine Lücke (start/spiele.js gitter, STIL.luecke). Je Spiel immer gleich.
   - Knöpfe, Chips, Tabs, Felder: unregelmässige Ecken und Linien in start/start.css (.stil-hand …), ohne SVG.
   Umgeschaltet über die Klasse stil-hand an body. */

const STIL = (() => {
  const NS = "http://www.w3.org/2000/svg";
  // Was einen Rahmen bekommt, und wo seine dicke Seite ist (null = überall dünn)
  const RAHMEN = [
    [".spielkarte", k => (k.closest(".spiele.kompakt") ? "links" : "oben")],
    [".weiter-karte", () => "links"],
    [".filter-klapp", () => null],
    // Statistik und Erfolge (Konzept Gestaltung, KS2 a): Kacheln der Runden, Abzeichen; das Personen-Menü
    [".runden-kachel", () => "oben"],
    ["#inhalt .abzeichen", () => null],
    [".personen-liste", () => null],
    ["#inhalt .karte", () => null],
    // Spielseite: die Karte der Stufenwahl und des Schlussbilds, die Stufen (Farbstreifen links), die Ranglisten
    ["[data-stil-bereich]", () => null],
    ["[data-stil-bereich] .stufe", () => "links"],
    ["[data-stil-bereich] .rangliste", () => null],
  ];
  const an = () => typeof LS !== "undefined" && LS.einstellung("stil") === "hand";

  /** Zufall mit Startwert (mulberry32): dasselbe Element bekommt dieselbe Form. */
  function zufallAus(text) {
    let h = 2166136261;
    for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /** Pfad der handgezeichneten Fläche für b × h mit Eckradius r; kopf "oben", "links" oder null. */
  function pfad(b, h, id, kopf, r = 18) {
    const z = zufallAus(id), schritt = 10;
    r = Math.max(4, Math.min(r, b / 2, h / 2));
    const pkt = [];
    const gerade = (x0, y0, x1, y1, nx, ny, seite) => {
      const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / schritt));
      for (let i = 0; i < n; i++) pkt.push({ x: x0 + ((x1 - x0) * i) / n, y: y0 + ((y1 - y0) * i) / n, nx, ny, seite });
    };
    const bogen = (cx, cy, a0, seite) => {
      for (let i = 0; i < 4; i++) { const a = a0 + (i * Math.PI) / 8; pkt.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a), seite }); }
    };
    gerade(r, 0, b - r, 0, 0, -1, "oben"); bogen(b - r, r, -Math.PI / 2, "oben");
    gerade(b, r, b, h - r, 1, 0, "rechts"); bogen(b - r, h - r, 0, "unten");
    gerade(b - r, h, r, h, 0, 1, "unten"); bogen(r, h - r, Math.PI / 2, "unten");
    gerade(0, h - r, 0, r, -1, 0, "links"); bogen(r, r, Math.PI, "oben");
    // lange Wellen (krumm und gebogen, nicht zittrig): Lage bis ±2.6 px; Kopfseite 7–11 px, sonst 1.8–4 px
    const welle = (f1, f2) => { const p1 = z() * 6.3, p2 = z() * 6.3, a = 0.6 + 0.3 * z(); return t => a * Math.sin(t * f1 + p1) + (1 - a) * Math.sin(t * f2 + p2); };
    const lage = welle(2 + z() * 2, 6 + z() * 3), dicke = welle(2 + z() * 2, 7 + z() * 4);
    const n = pkt.length, aussen = [], innen = [];
    pkt.forEach((q, i) => {
      const t = (i / n) * Math.PI * 2;
      const istKopf = kopf === "links" ? q.seite === "links" : kopf === "oben" && q.seite === "oben" && Math.abs(q.ny) > 0.3;
      const w = istKopf ? 9 + 2 * dicke(t) : 2.9 + 1.1 * dicke(t);
      const d = 2.6 * lage(t);
      aussen.push([q.x + q.nx * d, q.y + q.ny * d]);
      innen.push([q.x + q.nx * (d - w), q.y + q.ny * (d - w)]);
    });
    const zug = ps => "M" + ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L") + " Z";
    return zug(aussen) + " " + zug(innen.reverse());
  }

  /** Kennung eines Elements für den Zufall: Spiel, sonst Titel oder Text am Anfang. */
  const kennung = k => k.dataset.spiel || k.getAttribute("aria-label")?.slice(0, 40) || k.getAttribute("href") || k.querySelector("h2, summary, b")?.textContent?.slice(0, 40) || k.className;

  /** Rahmen eines Elements (neu) zeichnen, in seiner heutigen Grösse. */
  function zeichne(k) {
    const b = k.offsetWidth, h = k.offsetHeight;
    if (!b || !h || !k.isConnected) return;
    const eintrag = RAHMEN.find(([sel]) => k.matches(sel));
    if (!eintrag) return;
    let svg = k.querySelector(":scope > svg.hand-rahmen");
    if (!svg) {
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "hand-rahmen");
      svg.setAttribute("aria-hidden", "true");
      const p = document.createElementNS(NS, "path");
      p.setAttribute("fill-rule", "evenodd");
      svg.appendChild(p);
      k.appendChild(svg);
    }
    const r = parseFloat(getComputedStyle(k).borderTopLeftRadius) || 18;
    svg.setAttribute("viewBox", `0 0 ${b} ${h}`);
    svg.firstChild.setAttribute("d", pfad(b, h, kennung(k), eintrag[1](k), r));
  }
  const beobachter = typeof ResizeObserver === "function" ? new ResizeObserver(e => e.forEach(x => zeichne(x.target))) : null;

  /** Raster: Spielkarte in den Kacheln leicht verschieben und skalieren (CSS-Variablen, start.css). */
  function raster(k) {
    if (k.dataset.raster) return;
    const z = zufallAus("raster:" + kennung(k)), um = (a, b) => a + (b - a) * z();
    k.dataset.raster = "1";
    k.style.setProperty("--rx", `${um(-4, 4).toFixed(1)}px`);
    k.style.setProperty("--ry", `${um(-4, 4).toFixed(1)}px`);
    k.style.setProperty("--rm", `${um(0, 12).toFixed(1)}px`);
    k.style.setProperty("--rs", um(0.975, 1.02).toFixed(3));
  }

  /** Ein Element einbinden: Rahmen beobachten, Raster setzen. */
  function binde(k) {
    if (k.dataset.stil) return;
    k.dataset.stil = "1";
    if (k.matches(".spielkarte, .stufe")) raster(k);
    if (beobachter) beobachter.observe(k); else zeichne(k);
  }
  const rahmenWahl = RAHMEN.map(([sel]) => sel).join(", ");
  /** Alle passenden Elemente in wurzel (und wurzel selbst) einbinden. */
  function bindeAlle(wurzel) {
    if (wurzel.nodeType !== 1) return;
    if (wurzel.matches(rahmenWahl)) binde(wurzel);
    wurzel.querySelectorAll(rahmenWahl).forEach(binde);
  }
  let neues = null;

  /** Stil der Seite setzen (bei jedem Zeichnen der Startseite): Klasse an body, neue Elemente einbinden. */
  function anwenden() {
    const hand = an();
    document.body.classList.toggle("stil-hand", hand);
    if (!hand) { neues?.disconnect(); neues = null; return; }
    bindeAlle(document.body);
    if (!neues && typeof MutationObserver === "function") {
      neues = new MutationObserver(m => m.forEach(x => x.addedNodes.forEach(bindeAlle)));
      neues.observe(document.body, { childList: true, subtree: true });
    }
  }

  /** Lücke im Raster nach dieser Karte? Nur im Stil „hand“, ab und zu (etwa jede zwölfte Karte), je Spiel gleich. */
  const luecke = id => an() && zufallAus("luecke:" + id)() < 0.085;

  return { an, anwenden, pfad, luecke, zeichne };
})();
