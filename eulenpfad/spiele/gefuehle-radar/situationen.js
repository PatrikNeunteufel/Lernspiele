/* Gefühle, Sätze und Situationen für die Gefühle-Radar — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan D.1.C.1 (Zuhören: Verstehen in Gesprächen / Stimmungen und Gefühle wahrnehmen),
   Annahme: Buchstabe c als Klassenziel der 3. Klasse (beim Zuhören Stimmungen und Gefühle wahrnehmen
   und darauf reagieren) — die Zuordnung der Buchstaben ist aus der Spielidee abgeleitet und noch
   gegen den Lehrplan abzugleichen.
   Alle Texte selbst geschrieben. Kindernamen erfunden (Lea, Ben, Mia, Noah, Elin, Luca, Amira, Jonas).
   Schweizer Schreibweise (ss), Schweizer Alltag (Znüni, Pausenplatz, Lager, Velo, Grosi).
   Jede Situation soll eindeutig sein: Die Ablenker passen klar nicht. Kein Mobbing ohne Lösung,
   nichts Beängstigendes (Bär, Gewitter, Spinne nur als Alltagsangst, immer ohne Schaden).

   Inhaltsliste: eine Liste „situationen“ (Katalog spiele/gemeinsam/katalog.js, Eintrag
   gefuehle-radar, Feld listen). Alle Vorräte dieser Datei gehören zu ihr.

   Schreibweise je Vorrat:
   - GS_GEFUEHLE: { id, wort, bild, gesichter (Varianten für Stufe 1), gruppe "grund" oder "fein",
       positiv (für die Frage „Was passt jetzt?“ statt „Was könnte … helfen?“),
       ablenker: Gefühle, die zu diesem Gesicht klar nicht passen (Stufe 1) }
   - GS_BILDER (Stufe 1, Gesicht → Situation als Bild): { bild, text, gefuehl }
   - GS_SAETZE (Stufe 2, ein Satz mit 5–8 Wörtern, mit 🔊): { satz, name, gefuehl, ablenker [2] }
   - GS_SITUATIONEN (Stufe 3 Gruppe 3: zwei Sätze, Grundgefühle; Stufe 4 Gruppe 4: zwei Personen,
       feinere Gefühle, gefragt ist „wer“): { gruppe, text, wer, gefuehl, ablenker [3], tipp }
       tipp: dritter, konkreter Tipp — nennt nie das Gefühl.
   - GS_KOERPER (Stufe 3, Körpersignale): { satz, wer, gefuehl, ablenker [3] }
   - GS_GESPRAECHE (Stufe 5): { a: [wer, satz], b: [wer, satz], gefuehl (von b), ablenker [3],
       hilfe: { richtig, falsch [2] } — die falschen Vorschläge sind nett, aber unpassend, nie gemein }
   - GS_PAARE (Stufe 6 a, zwei Gefühle zugleich): { text, paar [2], ablenker: drei Paare, tipp }
   - GS_REAKTIONEN (Stufe 6 b, passende freundliche Antwort): { text, wer, richtig, falsch [2] }
   Geprüft vom Spiel (pruefeAufgabe): Gefühl aus GS_GEFUEHLE, genau eine richtige Antwort, Optionen
   verschieden, Satz nicht leer, kein ß. */

const GS_GEFUEHLE = [
  // Grundgefühle (Stufen 1–3)
  { id: "froehlich", wort: "fröhlich", bild: "😀", gesichter: ["😀", "😄", "😊"], gruppe: "grund", positiv: true, ablenker: ["traurig", "wuetend", "muede", "aengstlich"] },
  { id: "traurig", wort: "traurig", bild: "😢", gesichter: ["😢", "😭"], gruppe: "grund", ablenker: ["froehlich", "wuetend", "ueberrascht"] },
  { id: "wuetend", wort: "wütend", bild: "😠", gesichter: ["😠", "😡"], gruppe: "grund", ablenker: ["froehlich", "muede", "aengstlich"] },
  { id: "aengstlich", wort: "ängstlich", bild: "😨", gesichter: ["😨", "😱"], gruppe: "grund", ablenker: ["froehlich", "muede", "wuetend"] },
  { id: "ueberrascht", wort: "überrascht", bild: "😲", gesichter: ["😲", "😮"], gruppe: "grund", positiv: true, ablenker: ["traurig", "muede", "wuetend"] },
  { id: "muede", wort: "müde", bild: "😴", gesichter: ["😴", "😪"], gruppe: "grund", ablenker: ["froehlich", "ueberrascht", "wuetend"] },
  // Feinere Gefühle (ab Stufe 4)
  { id: "stolz", wort: "stolz", bild: "😌", gesichter: ["😌"], gruppe: "fein", positiv: true, ablenker: ["enttaeuscht", "gelangweilt", "traurig"] },
  { id: "enttaeuscht", wort: "enttäuscht", bild: "😞", gesichter: ["😞"], gruppe: "fein", ablenker: ["stolz", "neugierig", "froehlich"] },
  { id: "neugierig", wort: "neugierig", bild: "🤔", gesichter: ["🤔"], gruppe: "fein", positiv: true, ablenker: ["gelangweilt", "traurig", "muede"] },
  { id: "nervoes", wort: "nervös", bild: "😬", gesichter: ["😬"], gruppe: "fein", ablenker: ["gelangweilt", "stolz", "muede"] },
  { id: "gelangweilt", wort: "gelangweilt", bild: "🥱", gesichter: ["🥱"], gruppe: "fein", ablenker: ["neugierig", "aengstlich", "stolz"] },
  { id: "erleichtert", wort: "erleichtert", bild: "😮‍💨", gesichter: ["😮‍💨"], gruppe: "fein", positiv: true, ablenker: ["wuetend", "gelangweilt", "enttaeuscht"] },
  { id: "eifersuechtig", wort: "eifersüchtig", bild: "😒", gesichter: ["😒"], gruppe: "fein", ablenker: ["froehlich", "gelangweilt", "muede"] },
  { id: "beschaemt", wort: "beschämt", bild: "😳", gesichter: ["😳"], gruppe: "fein", ablenker: ["stolz", "froehlich", "neugierig"] },
];

