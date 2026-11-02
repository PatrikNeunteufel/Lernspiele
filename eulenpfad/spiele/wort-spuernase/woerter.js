/* Sätze für die Wort-Spürnase — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.2.B.1.f (Grundanspruch 2. Zyklus) und D.1.B.1.f: unbekannte Wörter aus dem
   Zusammenhang erschliessen. Alle Sätze selbst geschrieben, keine Zitate, keine echten Namen.

   Schreibweise je Eintrag: [Stufe, Text, richtige Bedeutung, falsche Bedeutung, falsche Bedeutung]
   - Im Text steht das schwierige Wort in geschweiften Klammern: {erschöpft}.
   - Der Hinweis, der die Bedeutung verrät, steht in eckigen Klammern: [hinlegen]. Ein bis drei
     Wörter; das Spiel zeigt sie nach der Antwort an (Königsstufe: das Kind tippt sie an).
   - Die Bedeutung gilt für das Wort, wie es im Text steht.
   Stufe (erstes Feld), geprüft vom Spiel (pruefeAufgabe):
     1  4. Klasse: bekanntere Wörter, Hinweis im selben Satz
     2  5. Klasse, leichter: seltenere Wörter, Hinweis im selben Satz
     3  5. Klasse: Hinweis im nächsten Satz
     4  5. Klasse, schwerer: seltenere Wörter, Hinweis im nächsten Satz, falsche Bedeutungen näher
     5  6. Klasse: Fremdwörter und Gegensätze („nicht …, sondern …“), Hinweis irgendwo im Text
   Schweizer Schreibweise (ss statt ß).

   Inhaltsliste (Entscheid L4 a): eine Liste „saetze“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag wort-spuernase, Feld listen). */

