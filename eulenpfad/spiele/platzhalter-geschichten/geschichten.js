/* Geschichten für die Platzhalter-Geschichten — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan MA.3.C.2: b (1. Zyklus) zu Sachsituationen Grundoperationen notieren und lösen; c (Grundanspruch
   2. Zyklus, 3. Klasse) zu Sachsituationen Rechnungen mit Platzhaltern bzw. Umkehroperationen notieren und
   lösen; d (4. Klasse) im Zahlenraum bis 1000 und darüber (Annahme). MA.3.C.3: Rechnungen eine Bedeutung
   geben (c/d). Alle Geschichten selbst geschrieben, Schweizer Alltag, Schweizer Schreibweise (ss).

   Schreibweise je Eintrag:
   - g: Gruppe 1 bis 20 (Stufe 1) · 2 bis 100 (Stufen 2–4) · 3 bis 1000 (Stufen 5 und 6) · 4 Zweischritt bis
     10 000 (Stufe 6).
   - bild: Bildzeichen für die Bildreihe der Stufe 1.
   - text: die Geschichte. {a}, {b}, {c} … werden durch Zahlen ersetzt; {geld a} schreibt a Franken über
     LS.geldText; {b:Kind|Kinder} wählt die Einzahl, wenn b = 1 ist, sonst die Mehrzahl.
   - zahlen: Bereiche [min, max] der gezogenen Zahlen; abgeleitet: weitere Zahlen als Ausdruck („b + c“,
     „a · b“; mal und geteilt vor plus und minus). So sind Differenzen nie negativ und Divisionen ohne Rest.
   - gross: Bereiche, die in Stufe 4 die aus zahlen ersetzen (Ergebnis bei mal und geteilt bis 1000).
   - gl: die Gleichung, in eckigen Klammern die Lücke: „a + [b] = c“ heisst 28 + _ = 50. Steht ein Buchstabe
     in der Lücke, muss sein Wert (aus zahlen oder abgeleitet) die Gleichung erfüllen; [s] ist eine
     Lücke ohne eigene Zahl, das Spiel rechnet sie aus. Der Buchstabe der Lücke darf nicht im Text stehen —
     die Geschichte fragt nach ihm. Gruppe 4: zwei Gleichungen in einer Liste; die zweite darf die Lücke
     der ersten brauchen.
   - varianten (Gruppe 3): drei Geschichten zu denselben Zahlen, je { text, gl }. In Stufe 5 ist jede
     Variante mit Lücke vorn oder in der Mitte eine eigene Aufgabe. In der Königsstufe zeigt das Spiel die
     Gleichung einer Variante, deren Lösung sich von den anderen zwei unterscheidet, und das Kind sucht die
     passende Geschichte; die anderen zwei sind die Ablenker (gleiche Zahlen, andere Rolle).
   Das Spiel prüft jede Aufgabe (pruefeAufgabe): Zahlenraum, Gleichung erfüllt, Umkehrrechnung liefert
   die Lösung, Optionen verschieden, Einzahl bei 1, kein ß.

   Inhaltsliste (Entscheid L4 a): eine Liste „geschichten“; der Prüfstand steht im Katalog
   (spiele/gemeinsam/katalog.js, Eintrag platzhalter-geschichten, Feld listen). */

const PLATZHALTER_LISTE = "geschichten";