/** Stufe 1: Welche Situation passt zum Gesicht? (Bild-Knöpfe mit kurzem Wort) */
const GS_BILDER = [
  { bild: "🎁", text: "Ein Geschenk", gefuehl: "froehlich" },
  { bild: "🍦", text: "Eine Glace", gefuehl: "froehlich" },
  { bild: "🎂", text: "Geburtstag", gefuehl: "froehlich" },
  { bild: "💔", text: "Spielzeug kaputt", gefuehl: "traurig" },
  { bild: "🧸", text: "Teddy ist weg", gefuehl: "traurig" },
  { bild: "🎈", text: "Ballon weggeflogen", gefuehl: "traurig" },
  { bild: "🧱", text: "Turm umgestossen", gefuehl: "wuetend" },
  { bild: "✏️", text: "Stift zerbrochen", gefuehl: "wuetend" },
  { bild: "🎮", text: "Spiel weggenommen", gefuehl: "wuetend" },
  { bild: "🐻", text: "Bär im Wald", gefuehl: "aengstlich" },
  { bild: "⚡", text: "Gewitter nachts", gefuehl: "aengstlich" },
  { bild: "🕷️", text: "Grosse Spinne", gefuehl: "aengstlich" },
  { bild: "🎉", text: "Überraschungsfest", gefuehl: "ueberrascht" },
  { bild: "📦", text: "Paket vor der Tür", gefuehl: "ueberrascht" },
  { bild: "🎩", text: "Zaubertrick", gefuehl: "ueberrascht" },
  { bild: "🌙", text: "Spät in der Nacht", gefuehl: "muede" },
  { bild: "🥾", text: "Lange Wanderung", gefuehl: "muede" },
  { bild: "🛏️", text: "Kaum geschlafen", gefuehl: "muede" },
];

/** Stufe 2: ein kurzer Satz (5–8 Wörter) mit Namen, vorgesprochen mit 🔊. */
const GS_SAETZE = [
  { satz: "Lea bekommt ein Velo und jubelt.", name: "Lea", gefuehl: "froehlich", ablenker: ["traurig", "muede"] },
  { satz: "Ben weint, sein Hamster ist weg.", name: "Ben", gefuehl: "traurig", ablenker: ["froehlich", "wuetend"] },
  { satz: "Mia stampft und schreit: Das ist gemein!", name: "Mia", gefuehl: "wuetend", ablenker: ["froehlich", "muede"] },
  { satz: "Noah zittert, ein grosser Hund knurrt.", name: "Noah", gefuehl: "aengstlich", ablenker: ["froehlich", "muede"] },
  { satz: "Elin staunt: Ein Esel steht im Garten!", name: "Elin", gefuehl: "ueberrascht", ablenker: ["traurig", "muede"] },
  { satz: "Luca gähnt und reibt sich die Augen.", name: "Luca", gefuehl: "muede", ablenker: ["froehlich", "wuetend"] },
  { satz: "Amira lacht und tanzt durchs Zimmer.", name: "Amira", gefuehl: "froehlich", ablenker: ["traurig", "aengstlich"] },
  { satz: "Jonas sitzt allein und weint leise.", name: "Jonas", gefuehl: "traurig", ablenker: ["froehlich", "ueberrascht"] },
  { satz: "Lea knallt die Tür zu und schimpft.", name: "Lea", gefuehl: "wuetend", ablenker: ["froehlich", "muede"] },
  { satz: "Ben versteckt sich, es donnert laut.", name: "Ben", gefuehl: "aengstlich", ablenker: ["froehlich", "muede"] },
  { satz: "Mia staunt: Ein Paket für mich!", name: "Mia", gefuehl: "ueberrascht", ablenker: ["traurig", "muede"] },
  { satz: "Noah schläft fast beim Znüni ein.", name: "Noah", gefuehl: "muede", ablenker: ["wuetend", "ueberrascht"] },
  { satz: "Elin hüpft: Morgen ist Schulreise!", name: "Elin", gefuehl: "froehlich", ablenker: ["traurig", "aengstlich"] },
  { satz: "Luca vermisst sein Grosi sehr.", name: "Luca", gefuehl: "traurig", ablenker: ["froehlich", "wuetend"] },
  { satz: "Amira ballt die Fäuste: Immer ich!", name: "Amira", gefuehl: "wuetend", ablenker: ["froehlich", "muede"] },
  { satz: "Jonas traut sich nicht in den Keller.", name: "Jonas", gefuehl: "aengstlich", ablenker: ["froehlich", "muede"] },
  { satz: "Lea staunt: Es schneit im Mai!", name: "Lea", gefuehl: "ueberrascht", ablenker: ["traurig", "wuetend"] },
  { satz: "Ben gähnt, es ist schon spät.", name: "Ben", gefuehl: "muede", ablenker: ["froehlich", "wuetend"] },
];