const SPUER_SAETZE = [
  // ---------- Stufe 1: Hinweis im selben Satz ----------
  [1, "Nach dem langen Lauf war Lena so {erschöpft}, dass sie sich sofort [hinlegen] musste.", "sehr müde", "sehr fröhlich", "sehr hungrig"],
  [1, "Der Hund {knurrte} und [zeigte die Zähne], als der Fremde näher kam.", "brummte böse", "wedelte mit dem Schwanz", "schlief ein"],
  [1, "Die Suppe war nur {lauwarm}, also [weder heiss noch kalt].", "ein wenig warm", "kochend heiss", "gefroren"],
  [1, "Der Kuchen war so {köstlich}, dass alle [noch ein Stück] wollten.", "sehr fein", "verbrannt", "sehr teuer"],
  [1, "Im Zelt war es {stockdunkel}, man [sah nichts] mehr.", "ganz dunkel", "sehr hell", "sehr eng"],
  [1, "Das junge Kätzchen war so {drollig}, dass alle Kinder [lachen] mussten.", "lustig und herzig", "gefährlich", "schmutzig"],
  [1, "Tim {flüsterte}, damit das Baby [nicht aufwachte].", "sprach ganz leise", "rief laut", "sang ein Lied"],
  [1, "Der Weg war so {steil}, dass wir nur [keuchend] bergauf kamen.", "stark ansteigend", "flach und eben", "sehr kurz"],
  [1, "Der alte Stuhl war {wackelig} und [kippte fast um], als Opa sich setzte.", "nicht stabil", "ganz neu", "sehr bequem"],
  [1, "Nach dem Regen war der Bach {reissend}, das Wasser [strömte sehr schnell].", "sehr schnell fliessend", "ganz ruhig", "ausgetrocknet"],
  [1, "Ali war {neugierig} und [wollte unbedingt wissen], was im Paket war.", "wollte gern Neues erfahren", "war sehr müde", "war traurig"],
  [1, "Das Brot war schon {altbacken}, es war [hart und trocken].", "nicht mehr frisch", "gerade gebacken", "mit Schokolade gefüllt"],
  [1, "Der Hase {flitzte} so [schnell] über die Wiese, dass der Hund ihn nicht erwischte.", "rannte", "schlich langsam", "hoppelte gemütlich"],
  [1, "Mia war {schüchtern} und sagte vor der Klasse [kaum ein Wort].", "zurückhaltend und scheu", "frech", "sehr laut"],

  // ---------- Stufe 2: Hinweis im selben Satz, seltenere Wörter ----------
  [2, "Der Bäcker {knetete} den Teig [mit beiden Händen], bis er weich war.", "drückte und formte", "schnitt in Stücke", "stellte kühl"],
  [2, "Weil es so {schwül} war, [schwitzten] alle, obwohl die Sonne nicht schien.", "feucht und warm", "kalt und windig", "trocken und kühl"],
  [2, "Die Strasse war {glitschig}, und Leo [rutschte] beinahe aus.", "glatt und nass", "staubig", "sehr breit"],
  [2, "Das Mädchen {zögerte}, weil es [nicht wusste], ob es springen sollte.", "wartete unsicher", "sprang sofort", "lachte laut"],
  [2, "Die Katze {schlich} [ganz leise] zum Vogel hin.", "ging lautlos und vorsichtig", "rannte laut", "sprang hoch"],
  [2, "Nach dem Fest war der Kühlschrank {geplündert}, es war [nichts mehr] darin.", "leer gegessen", "frisch aufgefüllt", "kaputt"],
  [2, "Der alte Mann war {schwerhörig}, darum musste man [laut sprechen].", "hört schlecht", "sieht schlecht", "läuft langsam"],
  [2, "Die Holzbrücke war {morsch}, die Bretter [bröckelten] schon.", "alt und faul", "frisch gestrichen", "aus Stein"],
  [2, "Jonas war so {zerstreut}, dass er ständig seine Mütze [vergass].", "unaufmerksam", "sehr ordentlich", "sehr stark"],
  [2, "Der Teich war {zugefroren}, man konnte darauf [Schlittschuh laufen].", "mit Eis bedeckt", "voller Fische", "ausgetrocknet"],
  [2, "Auf dem Markt war ein grosses {Gedränge}, viele Leute [schoben sich] durch die Gassen.", "viele Menschen auf engem Raum", "eine grosse Stille", "ein starker Regen"],
  [2, "Die Wolken wurden immer {bedrohlicher}, und bald [donnerte] es.", "gefährlicher aussehend", "heller", "kleiner"],
  [2, "Der Hund war {verwahrlost}, sein Fell war [schmutzig und verfilzt].", "ungepflegt", "frisch gebadet", "sehr jung"],
  [2, "Lisa {schlenderte} [gemütlich] durch den Park und hatte keine Eile.", "ging langsam", "rannte", "fuhr Velo"],

  // ---------- Stufe 3: Hinweis im nächsten Satz ----------
  [3, "Die Wanderer waren {ratlos}. [Niemand wusste], welcher Weg zur Hütte führte.", "wussten nicht weiter", "sehr hungrig", "sehr fröhlich"],
  [3, "Das Zimmer war {spärlich} eingerichtet. Es gab [nur einen Tisch] und einen Stuhl.", "mit wenigen Dingen", "mit vielen Möbeln", "sehr farbig"],
  [3, "Opa ist sehr {geduldig}. Er erklärt mir alles zehnmal, [ohne sich zu ärgern].", "kann gut warten und bleibt ruhig", "wird schnell wütend", "ist sehr vergesslich"],
  [3, "Der Hund {winselte} vor der Tür. Er wollte hinein und [jaulte leise].", "gab hohe, klagende Laute von sich", "bellte wütend", "schlief fest"],
  [3, "Am Morgen war die Wiese {bereift}. Alles [glitzerte weiss] vor Kälte.", "mit einer dünnen Eisschicht bedeckt", "frisch gemäht", "voller Blumen"],
  [3, "Nina war {empört}. Sie [stampfte wütend] mit dem Fuss auf.", "sehr verärgert", "sehr glücklich", "sehr müde"],
  [3, "Das alte Velo war {verrostet}. Die Kette war [ganz braun] und quietschte.", "von Rost bedeckt", "frisch geputzt", "sehr schnell"],
  [3, "Der Zug war {überfüllt}. [Viele Leute mussten stehen], weil alle Plätze besetzt waren.", "zu voll", "fast leer", "sehr langsam"],
  [3, "Mein Bruder ist ein {Langschläfer}. Am Sonntag [steht er erst am Mittag auf].", "jemand, der gern lange schläft", "jemand, der früh joggen geht", "jemand, der gern kocht"],
  [3, "Die Pflanze auf dem Fenstersims war {verdorrt}. Ihre Blätter waren [braun und trocken].", "vertrocknet", "frisch gegossen", "neu gekauft"],
  [3, "Die Rechenaufgabe war {knifflig}. Ich musste [lange nachdenken], bis ich die Lösung fand.", "schwierig", "sehr kurz", "schon gelöst"],
  [3, "Der Laden war {menschenleer}. [Kein einziger Kunde] war zu sehen.", "ohne Menschen", "voller Leute", "sehr laut"],
  [3, "Die Ziege war {störrisch}. Sie [blieb einfach stehen], so fest der Bauer auch zog.", "eigensinnig, will nicht folgen", "sehr ängstlich", "sehr hungrig"],
  [3, "Die Musik war {dröhnend}. Wir mussten uns [die Ohren zuhalten].", "sehr laut", "sehr leise", "sehr langsam"],

  // ---------- Stufe 4: Hinweis im nächsten Satz, schwerere Wörter ----------
  [4, "Der Detektiv war {skeptisch}. Er [glaubte die Geschichte nicht] so recht.", "zweifelnd", "begeistert", "verwirrt"],
  [4, "Auf der Bergtour wurden die Vorräte {knapp}. Für die letzten zwei Tage [blieb nur wenig] Brot.", "fast aufgebraucht", "verdorben", "sehr teuer"],
  [4, "Leon {prahlte} mit seinem neuen Handy. Er [zeigte es allen] und sagte, wie toll es sei.", "gab an", "versteckte es", "schämte sich"],
  [4, "Das Wetter war {unbeständig}. Mal schien die Sonne, [mal regnete es].", "wechselte oft", "blieb immer gleich", "war sehr heiss"],
  [4, "Die Antwort kam {prompt}. Kaum war die Frage gestellt, [antwortete Sara schon].", "sofort", "nach langem Überlegen", "erst am nächsten Tag"],
  [4, "Der Fuchs war {listig}. Mit einem Trick [lockte er die Hühner] aus dem Stall.", "schlau und trickreich", "dumm", "sehr scheu"],
  [4, "Nach dem Sturm sah der Garten {verwüstet} aus. Überall lagen [abgebrochene Äste] und umgekippte Töpfe.", "stark beschädigt", "frisch aufgeräumt", "voller Blumen"],
  [4, "Der Schulausflug wurde {verschoben}. Er findet [erst nächste Woche] statt.", "auf später gelegt", "ganz abgesagt", "auf früher gelegt"],
  [4, "Mira war {erleichtert}. Die Prüfung war [endlich vorbei], und sie hatte bestanden.", "froh, dass die Sorge weg ist", "enttäuscht", "nervös"],
  [4, "Der Weg zur Hütte war {beschwerlich}. Wir mussten [über Felsen klettern] und durch Schlamm stapfen.", "mühsam", "kurz und bequem", "gut beschildert"],
  [4, "Unser Kater ist sehr {wählerisch}. Er [frisst nur eine Sorte] Futter.", "isst nicht alles", "frisst alles", "frisst sehr viel"],
  [4, "Die Klasse {tuschelte}. Alle [steckten die Köpfe zusammen] und redeten leise.", "redete heimlich und leise", "schrie laut", "schwieg ganz"],
  [4, "Der Eingang war {unauffällig}. [Kaum jemand bemerkte] die kleine graue Tür.", "nicht leicht zu sehen", "sehr bunt", "sehr gross"],
  [4, "Lars war {verlegen}. Er [wurde rot] und schaute auf den Boden.", "peinlich berührt", "wütend", "gelangweilt"],

  // ---------- Stufe 5: Fremdwörter, Gegensätze, Hinweis irgendwo im Text ----------
  [5, "Die Aufgabe war nicht {simpel}, sondern [kompliziert]. Trotzdem fand Ben die Lösung.", "einfach", "schwierig", "lustig"],
  [5, "Die Forscherin war {optimistisch}. Sie [glaubte fest], dass ihr Versuch gelingen würde.", "zuversichtlich", "ängstlich", "gleichgültig"],
  [5, "Im Gegensatz zu seinem {hektischen} Bruder [blieb Paul immer ruhig].", "aufgeregt und in Eile", "ruhig und gelassen", "sehr gross"],
  [5, "Die Brücke über den Bach ist nur {provisorisch}. Nächstes Jahr wird sie durch eine feste [ersetzt].", "vorläufig", "sehr alt", "für immer gebaut"],
  [5, "Der Clown {imitierte} den Zirkusdirektor. Er [machte genau seinen Gang nach], und alle lachten.", "ahmte nach", "beleidigte", "begrüsste"],
  [5, "Das Museum zeigt {Fossilien}. Das sind [versteinerte Reste] von Tieren, die vor sehr langer Zeit lebten.", "Versteinerungen", "Gemälde", "Ritterrüstungen"],
  [5, "Die Ärztin stellte eine {Prognose}. [In zwei Wochen] werde das Bein wieder gesund sein, sagte sie.", "Vorhersage", "Spritze", "Rechnung"],
  [5, "Er handelte ganz {spontan}. [Ohne lange zu überlegen] sprang er ins kalte Wasser.", "aus dem Moment heraus", "nach langem Planen", "widerwillig"],
  [5, "Sie {ignorierte} das Klingeln des Telefons. Sie [las einfach weiter].", "beachtete nicht", "hörte genau hin", "nahm sofort ab"],
  [5, "Die Theatervorstellung war ein {Fiasko}. [Nichts klappte], und die Zuschauer gingen enttäuscht heim.", "völliger Misserfolg", "grosser Erfolg", "lange Pause"],
  [5, "Die Ergebnisse der beiden Gruppen waren {identisch}. Beide hatten [genau dieselbe Zahl] herausgefunden.", "gleich", "ganz verschieden", "falsch"],
  [5, "Der Bergführer war sehr {routiniert}. Er war den Weg [schon hundertmal gegangen].", "erfahren und geübt", "ein Anfänger", "ängstlich"],
  [5, "Das bemalte Velo ist ein {Unikat}. Auf der ganzen Welt gibt es [kein zweites] davon.", "Einzelstück", "Sonderangebot", "Kopie"],
  [5, "Statt {chaotisch} war das Zimmer heute [ordentlich aufgeräumt].", "durcheinander", "aufgeräumt", "frisch gestrichen"],
];
