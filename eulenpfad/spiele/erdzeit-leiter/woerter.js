/* Ereignisse für die Erdzeit-Leiter — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG NMG.2.5.e: Erdgeschichte zeitlich ordnen (vor der Schrift; die Menschheitsgeschichte
   ab der Steinzeit übt der Zeitstrahl-Sortierer).

   Inhaltsliste (Entscheid L4 a): eine Liste, Id „ereignisse“ (Katalog, Eintrag „erdzeit-leiter“).

   Schreibweise je Eintrag:
     mio        vor wie vielen Millionen Jahren (ganze Zahl) — oder
     jahre      vor wie vielen Jahren, für alles unter 10 Millionen Jahren, das keine ganze Zahl Millionen ist
     bild       Emoji
     text       das Ereignis, ein kurzer Satz
     zeitalter  Erdurzeit (vor 541 Mio.), Erdaltertum (541–252 Mio.), Erdmittelalter (252–66 Mio.),
                Erdneuzeit (seit 66 Mio.)
     grenze     true: liegt an der Grenze zweier Zeitalter — kommt bei „Zeitalter zuordnen“ nicht vor
   Alle Zeiten sind gerundete, gängige Werte („vor etwa …“). Was im Bericht der Sitzung unter
   „bitte nachprüfen“ steht, ist mit einem Lehrmittel abzugleichen.
   Schweizer Schreibweise (ss statt ß). */

const ERDZEIT_EREIGNISSE = [
  // Erdurzeit
  { mio: 4600, bild: "🌍", text: "Die Erde entsteht.", zeitalter: "Erdurzeit" },
  { mio: 4500, bild: "🌕", text: "Der Mond entsteht.", zeitalter: "Erdurzeit" },
  { mio: 4000, bild: "🪨", text: "Die ältesten bekannten Gesteine entstehen.", zeitalter: "Erdurzeit" },
  { mio: 3500, bild: "🦠", text: "Erste Lebewesen im Meer: winzige Einzeller.", zeitalter: "Erdurzeit" },
  { mio: 2400, bild: "🫧", text: "Einzeller machen Sauerstoff. Er sammelt sich in der Luft.", zeitalter: "Erdurzeit" },
  { mio: 600, bild: "🪼", text: "Erste vielzellige Tiere im Meer, weich wie Quallen.", zeitalter: "Erdurzeit" },
  // Erdaltertum
  { mio: 540, bild: "🐚", text: "Im Meer leben auf einmal viele Tiere mit Schalen und Panzern.", zeitalter: "Erdaltertum", grenze: true },
  { mio: 500, bild: "🐟", text: "Erste Fische schwimmen im Meer.", zeitalter: "Erdaltertum" },
  { mio: 450, bild: "🌿", text: "Erste Pflanzen wachsen an Land.", zeitalter: "Erdaltertum" },
  { mio: 400, bild: "🦗", text: "Erste Insekten krabbeln an Land.", zeitalter: "Erdaltertum" },
  { mio: 370, bild: "🐸", text: "Erste Vierbeiner (Amphibien) kriechen an Land.", zeitalter: "Erdaltertum" },
  { mio: 300, bild: "🌴", text: "Riesige Sumpfwälder aus Farnen. Daraus wird später Steinkohle.", zeitalter: "Erdaltertum" },
  { mio: 250, bild: "🌋", text: "Das grösste Artensterben: Die meisten Meerestiere sterben aus.", zeitalter: "Erdaltertum", grenze: true },
  // Erdmittelalter
  { mio: 240, bild: "🐬", text: "Am Monte San Giorgio im Tessin ist Meer. Darin schwimmen Fischsaurier.", zeitalter: "Erdmittelalter" },
  { mio: 230, bild: "🦖", text: "Erste Dinosaurier.", zeitalter: "Erdmittelalter" },
  { mio: 210, bild: "🦕", text: "Der Plateosaurus lebt dort, wo heute Frick im Aargau liegt.", zeitalter: "Erdmittelalter" },
  { mio: 200, bild: "🐭", text: "Erste Säugetiere, klein wie Mäuse.", zeitalter: "Erdmittelalter" },
  { mio: 160, bild: "🌊", text: "Die Schweiz liegt unter einem warmen Meer. Der Kalk des Juras entsteht.", zeitalter: "Erdmittelalter" },
  { mio: 150, bild: "🪶", text: "Der Urvogel Archaeopteryx lebt.", zeitalter: "Erdmittelalter" },
  { mio: 130, bild: "🌸", text: "Erste Blütenpflanzen blühen.", zeitalter: "Erdmittelalter" },
  { mio: 66, bild: "☄️", text: "Ein riesiger Asteroid schlägt ein. Die Dinosaurier sterben aus — nur die Vögel überleben.", zeitalter: "Erdmittelalter", grenze: true },
  // Erdneuzeit
  { mio: 50, bild: "🐋", text: "Die Vorfahren der Wale gehen ins Wasser.", zeitalter: "Erdneuzeit" },
  { mio: 30, bild: "🏔️", text: "Die Alpen falten sich auf.", zeitalter: "Erdneuzeit" },
  { mio: 10, bild: "⛰️", text: "Das Juragebirge faltet sich auf.", zeitalter: "Erdneuzeit" },
  { mio: 6, bild: "🚶", text: "Erste Vormenschen gehen auf zwei Beinen.", zeitalter: "Erdneuzeit" },
  { mio: 3, bild: "🦴", text: "Die Vormenschen-Frau „Lucy“ lebt in Afrika.", zeitalter: "Erdneuzeit" },
  { jahre: 2500000, bild: "🪓", text: "Frühmenschen machen die ersten Steinwerkzeuge.", zeitalter: "Erdneuzeit" },
  { mio: 1, bild: "🔥", text: "Frühmenschen nutzen das Feuer.", zeitalter: "Erdneuzeit" },
  { jahre: 300000, bild: "🧑", text: "Der heutige Mensch (Homo sapiens) entsteht in Afrika.", zeitalter: "Erdneuzeit" },
  { jahre: 40000, bild: "🧔", text: "Die letzten Neandertaler sterben aus.", zeitalter: "Erdneuzeit" },
  { jahre: 20000, bild: "🧊", text: "Höhepunkt der letzten Eiszeit: Gletscher bedecken fast die ganze Schweiz.", zeitalter: "Erdneuzeit" },
  { jahre: 12000, bild: "🌤️", text: "Die letzte Eiszeit geht zu Ende.", zeitalter: "Erdneuzeit" },
];