/** Stufe 3 (Gruppe 3, Grundgefühle) und Stufe 4 (Gruppe 4, zwei Personen, feinere Gefühle). */
const GS_SITUATIONEN = [
  // ---------- Gruppe 3: zwei Sätze, ein Kind ----------
  { gruppe: 3, text: "Lea hat lange auf ihren Geburtstag gewartet. Heute kommen alle Freundinnen zur Party.", wer: "Lea", gefuehl: "froehlich", ablenker: ["traurig", "wuetend", "muede"], tipp: "Lea hat sich lange auf diesen Tag gefreut." },
  { gruppe: 3, text: "Ben hat sein Lieblingsbuch verloren. Er sucht überall, aber es ist weg.", wer: "Ben", gefuehl: "traurig", ablenker: ["froehlich", "ueberrascht", "muede"], tipp: "Etwas, das Ben lieb hat, ist weg." },
  { gruppe: 3, text: "Mia baut einen hohen Turm. Ihr Bruder wirft ihn absichtlich um.", wer: "Mia", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "aengstlich"], tipp: "Jemand hat Mia mit Absicht etwas kaputt gemacht." },
  { gruppe: 3, text: "Noah ist allein zu Hause. Plötzlich klopft es laut an der Tür.", wer: "Noah", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "wuetend"], tipp: "Noah weiss nicht, wer da ist." },
  { gruppe: 3, text: "Elin öffnet die Haustür. Ihre Cousine aus Italien steht davor, und niemand hat davon gewusst.", wer: "Elin", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"], tipp: "Elin hat damit gar nicht gerechnet." },
  { gruppe: 3, text: "Luca war den ganzen Tag im Lager wandern. Jetzt sitzt er am Feuer, und die Augen fallen ihm zu.", wer: "Luca", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "ueberrascht"], tipp: "Luca war den ganzen Tag unterwegs." },
  { gruppe: 3, text: "Amira hat ein Rechenblatt ganz allein gelöst. Die Lehrerin lobt sie vor der Klasse.", wer: "Amira", gefuehl: "froehlich", ablenker: ["traurig", "wuetend", "aengstlich"], tipp: "Amira hat etwas geschafft und bekommt ein Lob." },
  { gruppe: 3, text: "Jonas' bester Freund zieht in eine andere Stadt. Heute sagen sie sich Tschüss.", wer: "Jonas", gefuehl: "traurig", ablenker: ["froehlich", "wuetend", "muede"], tipp: "Jonas muss jemanden gehen lassen, den er mag." },
  { gruppe: 3, text: "Lea wartet in der Reihe vor der Rutschbahn. Ein Kind drängt sich einfach vor.", wer: "Lea", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "ueberrascht"], tipp: "Da ist etwas ungerecht." },
  { gruppe: 3, text: "Ben steht oben auf dem Sprungturm im Schwimmbad. Das Wasser ist sehr weit unten.", wer: "Ben", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "wuetend"], tipp: "Ben schaut hinunter, und sein Herz klopft." },
  { gruppe: 3, text: "Mia macht ihre Znünibox auf. Ein Marienkäfer sitzt darin und krabbelt heraus.", wer: "Mia", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"], tipp: "Damit hat Mia nicht gerechnet." },
  { gruppe: 3, text: "Noah hat in der Nacht kaum geschlafen. Im Unterricht gähnt er immer wieder.", wer: "Noah", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "ueberrascht"], tipp: "Noah hat zu wenig geschlafen." },
  { gruppe: 3, text: "Elin darf zum ersten Mal mit dem Velo zur Schule fahren. Sie strahlt den ganzen Weg.", wer: "Elin", gefuehl: "froehlich", ablenker: ["traurig", "aengstlich", "muede"], tipp: "Elin darf etwas, worauf sie lange gewartet hat." },
  { gruppe: 3, text: "Lucas Hamster ist gestorben. Er schaut lange in den leeren Käfig.", wer: "Luca", gefuehl: "traurig", ablenker: ["froehlich", "ueberrascht", "wuetend"], tipp: "Luca hat ein Tier verloren, das er lieb hatte." },
  { gruppe: 3, text: "Amira hat ihr Bild sorgfältig gemalt. Jonas kritzelt mit Absicht darüber.", wer: "Amira", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "aengstlich"], tipp: "Jemand hat Amira mit Absicht etwas kaputt gemacht." },
  { gruppe: 3, text: "Jonas soll im Lager allein Holz aus dem dunklen Keller holen. Die Lampe geht nicht.", wer: "Jonas", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "wuetend"], tipp: "Es ist dunkel, und Jonas ist allein." },
  { gruppe: 3, text: "Lea schaut aus dem Fenster. Auf dem Pausenplatz steht ein echtes Pony.", wer: "Lea", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"], tipp: "So etwas sieht Lea sonst nie." },
  { gruppe: 3, text: "Ben ist beim Turnen zehn Runden gerannt. Jetzt liegt er auf der Matte und will nur noch ruhen.", wer: "Ben", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "aengstlich"], tipp: "Ben hat sich sehr angestrengt." },

  // ---------- Gruppe 4: zwei Personen, feinere Gefühle; gefragt ist „wer“ ----------
  { gruppe: 4, text: "Lea hat Mia beim Üben für den Vortrag geholfen. Heute hält Mia den Vortrag ohne einen einzigen Stolperer vor der Klasse.", wer: "Mia", gefuehl: "stolz", ablenker: ["enttaeuscht", "gelangweilt", "traurig"], tipp: "Mia hat etwas Schweres geschafft, für das sie geübt hat." },
  { gruppe: 4, text: "Noah hat Elin versprochen, in der Pause mit ihr zu spielen. Dann spielt er doch mit anderen Fussball.", wer: "Elin", gefuehl: "enttaeuscht", ablenker: ["stolz", "neugierig", "froehlich"], tipp: "Elin hat auf etwas gezählt, das nicht passiert ist." },
  { gruppe: 4, text: "Luca bringt eine geheimnisvolle Kiste mit in die Schule. Amira will unbedingt wissen, was darin ist.", wer: "Amira", gefuehl: "neugierig", ablenker: ["gelangweilt", "traurig", "muede"], tipp: "Amira möchte etwas herausfinden." },
  { gruppe: 4, text: "Jonas sagt zu Lea: Du bist als Nächste mit dem Vorsingen dran. Lea geht nach vorne, ihre Hände sind feucht und ihr Herz klopft.", wer: "Lea", gefuehl: "nervoes", ablenker: ["gelangweilt", "stolz", "muede"], tipp: "Lea muss gleich etwas vor allen tun." },
  { gruppe: 4, text: "Ben erzählt Mia zum dritten Mal dieselbe Geschichte vom Fussballmatch. Mia schaut aus dem Fenster und gähnt.", wer: "Mia", gefuehl: "gelangweilt", ablenker: ["neugierig", "aengstlich", "stolz"], tipp: "Mia hört das alles schon zum dritten Mal." },
  { gruppe: 4, text: "Elin hat ihr Portemonnaie überall gesucht. Dann findet Noah es unter der Bank und gibt es ihr.", wer: "Elin", gefuehl: "erleichtert", ablenker: ["wuetend", "gelangweilt", "enttaeuscht"], tipp: "Elins Sorge ist jetzt vorbei." },
  { gruppe: 4, text: "Amira hat aus Versehen Jonas' Znüni eingepackt. Sie bringt es ihm zurück, bevor die Pause beginnt, und Jonas atmet auf.", wer: "Jonas", gefuehl: "erleichtert", ablenker: ["wuetend", "gelangweilt", "traurig"], tipp: "Jonas hat sich kurz Sorgen gemacht, und jetzt ist alles gut." },
  { gruppe: 4, text: "Lea übt mit Ben das Kopfrechnen. Beim Test schafft Ben zum ersten Mal alle Aufgaben.", wer: "Ben", gefuehl: "stolz", ablenker: ["enttaeuscht", "gelangweilt", "aengstlich"], tipp: "Ben hat etwas geschafft, das er vorher nicht konnte." },
  { gruppe: 4, text: "Mia hat Noah zu ihrem Fest eingeladen. Am Morgen ruft Mia an: Das Fest fällt aus, sie ist krank.", wer: "Noah", gefuehl: "enttaeuscht", ablenker: ["stolz", "neugierig", "erleichtert"], tipp: "Noah hat sich auf etwas gefreut, das nun nicht stattfindet." },
  { gruppe: 4, text: "Elin erzählt Luca von einer Höhle im Wald hinter dem Schulhaus. Luca fragt sie tausend Sachen und will sofort hin.", wer: "Luca", gefuehl: "neugierig", ablenker: ["gelangweilt", "enttaeuscht", "muede"], tipp: "Luca will mehr wissen und es selbst sehen." },
  { gruppe: 4, text: "Amira sagt zu Jonas: Morgen ist der Schwimmtest. Jonas kann in der Nacht kaum einschlafen und denkt immer daran.", wer: "Jonas", gefuehl: "nervoes", ablenker: ["gelangweilt", "stolz", "erleichtert"], tipp: "Jonas denkt an etwas, das erst noch kommt." },
  { gruppe: 4, text: "Lea und Ben warten auf den Zug, der eine Stunde Verspätung hat. Ben hat nichts zu tun und seufzt immer wieder.", wer: "Ben", gefuehl: "gelangweilt", ablenker: ["neugierig", "stolz", "erleichtert"], tipp: "Ben muss lange warten, und nichts passiert." },
  { gruppe: 4, text: "Mia denkt, sie hat den Vortrag vergessen. Dann sagt Noah ihr, dass der Vortrag erst nächste Woche ist.", wer: "Mia", gefuehl: "erleichtert", ablenker: ["wuetend", "gelangweilt", "enttaeuscht"], tipp: "Mias Sorge war unnötig." },
  { gruppe: 4, text: "Elin zeigt Luca, wie man einen Papierflieger faltet. Lucas Flieger fliegt beim ersten Versuch durch das ganze Zimmer.", wer: "Luca", gefuehl: "stolz", ablenker: ["enttaeuscht", "gelangweilt", "traurig"], tipp: "Luca hat etwas Neues gleich gut hingekriegt." },
  { gruppe: 4, text: "Jonas bekommt von Amira ein Bild und sagt nur: Aha. Amira hat eine ganze Woche daran gemalt.", wer: "Amira", gefuehl: "enttaeuscht", ablenker: ["stolz", "neugierig", "erleichtert"], tipp: "Amira hat sich mehr erhofft." },
  { gruppe: 4, text: "Lea bringt Mia ein Paket mit vielen Klebestreifen darum. Mia dreht es hin und her und schüttelt es.", wer: "Mia", gefuehl: "neugierig", ablenker: ["gelangweilt", "traurig", "aengstlich"], tipp: "Mia will wissen, was drin ist." },
  { gruppe: 4, text: "Noah sagt zu Elin, dass gleich ihr Name beim Vorlesen aufgerufen wird. Elin rutscht auf dem Stuhl hin und her und kaut an den Nägeln.", wer: "Elin", gefuehl: "nervoes", ablenker: ["gelangweilt", "stolz", "muede"], tipp: "Elin ist gleich dran, und das spürt sie im Körper." },
  { gruppe: 4, text: "Luca liest Amira die Anleitung vom Drucker vor. Amira schaut auf die Uhr und spielt mit ihren Haaren.", wer: "Amira", gefuehl: "gelangweilt", ablenker: ["neugierig", "aengstlich", "stolz"], tipp: "Amira hört nicht mehr richtig zu." },
];

