/* Pflanzen für den Pflanzen-Bestimmer — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.2.4.e: Pflanzen Ordnungssystemen zuordnen, mit Blattformen und Blütenaufbau.
   Das Spiel zeichnet Blätter, Zweige und Blüten selbst nach diesen Merkmalen (keine Fotos).

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „pflanzen“ (Katalog, Eintrag „pflanzen-bestimmer“).

   Schreibweise je Eintrag (null = nicht eindeutig oder für die Zeichnung nicht sicher, kommt dann nicht vor):
     name       Name der Pflanze
     gruppe     „Laubbaum“, „Nadelbaum“, „Strauch“ oder „Blume“
     blatt      „nadelförmig“, „eiförmig“, „herzförmig“, „lanzettlich“, „dreieckig“, „gelappt“,
                „gefingert“, „gefiedert“, „dreizählig“
     lappen     bei „gelappt“: „hand“ (wie eine Hand, Ahorn) oder „fieder“ (links und rechts, Eiche)
     teile      bei zusammengesetzten Blättern: Zahl der gezeichneten Blättchen (gerundet, typisch)
     rand       „glatt“, „gesägt“ oder „gekerbt“ (rundliche Zähne)
     stellung   „gegenständig“ (zwei Blätter auf gleicher Höhe) oder „wechselständig“ (abwechselnd)
     nadeln     bei Nadelbäumen: „einzeln“, „zu zweit“, „zu fünft“ oder „Büschel“
     bluete     { zahl: Zahl der Blütenblätter oder „viele“ (Körbchen/Köpfchen aus vielen kleinen Blüten),
                  farbe: „weiss“, „gelb“, „rot“, „rosa“, „blau“, „violett“, „hellviolett“ }
     merke      ein kurzer Satz zum Merken
   Schweizer Schreibweise (ss statt ß). */