const PLATZHALTER_GESCHICHTEN = [
  // ---------- Gruppe 1: bis 20, mit Bild, Lücke am Ende (7 + 5 = _) ----------
  { g: 1, bild: "🍎", text: "Im Korb liegen {a} Äpfel. Mama legt {b} dazu. Wie viele Äpfel sind jetzt im Korb?",
    zahlen: { a: [3, 12], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🐦", text: "Auf dem Dach sitzen {a} Spatzen. {b} fliegen weg. Wie viele Spatzen sitzen noch da?",
    zahlen: { b: [2, 8], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "🚲", text: "Vor der Schule stehen {a} Velos. {b} Kinder stellen ihr Velo dazu. Wie viele Velos stehen jetzt da?",
    zahlen: { a: [4, 12], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🧁", text: "Auf dem Teller liegen {a} Muffins. {b} werden gegessen. Wie viele Muffins bleiben?",
    zahlen: { b: [2, 8], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "🚌", text: "Im Bus sitzen {a} Kinder. An der Haltestelle steigen {b} ein. Wie viele Kinder sitzen jetzt im Bus?",
    zahlen: { a: [3, 12], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🎈", text: "Lena hat {a} Ballone. {b} fliegen davon. Wie viele Ballone hat Lena noch?",
    zahlen: { b: [2, 7], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "⚽", text: "Auf dem Pausenplatz spielen {a} Kinder Fussball. {b} Kinder kommen dazu. Wie viele spielen jetzt?",
    zahlen: { a: [4, 12], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🥕", text: "Im Beet wachsen {a} Rüebli. Der Hase frisst {b}. Wie viele Rüebli bleiben?",
    zahlen: { b: [2, 8], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "📚", text: "Noah leiht {a} Bücher aus. Seine Schwester leiht {b} aus. Wie viele Bücher nehmen sie mit?",
    zahlen: { a: [3, 10], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🍪", text: "In der Dose sind {a} Guetsli. Finn isst {b}. Wie viele Guetsli sind noch in der Dose?",
    zahlen: { b: [2, 8], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "⭐", text: "Mia hat {a} Sammelbilder. Sie bekommt {b} geschenkt. Wie viele Sammelbilder hat sie jetzt?",
    zahlen: { a: [5, 12], b: [2, 8] }, gl: "a + b = [c]" },
  { g: 1, bild: "🧦", text: "An der Leine hängen {a} Socken. Der Wind weht {b} weg. Wie viele Socken hängen noch?",
    zahlen: { b: [2, 8], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "🐸", text: "Am Teich sitzen {a} Frösche. {b} hüpfen ins Wasser. Wie viele Frösche sitzen noch am Teich?",
    zahlen: { b: [2, 7], c: [2, 10] }, abgeleitet: { a: "b + c" }, gl: "a − b = [c]" },
  { g: 1, bild: "🍓", text: "Elin pflückt {a} Erdbeeren. Dann pflückt sie noch {b}. Wie viele Erdbeeren hat sie?",
    zahlen: { a: [4, 12], b: [2, 8] }, gl: "a + b = [c]" },

  // ---------- Gruppe 2: bis 100, Lücke vorn oder in der Mitte ----------
  // plus, Lücke in der Mitte (a + _ = c)
  { g: 2, text: "Jonas hat {geld a} im Kässeli. Zum Geburtstag bekommt er Geld dazu. Jetzt hat er {geld c}. Wie viel Geld hat er bekommen?",
    zahlen: { a: [12, 55], b: [5, 40] }, abgeleitet: { c: "a + b" }, gl: "a + [b] = c" },
  { g: 2, text: "Im Zug sitzen {a} Leute. In Olten steigen Leute ein. Jetzt sind es {c}. Wie viele Leute sind eingestiegen?",
    zahlen: { a: [20, 60], b: [8, 38] }, abgeleitet: { c: "a + b" }, gl: "a + [b] = c" },
  { g: 2, text: "Mia liest ein Buch mit {c} Seiten. {a} Seiten hat sie schon gelesen. Wie viele Seiten fehlen noch?",
    zahlen: { a: [12, 55], b: [8, 40] }, abgeleitet: { c: "a + b" }, gl: "a + [b] = c" },
  // minus, Lücke in der Mitte (a − _ = c)
  { g: 2, text: "Am Morgen liegen {a} Gipfeli in der Bäckerei. Am Mittag sind noch {c} da. Wie viele Gipfeli wurden verkauft?",
    zahlen: { b: [10, 50], c: [5, 45] }, abgeleitet: { a: "b + c" }, gl: "a − [b] = c" },
  { g: 2, text: "Auf dem Pausenplatz sind {a} Kinder. Es läutet, und einige gehen hinein. Draussen bleiben {c}. Wie viele Kinder sind hineingegangen?",
    zahlen: { b: [8, 45], c: [5, 40] }, abgeleitet: { a: "b + c" }, gl: "a − [b] = c" },
  // plus, Lücke vorn (_ + b = c)
  { g: 2, text: "Im Velokeller stehen Velos. {b} Velos kommen dazu. Jetzt sind es {c}. Wie viele Velos waren es zuerst?",
    zahlen: { a: [10, 50], b: [5, 30] }, abgeleitet: { c: "a + b" }, gl: "[a] + b = c" },
  { g: 2, text: "Lena hat Sammelbilder. Sie bekommt {b} dazu. Jetzt hat sie {c}. Wie viele hatte sie zuerst?",
    zahlen: { a: [12, 60], b: [5, 35] }, abgeleitet: { c: "a + b" }, gl: "[a] + b = c" },
  // minus, Lücke vorn (_ − b = c)
  { g: 2, text: "Noah hat Guetsli gebacken. Er verschenkt {b}. Jetzt hat er noch {c}. Wie viele Guetsli hat er gebacken?",
    zahlen: { b: [8, 40], c: [5, 45] }, abgeleitet: { a: "b + c" }, gl: "[a] − b = c" },
  { g: 2, text: "Im Zug sitzen Leute. In Bern steigen {b} aus. Danach sind noch {c} im Zug. Wie viele Leute waren es vor Bern?",
    zahlen: { b: [10, 45], c: [10, 50] }, abgeleitet: { a: "b + c" }, gl: "[a] − b = c" },
  // mal (a · _ = c, _ · b = c)
  { g: 2, text: "Die Bäckerei packt Guetsli in Säckli, {a} in jedes. Es sind {c} Guetsli. Wie viele Säckli werden voll?",
    zahlen: { a: [3, 9], b: [3, 10] }, abgeleitet: { c: "a · b" }, gross: { b: [12, 45] }, gl: "a · [b] = c" },
  { g: 2, text: "Ein Zug hat {b} Wagen. In jedem Wagen sitzen gleich viele Leute, zusammen {c}. Wie viele Leute sitzen in einem Wagen?",
    zahlen: { a: [5, 12], b: [2, 8] }, abgeleitet: { c: "a · b" }, gross: { a: [15, 60], b: [3, 12] }, gl: "[a] · b = c" },
  // geteilt (a : _ = c, _ : b = c)
  { g: 2, text: "Die Lehrerin hat {a} Farbstifte. Sie verteilt sie gerecht auf Gruppen. Jede Gruppe bekommt {c} Stifte. Wie viele Gruppen sind es?",
    zahlen: { b: [2, 9], c: [3, 10] }, abgeleitet: { a: "b · c" }, gross: { c: [12, 40] }, gl: "a : [b] = c" },
  { g: 2, text: "{a} Kinder fahren mit dem Car auf die Schulreise. In jeder Sitzreihe sitzen gleich viele. Es braucht {c} Reihen. Wie viele Kinder sitzen in einer Reihe?",
    zahlen: { b: [3, 5], c: [4, 20] }, abgeleitet: { a: "b · c" }, gl: "a : [b] = c" },
  { g: 2, text: "Mia verteilt ihre Sammelbilder gerecht an {b} Freundinnen. Jede bekommt {c} Bilder. Wie viele Sammelbilder hat Mia verteilt?",
    zahlen: { b: [2, 6], c: [3, 12] }, abgeleitet: { a: "b · c" }, gross: { c: [12, 60] }, gl: "[a] : b = c" },
  { g: 2, text: "Die Bäckerei verteilt alle Brötli auf {b} Körbe, in jeden gleich viele. In jedem Korb liegen {c}. Wie viele Brötli sind es zusammen?",
    zahlen: { b: [3, 8], c: [4, 12] }, abgeleitet: { a: "b · c" }, gross: { c: [15, 60] }, gl: "[a] : b = c" },

  // ---------- Gruppe 3: bis 1000, je drei Varianten zu denselben Zahlen ----------
  { g: 3, zahlen: { a: [120, 600], b: [50, 350] }, abgeleitet: { c: "a + b" }, varianten: [
    { text: "Die Bibliothek hat {a} Bücher. Sie kauft neue dazu. Jetzt sind es {c}. Wie viele Bücher hat sie gekauft?", gl: "a + [b] = c" },
    { text: "Die Bibliothek hat {a} Bücher. Sie kauft {c} neue dazu. Wie viele Bücher hat sie jetzt?", gl: "a + c = [s]" },
    { text: "Die Bibliothek hatte viele Bücher. Sie gibt {a} alte weg. Jetzt sind es noch {c}. Wie viele waren es zuerst?", gl: "[s] − a = c" },
  ] },
  { g: 3, zahlen: { b: [80, 400], c: [60, 450] }, abgeleitet: { a: "b + c" }, varianten: [
    { text: "Im Zug nach Chur sitzen {a} Leute. In Sargans steigen viele aus. Danach sind noch {c} im Zug. Wie viele sind ausgestiegen?", gl: "a − [b] = c" },
    { text: "Im Zug nach Chur sitzen {a} Leute. In Sargans steigen {c} ein. Wie viele sind jetzt im Zug?", gl: "a + c = [s]" },
    { text: "Im Zug nach Chur sassen Leute. In Sargans steigen {a} aus. Danach sind noch {c} im Zug. Wie viele waren es vorher?", gl: "[s] − a = c" },
  ] },
  { g: 3, zahlen: { a: [12, 48], b: [4, 20] }, abgeleitet: { c: "a · b" }, varianten: [
    { text: "Die Bäckerei backt Gipfeli auf Blechen, {a} auf jedem Blech. Am Morgen sind {c} Gipfeli fertig. Wie viele Bleche waren das?", gl: "a · [b] = c" },
    { text: "Die Bäckerei hat {c} Gipfeli gebacken. {a} davon sind schon verkauft. Wie viele sind noch da?", gl: "c − a = [s]" },
    { text: "Die Bäckerei backt {c} Gipfeli und dazu {a} Brötli. Wie viele Stück backt sie zusammen?", gl: "c + a = [s]" },
  ] },
  { g: 3, zahlen: { b: [5, 25], c: [12, 40] }, abgeleitet: { a: "b · c" }, varianten: [
    { text: "An der Schule sind {a} Kinder. Für den Sporttag werden sie in gleich grosse Gruppen eingeteilt. Es gibt {c} Gruppen. Wie viele Kinder sind in einer Gruppe?", gl: "a : [b] = c" },
    { text: "An der Schule sind {a} Kinder. Am Sporttag sind {c} Kinder krank. Wie viele Kinder machen mit?", gl: "a − c = [s]" },
    { text: "Am Sporttag sind {a} Kinder und {c} Erwachsene auf dem Platz. Wie viele Leute sind es zusammen?", gl: "a + c = [s]" },
  ] },
  { g: 3, zahlen: { a: [120, 500], b: [50, 400] }, abgeleitet: { c: "a + b" }, varianten: [
    { text: "Nino spart für ein Velo. Er hat {geld a} im Kässeli. Von den Grosseltern bekommt er Geld dazu. Jetzt hat er {geld c}. Wie viel hat er bekommen?", gl: "a + [b] = c" },
    { text: "Nino hat {geld a} im Kässeli. Von den Grosseltern bekommt er {geld c} dazu. Wie viel Geld hat er jetzt?", gl: "a + c = [s]" },
    { text: "Nino hatte Geld im Kässeli. Er kauft ein Velo für {geld a}. Jetzt hat er noch {geld c}. Wie viel hatte er zuerst?", gl: "[s] − a = c" },
  ] },
  { g: 3, zahlen: { b: [200, 500], c: [50, 190] }, abgeleitet: { a: "b + c" }, varianten: [
    { text: "Lia hatte viele Sammelbilder. Sie tauscht {b} weg. Jetzt hat sie noch {c}. Wie viele hatte sie zuerst?", gl: "[a] − b = c" },
    { text: "Lia hat {b} Sammelbilder. Sie tauscht einige weg. Jetzt hat sie noch {c}. Wie viele hat sie weggetauscht?", gl: "b − [s] = c" },
    { text: "Lia hat {c} Sammelbilder. Sie möchte {b} haben. Wie viele fehlen ihr noch?", gl: "c + [s] = b" },
  ] },
  { g: 3, zahlen: { a: [15, 80], b: [3, 12] }, abgeleitet: { c: "a · b" }, varianten: [
    { text: "Finn fährt an jedem Tag der Velotour gleich weit. Nach {b} Tagen hat er {c} km geschafft. Wie viele Kilometer fährt er an einem Tag?", gl: "[a] · b = c" },
    { text: "Finn plant eine Velotour von {c} km. {b} km ist er schon gefahren. Wie viele Kilometer fehlen noch?", gl: "c − b = [s]" },
    { text: "Finn fährt {c} km mit dem Velo und geht {b} km zu Fuss. Wie viele Kilometer ist er unterwegs?", gl: "c + b = [s]" },
  ] },
  { g: 3, zahlen: { b: [5, 16], c: [30, 60] }, abgeleitet: { a: "b · c" }, varianten: [
    { text: "Für den Znüni-Tag verteilt der Hauswart alle Äpfel gerecht auf {b} Klassen. Jede Klasse bekommt {c} Äpfel. Wie viele Äpfel hat er verteilt?", gl: "[a] : b = c" },
    { text: "Der Hauswart hat {b} Kisten Äpfel und {c} Kisten Birnen für den Znüni-Tag. Wie viele Kisten sind es?", gl: "b + c = [s]" },
    { text: "Der Hauswart hat {c} Äpfel für den Znüni-Tag. {b} davon sind faul. Wie viele kann er verteilen?", gl: "c − b = [s]" },
  ] },
  { g: 3, zahlen: { a: [150, 500], b: [60, 450] }, abgeleitet: { c: "a + b" }, varianten: [
    { text: "Die Bäckerei backt am Morgen {a} Brötli. Am Mittag backt sie noch einmal. Am Abend hat sie {c} Brötli gebacken. Wie viele hat sie am Mittag gebacken?", gl: "a + [b] = c" },
    { text: "Die Bäckerei backt am Morgen {a} Brötli und am Mittag {c}. Wie viele Brötli hat sie gebacken?", gl: "a + c = [s]" },
    { text: "Die Bäckerei hat Brötli gebacken. Sie verkauft {a}. Jetzt sind noch {c} da. Wie viele hat sie gebacken?", gl: "[s] − a = c" },
  ] },
  { g: 3, zahlen: { b: [80, 450], c: [40, 400] }, abgeleitet: { a: "b + c" }, varianten: [
    { text: "Am Samstag kommen {a} Leute ins Hallenbad. Am Nachmittag gehen viele nach Hause. Am Abend sind noch {c} da. Wie viele sind gegangen?", gl: "a − [b] = c" },
    { text: "Am Samstag kommen {a} Leute ins Hallenbad, am Sonntag {c}. Wie viele Leute waren es am Wochenende?", gl: "a + c = [s]" },
    { text: "Am Samstag waren Leute im Hallenbad. {a} gehen am Mittag nach Hause. Jetzt sind noch {c} da. Wie viele waren es?", gl: "[s] − a = c" },
  ] },
  { g: 3, zahlen: { a: [4, 9], b: [12, 100] }, abgeleitet: { c: "a · b" }, varianten: [
    { text: "In jedem Päckli sind {a} Sammelbilder. Die Klasse hat zusammen {c} Bilder aus Päckli. Wie viele Päckli hat sie geöffnet?", gl: "a · [b] = c" },
    { text: "Die Klasse hat {c} Sammelbilder. {a} davon sind doppelt. Wie viele sind nicht doppelt?", gl: "c − a = [s]" },
    { text: "Die Klasse hat {c} Sammelbilder. Sie bekommt {a} dazu. Wie viele hat sie jetzt?", gl: "c + a = [s]" },
  ] },
  { g: 3, zahlen: { b: [8, 30], c: [15, 30] }, abgeleitet: { a: "b · c" }, varianten: [
    { text: "Die Schulreise kostet für alle zusammen {geld a}. Jedes Kind zahlt gleich viel. {c} Kinder fahren mit. Wie viel zahlt ein Kind?", gl: "a : [b] = c" },
    { text: "Die Schulreise kostet {geld a}. {geld c} hat die Klasse schon gesammelt. Wie viel fehlt noch?", gl: "a − c = [s]" },
    { text: "Die Schulreise kostet {geld a}. Der Zoo kostet noch {geld c} dazu. Wie viel kostet alles zusammen?", gl: "a + c = [s]" },
  ] },

  // ---------- Gruppe 4: Zweischritt-Geschichten bis 10 000, zwei Lücken nacheinander ----------
  { g: 4, text: "Die Bibliothek hat {a} Bücher. Sie kauft neue dazu, jetzt sind es {c}. Davon sind {d} ausgeliehen. Wie viele Bücher hat sie gekauft? Und wie viele stehen noch im Regal?",
    zahlen: { a: [1200, 6000], b: [300, 2500], d: [200, 1400] }, abgeleitet: { c: "a + b", e: "c − d" }, gl: ["a + [b] = c", "c − d = [e]"] },
  { g: 4, text: "Der Zug hat {a} Plätze. In Zürich sind einige Plätze frei, {c} sind besetzt. In Bern steigen {d} Leute aus. Wie viele Plätze waren in Zürich frei? Wie viele Leute sitzen nach Bern noch im Zug?",
    zahlen: { a: [400, 900], b: [50, 300], d: [40, 90] }, abgeleitet: { c: "a − b", e: "c − d" }, gl: ["a − [b] = c", "c − d = [e]"] },
  { g: 4, text: "Die Bäckerei backt Gipfeli, {a} auf jedem Blech. Am Morgen sind {c} Gipfeli fertig. Bis zum Mittag werden {d} verkauft. Wie viele Bleche hat die Bäckerei gebacken? Wie viele Gipfeli sind am Mittag noch da?",
    zahlen: { a: [20, 40], b: [10, 30], d: [50, 180] }, abgeleitet: { c: "a · b", e: "c − d" }, gl: ["a · [b] = c", "c − d = [e]"] },
  { g: 4, text: "Lia hat {a} Sammelbilder. Sie bekommt noch viele dazu, jetzt sind es {c}. Sie klebt alle in Alben mit je {d} Bildern. Wie viele Bilder hat sie bekommen? Wie viele Alben füllt sie?",
    zahlen: { d: [20, 50], e: [30, 100], a: [100, 500] }, abgeleitet: { c: "d · e", b: "c − a" }, gl: ["a + [b] = c", "c : d = [e]"] },
  { g: 4, text: "Die Schule sammelt Geld für das Schulfest. Zuerst hat sie {geld a}. Nach dem Kuchenverkauf hat sie {geld c}. Davon zahlt sie {geld d} für die Musik. Wie viel hat der Kuchenverkauf gebracht? Wie viel Geld bleibt?",
    zahlen: { a: [1500, 4000], b: [500, 3000], d: [300, 1400] }, abgeleitet: { c: "a + b", e: "c − d" }, gl: ["a + [b] = c", "c − d = [e]"] },
  { g: 4, text: "Die Klasse fährt auf der Velotour jeden Tag gleich weit. Nach {b} Tagen sind es {c} km. Die ganze Tour ist {d} km lang. Wie viele Kilometer fährt die Klasse an einem Tag? Wie viele Kilometer fehlen noch?",
    zahlen: { a: [20, 60], b: [3, 6], d: [400, 900] }, abgeleitet: { c: "a · b", e: "d − c" }, gl: ["[a] · b = c", "d − c = [e]"] },
  { g: 4, text: "Das Hallenbad verkauft {a} Eintritte. Jeder Eintritt kostet gleich viel. Zusammen nimmt es {geld c} ein. Davon zahlt es {geld d} für den Bademeister. Wie viel kostet ein Eintritt? Wie viel Geld bleibt?",
    zahlen: { a: [150, 600], b: [4, 12], d: [300, 500] }, abgeleitet: { c: "a · b", e: "c − d" }, gl: ["a · [b] = c", "c − d = [e]"] },
  { g: 4, text: "Auf dem Pausenplatz sind {a} Kinder. Es läutet, einige gehen hinein, {c} bleiben draussen. Dann kommen {d} Kinder aus dem Kindergarten dazu. Wie viele Kinder sind hineingegangen? Wie viele sind jetzt draussen?",
    zahlen: { b: [30, 200], c: [40, 300], d: [10, 60] }, abgeleitet: { a: "b + c", e: "c + d" }, gl: ["a − [b] = c", "c + d = [e]"] },
  { g: 4, text: "In Olten steigen Leute in den Zug. Vorher sassen {a} Leute drin, nachher {c}. In Aarau steigen Leute aus, dann sind es noch {e}. Wie viele sind in Olten eingestiegen? Wie viele sind in Aarau ausgestiegen?",
    zahlen: { a: [200, 500], b: [60, 400], d: [50, 250] }, abgeleitet: { c: "a + b", e: "c − d" }, gl: ["a + [b] = c", "c − [d] = e"] },
  { g: 4, text: "Die Bäckerei bestellt Mehl. Im Lager liegen {a} kg. Nach der Lieferung sind es {c} kg. Jeden Tag braucht sie {d} kg. Wie viele Kilogramm wurden geliefert? Für wie viele Tage reicht das Mehl?",
    zahlen: { d: [20, 60], e: [30, 150], a: [100, 550] }, abgeleitet: { c: "d · e", b: "c − a" }, gl: ["a + [b] = c", "c : d = [e]"] },
  { g: 4, text: "Noah kauft Päckli mit Sammelbildern, in jedem sind {a} Bilder. Zusammen hat er {c} Bilder. {d} davon hat er doppelt. Wie viele Päckli hat er gekauft? Wie viele Bilder hat er nur einmal?",
    zahlen: { a: [5, 8], b: [25, 120], d: [20, 100] }, abgeleitet: { c: "a · b", e: "c − d" }, gl: ["a · [b] = c", "c − d = [e]"] },
];