/** Stufe 3: Körpersignale → Gefühl. */
const GS_KOERPER = [
  { satz: "Lea hat Tränen in den Augen und schaut auf den Boden.", wer: "Lea", gefuehl: "traurig", ablenker: ["froehlich", "wuetend", "ueberrascht"] },
  { satz: "Ben hat rote Ohren und ballt die Fäuste.", wer: "Ben", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "ueberrascht"] },
  { satz: "Mia hüpft und strahlt über das ganze Gesicht.", wer: "Mia", gefuehl: "froehlich", ablenker: ["traurig", "wuetend", "muede"] },
  { satz: "Noah zittert, und seine Hände sind ganz kalt.", wer: "Noah", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "wuetend"] },
  { satz: "Elin reisst die Augen auf und hält sich die Hand vor den Mund.", wer: "Elin", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"] },
  { satz: "Luca gähnt, und seine Augen fallen fast zu.", wer: "Luca", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "ueberrascht"] },
  { satz: "Amira lacht laut und klatscht in die Hände.", wer: "Amira", gefuehl: "froehlich", ablenker: ["traurig", "aengstlich", "muede"] },
  { satz: "Jonas lässt die Schultern hängen und spricht ganz leise.", wer: "Jonas", gefuehl: "traurig", ablenker: ["froehlich", "wuetend", "ueberrascht"] },
  { satz: "Lea stampft mit dem Fuss und presst die Lippen zusammen.", wer: "Lea", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "aengstlich"] },
  { satz: "Bens Herz klopft schnell, und er versteckt sich hinter Mama.", wer: "Ben", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "wuetend"] },
  { satz: "Mia bleibt mit offenem Mund stehen und sagt: Oh!", wer: "Mia", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"] },
  { satz: "Noah reibt sich die Augen und legt den Kopf auf den Tisch.", wer: "Noah", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "ueberrascht"] },
  { satz: "Elin rennt mit ausgebreiteten Armen auf ihre Freundin zu und jubelt.", wer: "Elin", gefuehl: "froehlich", ablenker: ["traurig", "wuetend", "aengstlich"] },
  { satz: "Luca schnieft und wischt sich über die Augen.", wer: "Luca", gefuehl: "traurig", ablenker: ["froehlich", "wuetend", "muede"] },
  { satz: "Amira wird rot im Gesicht und schreit: Hör auf!", wer: "Amira", gefuehl: "wuetend", ablenker: ["froehlich", "muede", "ueberrascht"] },
  { satz: "Jonas hält sich die Ohren zu und macht sich ganz klein.", wer: "Jonas", gefuehl: "aengstlich", ablenker: ["froehlich", "muede", "ueberrascht"] },
  { satz: "Lea zuckt zusammen und ruft: Was war das?", wer: "Lea", gefuehl: "ueberrascht", ablenker: ["traurig", "muede", "wuetend"] },
  { satz: "Ben streckt sich und gähnt immer wieder.", wer: "Ben", gefuehl: "muede", ablenker: ["froehlich", "wuetend", "aengstlich"] },
];