const PFLANZEN_LISTE = [
  // ---------- Laubbäume ----------
  { name: "Rotbuche", gruppe: "Laubbaum", blatt: "eiförmig", rand: "glatt", stellung: "wechselständig", merke: "Der häufigste Laubbaum im Schweizer Wald." },
  { name: "Stieleiche", gruppe: "Laubbaum", blatt: "gelappt", lappen: "fieder", rand: "glatt", stellung: "wechselständig", merke: "Ihre Früchte sind Eicheln." },
  { name: "Bergahorn", gruppe: "Laubbaum", blatt: "gelappt", lappen: "hand", rand: "gesägt", stellung: "gegenständig", merke: "Seine Früchte fliegen wie kleine Propeller." },
  { name: "Spitzahorn", gruppe: "Laubbaum", blatt: "gelappt", lappen: "hand", rand: null, stellung: "gegenständig", merke: "Seine Blattlappen enden in feinen Spitzen." },
  { name: "Rosskastanie", gruppe: "Laubbaum", blatt: "gefingert", teile: 7, rand: "gesägt", stellung: "gegenständig", merke: "Ihre Früchte sind Kastanien in einer stacheligen Hülle." },
  { name: "Winterlinde", gruppe: "Laubbaum", blatt: "herzförmig", rand: "gesägt", stellung: "wechselständig", merke: "Ihre Blüten duften im Sommer süss." },
  { name: "Hängebirke", gruppe: "Laubbaum", blatt: "dreieckig", rand: "gesägt", stellung: "wechselständig", merke: "Sie hat eine weisse Rinde." },
  { name: "Esche", gruppe: "Laubbaum", blatt: "gefiedert", teile: 11, rand: "gesägt", stellung: "gegenständig", merke: "Ihre Knospen sind schwarz." },
  { name: "Vogelbeere", gruppe: "Laubbaum", blatt: "gefiedert", teile: 13, rand: "gesägt", stellung: "wechselständig", bluete: { zahl: 5, farbe: "weiss" }, merke: "Ihre roten Beeren fressen die Vögel gern." },
  { name: "Walnussbaum", gruppe: "Laubbaum", blatt: "gefiedert", teile: 7, rand: "glatt", stellung: "wechselständig", merke: "Seine Früchte sind Baumnüsse." },
  { name: "Hainbuche", gruppe: "Laubbaum", blatt: "eiförmig", rand: "gesägt", stellung: "wechselständig", merke: "Sie wird oft als Hecke geschnitten." },
  { name: "Silberweide", gruppe: "Laubbaum", blatt: "lanzettlich", rand: "gesägt", stellung: "wechselständig", merke: "Sie wächst gern am Wasser." },
  { name: "Vogelkirsche", gruppe: "Laubbaum", blatt: "eiförmig", rand: "gesägt", stellung: "wechselständig", bluete: { zahl: 5, farbe: "weiss" }, merke: "Sie blüht im Frühling weiss im Wald." },
  { name: "Apfelbaum", gruppe: "Laubbaum", blatt: "eiförmig", rand: "gesägt", stellung: "wechselständig", bluete: { zahl: 5, farbe: "weiss" }, merke: "Seine Blüten sind weiss, oft rosa angehaucht." },
  { name: "Robinie", gruppe: "Laubbaum", blatt: "gefiedert", teile: 11, rand: "glatt", stellung: "wechselständig", merke: "Sie hat Dornen an den Zweigen." },
  // ---------- Sträucher ----------
  { name: "Schwarzer Holunder", gruppe: "Strauch", blatt: "gefiedert", teile: 5, rand: "gesägt", stellung: "gegenständig", bluete: { zahl: 5, farbe: "weiss" }, merke: "Aus seinen Blüten macht man Sirup." },
  { name: "Hundsrose", gruppe: "Strauch", blatt: "gefiedert", teile: 5, rand: "gesägt", stellung: "wechselständig", bluete: { zahl: 5, farbe: "rosa" }, merke: "Ihre roten Früchte heissen Hagebutten." },
  // ---------- Nadelbäume ----------
  { name: "Fichte (Rottanne)", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "einzeln", rand: null, stellung: null, merke: "Ihre Nadeln sind spitz und stechen. Die Zapfen hängen." },
  { name: "Weisstanne", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "einzeln", rand: null, stellung: null, merke: "Ihre Nadeln sind flach, unten mit zwei weissen Streifen. Die Zapfen stehen aufrecht." },
  { name: "Waldföhre", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "zu zweit", rand: null, stellung: null, merke: "Ihre Nadeln wachsen zu zweit." },
  { name: "Lärche", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "Büschel", rand: null, stellung: null, merke: "Im Herbst werden ihre Nadeln gelb und fallen ab." },
  { name: "Arve", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "zu fünft", rand: null, stellung: null, merke: "Ihre Nadeln wachsen zu fünft. Sie wächst hoch in den Alpen." },
  { name: "Eibe", gruppe: "Nadelbaum", blatt: "nadelförmig", nadeln: "einzeln", rand: null, stellung: null, merke: "Ihre Nadeln sind weich. Fast alles an ihr ist giftig." },
  // ---------- Blumen ----------
  { name: "Scharfer Hahnenfuss", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: 5, farbe: "gelb" }, merke: "Seine Blüten glänzen gelb. Er ist giftig." },
  { name: "Löwenzahn", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: "viele", farbe: "gelb" }, merke: "Aus der Blüte wird eine Pusteblume." },
  { name: "Gänseblümchen", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: "viele", farbe: "weiss" }, merke: "Es blüht fast das ganze Jahr im Rasen." },
  { name: "Margerite", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: "viele", farbe: "weiss" }, merke: "Sie sieht aus wie ein grosses Gänseblümchen." },
  { name: "Wiesen-Schaumkraut", gruppe: "Blume", blatt: "gefiedert", teile: 7, rand: null, stellung: null, bluete: { zahl: 4, farbe: "hellviolett" }, merke: "Es blüht im Frühling auf feuchten Wiesen." },
  { name: "Klatschmohn", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: 4, farbe: "rot" }, merke: "Er blüht leuchtend rot am Feldrand." },
  { name: "Raps", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: 4, farbe: "gelb" }, merke: "Ganze Felder blühen im Frühling gelb." },
  { name: "Wiesen-Storchschnabel", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: 5, farbe: "violett" }, merke: "Seine Frucht sieht aus wie ein Storchenschnabel." },
  { name: "März-Veilchen", gruppe: "Blume", blatt: "herzförmig", rand: "gekerbt", stellung: null, bluete: { zahl: 5, farbe: "violett" }, merke: "Es duftet und blüht früh im Jahr." },
  { name: "Walderdbeere", gruppe: "Blume", blatt: "dreizählig", rand: "gesägt", stellung: null, bluete: { zahl: 5, farbe: "weiss" }, merke: "Ihre kleinen roten Früchte kann man essen." },
  { name: "Wald-Sauerklee", gruppe: "Blume", blatt: "dreizählig", rand: "glatt", stellung: null, bluete: { zahl: 5, farbe: "weiss" }, merke: "Seine Blätter schmecken sauer." },
  { name: "Rotklee", gruppe: "Blume", blatt: "dreizählig", rand: null, stellung: null, bluete: { zahl: "viele", farbe: "rosa" }, merke: "Seine Blüten sind ein rundes Köpfchen. Bienen lieben ihn." },
  { name: "Bärlauch", gruppe: "Blume", blatt: "lanzettlich", rand: "glatt", stellung: null, bluete: { zahl: 6, farbe: "weiss" }, merke: "Er riecht nach Knoblauch." },
  { name: "Maiglöckchen", gruppe: "Blume", blatt: "lanzettlich", rand: "glatt", stellung: null, bluete: { zahl: 6, farbe: "weiss" }, merke: "Es ist sehr giftig — nicht mit Bärlauch verwechseln!" },
  { name: "Grosse Brennnessel", gruppe: "Blume", blatt: "herzförmig", rand: "gesägt", stellung: "gegenständig", merke: "Ihre Brennhaare brennen auf der Haut." },
  { name: "Sumpfdotterblume", gruppe: "Blume", blatt: "herzförmig", rand: "gekerbt", stellung: null, bluete: { zahl: 5, farbe: "gelb" }, merke: "Sie wächst an Bächen und auf nassen Wiesen." },
  { name: "Scharbockskraut", gruppe: "Blume", blatt: "herzförmig", rand: null, stellung: null, bluete: { zahl: null, farbe: "gelb" }, merke: "Seine Blätter glänzen. Es blüht im Frühling im Wald." },
  { name: "Wiesen-Schlüsselblume", gruppe: "Blume", blatt: "eiförmig", rand: "gekerbt", stellung: null, bluete: { zahl: 5, farbe: "gelb" }, merke: "Ihre Blüten hängen wie ein Schlüsselbund." },
  { name: "Wiesen-Glockenblume", gruppe: "Blume", blatt: null, rand: null, stellung: null, bluete: { zahl: 5, farbe: "blau" }, merke: "Ihre Blüte ist eine Glocke mit fünf Zipfeln." },
  { name: "Kochs Enzian", gruppe: "Blume", blatt: "lanzettlich", rand: "glatt", stellung: null, bluete: { zahl: 5, farbe: "blau" }, merke: "Er blüht tiefblau auf Alpweiden." },
  { name: "Rostblättrige Alpenrose", gruppe: "Strauch", blatt: "lanzettlich", rand: "glatt", stellung: null, bluete: { zahl: 5, farbe: "rot" }, merke: "Ein kleiner Strauch der Alpen. Ihre Blätter sind unten rostbraun." },
  { name: "Wiesensalbei", gruppe: "Blume", blatt: "eiförmig", rand: "gekerbt", stellung: "gegenständig", bluete: { zahl: null, farbe: "violett" }, merke: "Seine Blüten haben eine Ober- und eine Unterlippe." },
  { name: "Spitzwegerich", gruppe: "Blume", blatt: "lanzettlich", rand: null, stellung: null, merke: "Sein Saft hilft bei Insektenstichen." },
  { name: "Edelweiss", gruppe: "Blume", blatt: "lanzettlich", rand: "glatt", stellung: null, bluete: { zahl: null, farbe: "weiss" }, merke: "Es wächst hoch in den Alpen und ist filzig behaart." },
];