/** Stufe 5: kurzes Gespräch, gefragt ist die Stimmung der zweiten Person; danach „Was könnte … jetzt helfen?“ */
const GS_GESPRAECHE = [
  { a: ["Lea", "Kommst du morgen mit ins Schwimmbad?"], b: ["Ben", "Ich weiss nicht … ich kann noch nicht so gut schwimmen, und alle schauen zu."],
    gefuehl: "nervoes", ablenker: ["gelangweilt", "stolz", "froehlich"],
    hilfe: { richtig: "Lea sagt: Wir bleiben zusammen im flachen Becken, ich bin bei dir.", falsch: ["Lea erzählt ihm von ihrem neuen Hund.", "Lea fragt, ob er ihr Glace will."] } },
  { a: ["Mia", "Hast du mein Buch dabei? Ich brauche es heute."], b: ["Noah", "Oh nein, ich habe es zu Hause vergessen. Es tut mir so leid."],
    gefuehl: "beschaemt", ablenker: ["stolz", "gelangweilt", "froehlich"],
    hilfe: { richtig: "Mia sagt: Kein Problem, bring es einfach morgen mit.", falsch: ["Mia erzählt ihm einen Witz über Bücher.", "Mia zeigt ihm ihr neues Etui."] } },
  { a: ["Elin", "Ich habe die Mathe-Prüfung geschafft!"], b: ["Luca", "Schön für dich … ich habe schon wieder nicht alles hingekriegt."],
    gefuehl: "enttaeuscht", ablenker: ["stolz", "neugierig", "erleichtert"],
    hilfe: { richtig: "Elin sagt: Sollen wir nächste Woche zusammen üben?", falsch: ["Elin fragt ihn, ob er ihre neue Jacke mag.", "Elin erzählt ihm, was es zum Zmittag gibt."] } },
  { a: ["Amira", "Ich habe gehört, deine Katze ist wieder da!"], b: ["Jonas", "Ja! Sie war drei Tage weg, und heute Morgen sass sie vor der Tür."],
    gefuehl: "erleichtert", ablenker: ["wuetend", "gelangweilt", "traurig"],
    hilfe: { richtig: "Amira freut sich mit: Zum Glück! Erzähl, wo war sie?", falsch: ["Amira wechselt das Thema und redet vom Wetter.", "Amira fragt, ob Jonas ihr Znüni will."] } },
  { a: ["Ben", "Wollen wir die Hütte heute fertig bauen?"], b: ["Lea", "Schon wieder die Hütte? Wir bauen seit drei Tagen daran, ich will endlich etwas anderes machen."],
    gefuehl: "gelangweilt", ablenker: ["aengstlich", "stolz", "erleichtert"],
    hilfe: { richtig: "Ben sagt: Okay, dann suchen wir uns zusammen etwas Neues aus.", falsch: ["Ben holt noch mehr Bretter für die Hütte.", "Ben zeigt ihr sein neues Sackmesser."] } },
  { a: ["Mia", "Ich habe gesehen, dass du beim Turnen hingefallen bist. Alles okay?"], b: ["Noah", "Es tut nicht weh … aber alle haben gelacht."],
    gefuehl: "beschaemt", ablenker: ["stolz", "froehlich", "neugierig"],
    hilfe: { richtig: "Mia sagt: Das passiert jedem mal. Komm, wir gehen zusammen zurück.", falsch: ["Mia erzählt ihm von ihrem Hamster.", "Mia fragt, ob er ihr beim Aufräumen hilft."] } },
  { a: ["Luca", "Du hast beim Vorlesen keinen einzigen Fehler gemacht!"], b: ["Elin", "Wirklich? Ich habe so lange geübt!"],
    gefuehl: "stolz", ablenker: ["enttaeuscht", "gelangweilt", "aengstlich"],
    hilfe: { richtig: "Luca sagt: Das hat sich gelohnt, du warst richtig gut.", falsch: ["Luca erzählt, dass er gestern Pizza gegessen hat.", "Luca fragt, wo seine Mütze ist."] } },
  { a: ["Jonas", "Heute kommt ein Zauberer in die Schule!"], b: ["Amira", "Echt? Was macht er? Kann er Sachen verschwinden lassen? Wann kommt er?"],
    gefuehl: "neugierig", ablenker: ["gelangweilt", "traurig", "muede"],
    hilfe: { richtig: "Jonas erzählt ihr alles, was er über den Zauberer weiss.", falsch: ["Jonas zeigt ihr seine Hausaufgaben.", "Jonas erzählt ihr, was er gestern gegessen hat."] } },
  { a: ["Lea", "Warum bist du so still? Was ist los?"], b: ["Ben", "Meine beste Freundin ist für drei Wochen in den Ferien. Ich vermisse sie jetzt schon."],
    gefuehl: "traurig", ablenker: ["froehlich", "wuetend", "stolz"],
    hilfe: { richtig: "Lea sagt: Wollen wir ihr zusammen eine Karte schreiben?", falsch: ["Lea erzählt von ihren eigenen Ferien.", "Lea zeigt ihm ihr neues Velo."] } },
  { a: ["Mia", "Hast du schon gehört? Noah hat den Preis beim Malwettbewerb gewonnen."], b: ["Elin", "Schon wieder Noah! Immer gewinnt er, und ich gebe mir auch so viel Mühe."],
    gefuehl: "eifersuechtig", ablenker: ["froehlich", "gelangweilt", "muede"],
    hilfe: { richtig: "Mia sagt: Dein Bild war auch toll. Gewinnen ist nicht alles.", falsch: ["Mia erzählt, wie schön Noahs Bild ist.", "Mia fragt, ob Elin ihr Znüni teilt."] } },
  { a: ["Luca", "Du hast doch gesagt, du kommst zu meinem Fest!"], b: ["Jonas", "Ich wollte ja, aber Mama hat Nein gesagt. Ich hatte mich so gefreut."],
    gefuehl: "enttaeuscht", ablenker: ["stolz", "neugierig", "erleichtert"],
    hilfe: { richtig: "Luca sagt: Schade! Dann feiern wir am Montag noch ein bisschen nach.", falsch: ["Luca erzählt, wer alles zum Fest kommt.", "Luca zeigt ihm die Einladungskarte."] } },
  { a: ["Amira", "Gleich ist unser Theaterstück dran."], b: ["Lea", "Ich habe ganz kalte Hände, und ich weiss nicht mehr, wie mein erster Satz geht!"],
    gefuehl: "nervoes", ablenker: ["gelangweilt", "stolz", "muede"],
    hilfe: { richtig: "Amira sagt: Atme tief ein, ich sage dir den ersten Satz leise vor.", falsch: ["Amira erzählt, wer alles im Publikum sitzt.", "Amira fragt, ob Lea später Fussball spielt."] } },
  { a: ["Ben", "Das war aber ein langer Wandertag!"], b: ["Mia", "Ich will nur noch sitzen. Meine Beine sind wie aus Stein."],
    gefuehl: "muede", ablenker: ["froehlich", "wuetend", "neugierig"],
    hilfe: { richtig: "Ben sagt: Komm, wir setzen uns in den Schatten und trinken etwas.", falsch: ["Ben schlägt vor, noch schnell auf den Hügel zu rennen.", "Ben erzählt von seinem Fussballtraining."] } },
  { a: ["Noah", "Ich habe aus Versehen dein Heft nass gemacht."], b: ["Luca", "Was?! Das war meine ganze Arbeit von dieser Woche!"],
    gefuehl: "wuetend", ablenker: ["froehlich", "muede", "gelangweilt"],
    hilfe: { richtig: "Noah sagt: Es tut mir leid. Ich helfe dir, die Seiten neu zu schreiben.", falsch: ["Noah erzählt, wie das Wasser umgekippt ist.", "Noah fragt, ob Luca zum Fussball kommt."] } },
  { a: ["Elin", "Schau, im Garten sitzt ein Igel!"], b: ["Amira", "Was? Mitten am Tag? So etwas habe ich ja noch nie gesehen!"],
    gefuehl: "ueberrascht", ablenker: ["traurig", "gelangweilt", "muede"],
    hilfe: { richtig: "Elin sagt: Komm, wir schauen ihn ganz leise von weitem an.", falsch: ["Elin erzählt, dass es heute Spaghetti gibt.", "Elin fragt, ob Amira die Hausaufgaben hat."] } },
  { a: ["Jonas", "Kommst du mit? Wir gehen am Nachbarhaus vorbei."], b: ["Ben", "Da ist dieser grosse Hund. Er bellt so laut, ich traue mich nicht am Zaun vorbei."],
    gefuehl: "aengstlich", ablenker: ["froehlich", "gelangweilt", "stolz"],
    hilfe: { richtig: "Jonas sagt: Ich gehe mit dir, wir laufen auf der anderen Strassenseite.", falsch: ["Jonas erzählt, was er zum Znüni hat.", "Jonas zeigt ihm seinen neuen Ball."] } },
  { a: ["Lea", "Wir haben das Fussballturnier gewonnen!"], b: ["Mia", "Juhu! Ich könnte den ganzen Tag tanzen!"],
    gefuehl: "froehlich", ablenker: ["traurig", "muede", "wuetend"],
    hilfe: { richtig: "Lea tanzt mit ihr über den ganzen Platz.", falsch: ["Lea fragt, wo ihre Trinkflasche ist.", "Lea erzählt von den Hausaufgaben."] } },
];

/** Stufe 6 a: zwei Gefühle zugleich. Jedes Ablenker-Paar enthält mindestens ein klar unpassendes Gefühl. */
const GS_PAARE = [
  { text: "Das Lager ist vorbei. Lea hat die ganze Woche beim Abschlussfest geholfen, und jetzt winkt sie ihren neuen Freunden nach.", paar: ["stolz", "traurig"], ablenker: [["wuetend", "gelangweilt"], ["aengstlich", "muede"], ["froehlich", "eifersuechtig"]], tipp: "Lea hat etwas gut gemacht — und muss jetzt Abschied nehmen." },
  { text: "Ben steht am Start des Velorennens. Er hat lange trainiert und freut sich, aber sein Herz klopft bis zum Hals.", paar: ["froehlich", "nervoes"], ablenker: [["gelangweilt", "traurig"], ["wuetend", "muede"], ["enttaeuscht", "beschaemt"]], tipp: "Ben freut sich — und gleich geht es los." },
  { text: "Mia öffnet das Geschenk: ein Kätzchen! Damit hat sie nie gerechnet, und sie strahlt.", paar: ["ueberrascht", "froehlich"], ablenker: [["traurig", "muede"], ["wuetend", "gelangweilt"], ["enttaeuscht", "aengstlich"]], tipp: "Mia hat nicht damit gerechnet — und es gefällt ihr sehr." },
  { text: "Noah hat beim Fussball ein Eigentor geschossen. Sein Team hat trotzdem gewonnen, und alle jubeln.", paar: ["beschaemt", "erleichtert"], ablenker: [["wuetend", "gelangweilt"], ["traurig", "muede"], ["neugierig", "aengstlich"]], tipp: "Noah hat einen Fehler gemacht — und es ist trotzdem gut ausgegangen." },
  { text: "Elins Schwester hat ein neues Velo bekommen. Elin freut sich für sie, möchte aber auch so eines haben.", paar: ["froehlich", "eifersuechtig"], ablenker: [["traurig", "muede"], ["aengstlich", "gelangweilt"], ["wuetend", "beschaemt"]], tipp: "Elin gönnt es ihrer Schwester — und hätte es gern selbst." },
  { text: "Luca hat sich beim Rennen den Fuss verstaucht. Die Ärztin sagt, es ist nichts gebrochen, aber er darf zwei Wochen nicht Fussball spielen.", paar: ["erleichtert", "enttaeuscht"], ablenker: [["froehlich", "stolz"], ["wuetend", "neugierig"], ["gelangweilt", "ueberrascht"]], tipp: "Eine gute Nachricht und eine schlechte zugleich." },
  { text: "Amira hält ihren ersten Vortrag. Die Klasse klatscht lange, und Amira muss sich erst einmal hinsetzen und durchatmen.", paar: ["stolz", "erleichtert"], ablenker: [["traurig", "wuetend"], ["gelangweilt", "muede"], ["enttaeuscht", "aengstlich"]], tipp: "Amira hat es geschafft — und die Anspannung fällt ab." },
  { text: "Jonas darf zum ersten Mal allein mit dem Zug zum Grosi fahren. Er hat alles vorbereitet, aber es kribbelt im Bauch.", paar: ["stolz", "nervoes"], ablenker: [["traurig", "gelangweilt"], ["wuetend", "muede"], ["enttaeuscht", "eifersuechtig"]], tipp: "Jonas darf etwas Grosses — und es ist das erste Mal." },
  { text: "Ben hat den ganzen Tag im Wald eine Hütte gebaut. Am Abend steht sie fertig da, und er kann kaum noch die Arme heben.", paar: ["stolz", "muede"], ablenker: [["traurig", "wuetend"], ["aengstlich", "gelangweilt"], ["enttaeuscht", "beschaemt"]], tipp: "Ben hat etwas geschafft — und dafür den ganzen Tag gearbeitet." },
  { text: "Mia hat gehört, dass ihre Familie in eine andere Stadt zieht. Sie weiss nicht, wie die neue Schule ist, und sie muss ihre Freundinnen verlassen.", paar: ["traurig", "aengstlich"], ablenker: [["froehlich", "stolz"], ["gelangweilt", "erleichtert"], ["wuetend", "eifersuechtig"]], tipp: "Mia verliert etwas — und weiss nicht, was kommt." },
  { text: "Noahs Bruder hat ohne zu fragen Noahs Lieblingsspiel mitgenommen und es im Bus liegen lassen.", paar: ["wuetend", "traurig"], ablenker: [["froehlich", "stolz"], ["gelangweilt", "muede"], ["neugierig", "erleichtert"]], tipp: "Jemand hat etwas ohne Erlaubnis genommen — und nun ist es weg." },
  { text: "Elin findet auf dem Dachboden eine alte Kiste mit Briefen vom Urgrosi. Sie darf sie aber erst morgen mit Mama öffnen.", paar: ["neugierig", "enttaeuscht"], ablenker: [["traurig", "wuetend"], ["muede", "gelangweilt"], ["aengstlich", "beschaemt"]], tipp: "Elin will wissen, was drin ist — und muss warten." },
  { text: "Lucas Freund hat genau das Zaubertrick-Set bekommen, das Luca sich gewünscht hat. Luca will trotzdem unbedingt wissen, wie der Trick geht.", paar: ["eifersuechtig", "neugierig"], ablenker: [["traurig", "muede"], ["gelangweilt", "aengstlich"], ["stolz", "erleichtert"]], tipp: "Luca hätte es gern selbst — und will es trotzdem verstehen." },
  { text: "Amira hat beim Wettlauf den zweiten Platz gemacht. Sie hat sich den ersten gewünscht, aber sie war noch nie so schnell wie heute.", paar: ["enttaeuscht", "stolz"], ablenker: [["wuetend", "gelangweilt"], ["aengstlich", "muede"], ["beschaemt", "traurig"]], tipp: "Amira hat ihr Ziel verpasst — und doch ihr Bestes gegeben." },
  { text: "Jonas hat im Lager bis spät in die Nacht Geschichten erzählt. Am Morgen gähnt er, aber er erzählt gleich weiter, weil alle lachen.", paar: ["muede", "froehlich"], ablenker: [["traurig", "wuetend"], ["aengstlich", "enttaeuscht"], ["gelangweilt", "beschaemt"]], tipp: "Jonas hat kaum geschlafen — und es macht ihm trotzdem Spass." },
  { text: "Lea hat vergessen, dass heute der Schwimmtest ist. Dann sagt die Lehrerin, dass der Test verschoben wurde, weil das Bad geschlossen ist.", paar: ["ueberrascht", "erleichtert"], ablenker: [["traurig", "wuetend"], ["gelangweilt", "muede"], ["stolz", "eifersuechtig"]], tipp: "Lea hat mit etwas nicht gerechnet — und eine Sorge ist weg." },
  { text: "Ben hat aus Versehen Mias Zeichnung zerrissen. Mia sagt, es ist nicht schlimm, sie zeichnet es neu — aber Ben wird trotzdem rot.", paar: ["beschaemt", "erleichtert"], ablenker: [["wuetend", "gelangweilt"], ["froehlich", "stolz"], ["neugierig", "muede"]], tipp: "Ben hat etwas kaputt gemacht — und Mia ist nicht böse." },
];

/** Stufe 6 b: Welche Antwort passt zur Stimmung? Die falschen Antworten passen nicht, sind aber nicht gemein. */
const GS_REAKTIONEN = [
  { text: "Lea erzählt dir aufgeregt: Ich bin heute zum ersten Mal ohne Stützräder Velo gefahren!", wer: "Lea", richtig: "Wow, super! Wie war das?", falsch: ["Ich habe heute Spaghetti gegessen.", "Hast du das Mathe-Blatt dabei?"] },
  { text: "Ben sagt leise: Mein Hamster ist gestern gestorben.", wer: "Ben", richtig: "Das tut mir leid. Willst du darüber reden?", falsch: ["Kriegst du jetzt einen neuen?", "Hast du mein Etui gesehen?"] },
  { text: "Mia ruft wütend: Jemand hat mein Znüni aus dem Rucksack genommen!", wer: "Mia", richtig: "Das ist ärgerlich. Komm, wir suchen es zusammen.", falsch: ["Ich habe heute ein Gipfeli dabei.", "Weisst du, wann die Pause fertig ist?"] },
  { text: "Noah flüstert: Ich traue mich nicht auf den hohen Sprungturm.", wer: "Noah", richtig: "Musst du nicht. Wir springen zusammen vom kleinen Brett.", falsch: ["Ich springe vom höchsten Turm, schau zu!", "Hast du meine Schwimmbrille gesehen?"] },
  { text: "Elin staunt: Schau, da fliegt ein Heissluftballon über das Schulhaus!", wer: "Elin", richtig: "Wow, wo? Den will ich auch sehen!", falsch: ["Hast du die Hausaufgaben gemacht?", "Mir ist kalt."] },
  { text: "Luca gähnt: Ich bin so müde, ich habe die ganze Nacht kaum geschlafen.", wer: "Luca", richtig: "Setz dich kurz hin, ich hole dir Wasser.", falsch: ["Wollen wir eine Runde ums Schulhaus rennen?", "Ich habe eine neue Trinkflasche."] },
  { text: "Amira zeigt stolz ihr Bild: Ich habe drei Tage daran gemalt!", wer: "Amira", richtig: "Das sieht toll aus! Was ist das für ein Tier?", falsch: ["Mein Bild ist auch fertig.", "Wann gibt es Zmittag?"] },
  { text: "Jonas sagt enttäuscht: Mein Fussballtraining fällt aus, dabei habe ich mich so gefreut.", wer: "Jonas", richtig: "Schade! Wollen wir stattdessen auf dem Pausenplatz kicken?", falsch: ["Ich gehe heute ins Kino.", "Gib mir mal den Radiergummi."] },
  { text: "Lea sagt nervös: Gleich muss ich mein Gedicht vor der ganzen Klasse aufsagen.", wer: "Lea", richtig: "Du kannst das. Ich sitze vorne und schaue dich an.", falsch: ["Ich habe gestern Pizza gegessen.", "Hast du den Bleistift gespitzt?"] },
  { text: "Ben seufzt: Der Regen hört nicht auf, und mir ist so langweilig.", wer: "Ben", richtig: "Wollen wir zusammen ein Spiel spielen?", falsch: ["Ich habe heute früh geduscht.", "Weisst du, wo mein Turnsack ist?"] },
  { text: "Mia atmet auf: Mein Schlüssel war die ganze Zeit in der Jackentasche!", wer: "Mia", richtig: "Zum Glück! Da bist du bestimmt froh.", falsch: ["Ich habe heute Mathe.", "Kommst du mit zum Kiosk?"] },
  { text: "Noah sagt leise: Alle haben ein neues Velo, nur ich nicht.", wer: "Noah", richtig: "Dein Velo ist doch super. Wollen wir eine Runde fahren?", falsch: ["Meins ist ganz neu und rot.", "Weisst du, wann der Bus kommt?"] },
  { text: "Elin wird rot: Ich habe im Turnen den Ball ins eigene Tor geschossen.", wer: "Elin", richtig: "Das passiert jedem mal. Nächstes Mal klappt es.", falsch: ["Ich habe heute ein neues Trikot.", "Wie spät ist es?"] },
  { text: "Luca fragt neugierig: Was ist wohl in der grossen Kiste beim Lehrerpult?", wer: "Luca", richtig: "Keine Ahnung! Wollen wir die Lehrerin fragen?", falsch: ["Ich habe eine neue Mütze.", "Mir ist gerade sehr warm."] },
  { text: "Amira sagt mit Tränen: Meine beste Freundin zieht nächsten Monat weg.", wer: "Amira", richtig: "Das ist traurig. Wir können ihr zusammen Briefe schreiben.", falsch: ["Ich ziehe nie um.", "Hast du den Radiergummi?"] },
  { text: "Jonas hüpft herum: Morgen fahren wir ins Lager!", wer: "Jonas", richtig: "Cool! Was nimmst du alles mit?", falsch: ["Ich gehe jetzt nach Hause.", "Hast du deine Jacke gefunden?"] },
];
