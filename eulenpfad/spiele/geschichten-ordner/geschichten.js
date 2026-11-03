/* Geschichten für den Geschichten-Ordner — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan (Annahme aus der Spielidee, Buchstaben noch abzugleichen): D.4.D.1.c — Texte mit
   erkennbarer Abfolge aufbauen (zuerst, dann, am Schluss); D.3.B.1.d — Geschichten in der
   richtigen Reihenfolge nacherzählen. Basisklasse 3.
   Alle Geschichten selbst geschrieben, die Kindernamen sind erfunden. Schweizer Schreibweise (ss),
   Schweizer Wörter (Velo, Car, Rüebli, Pöstler, Guetzli, Schulsack).

   Was eine Geschichte braucht — und was das Spiel prüft (pruefeAufgabe):
   - Die Reihenfolge der Schritte muss LOGISCH ZWINGEND sein: Ohne den vorigen Schritt geht der
     nächste nicht (erst der Teig, dann der Kuchen im Ofen, dann das Stück auf dem Teller). Eine
     Abfolge, die auch anders ginge (erst anziehen oder erst frühstücken?), ist für ein Kind nicht
     lösbar — solche Schritte bitte melden, sie werden gestrichen oder ersetzt.
   - Kein Schritt kommt doppelt; der Ablenker (Gruppe 2) ist keiner der Schritte.

   Schreibweise je Eintrag: { gruppe, titel, tipp, schritte: [...], ablenker? }
   - gruppe 1 (Stufen 1 und 2): genau drei Schritte { bild, kurz, satz } — Bild (Emoji) und ein Wort
     für die Bildkarten der Stufe 1, der kurze Satz für Stufe 2. Die drei Wörter „kurz“ müssen sich
     unterscheiden, die Bilder auch.
   - gruppe 2 (Stufen 3 und 4): genau vier Schritte { satz }; dazu ein „ablenker“: ein Satz, der zum
     Thema passt, aber NICHT in den Ablauf gehört (sagt nur etwas über jemanden oder etwas aus,
     ohne dass darin etwas geschieht). Stufe 4 mischt ihn unter die vier Sätze.
   - gruppe 3 (Stufen 5 und 6): fünf Schritte (Stufe 5, mit Zeitwörtern) oder sechs Schritte
     (Stufe 6, ohne Zeitwörter). Je Schritt { satz, nach }: „satz“ ist der ganze Satz („Noah packt
     den Rucksack.“), „nach“ derselbe Satz so umgestellt, dass ein Zeitwort davor passt („packt Noah
     den Rucksack.“ → „Zuerst packt Noah den Rucksack.“). Das Spiel setzt die Zeitwörter selbst:
     Zuerst, Dann, Danach, Später, Am Schluss (Stufe 5) und Zuerst / Dann / Am Schluss für die
     Lücken der Königsstufe (erster, zweiter und letzter Schritt).
   - tipp: der dritte Tipp zur Aufgabe. Er sagt etwas über den Anfang der Geschichte, ohne den ersten
     Schritt zu nennen („Am Anfang ist der Topf noch leer.“) und ohne das Wort des letzten Schritts.

   Inhaltsliste im Katalog (spiele/gemeinsam/katalog.js, Eintrag geschichten-ordner, Feld listen):
   „geschichten“ — Kurze Geschichten in Schritten. Neue Geschichten gelten als ungeprüft, bis sie
   im Entwickler-Modus geprüft sind. */

const GESCHICHTEN = [
  // ---------- Gruppe 1: drei Schritte mit Bild und Wort (Stufen 1 und 2) ----------
  { gruppe: 1, titel: "Kuchen backen", tipp: "Am Anfang ist noch nichts vorbereitet.", schritte: [
    { bild: "🥣", kurz: "Rühren", satz: "Mia rührt den Teig." },
    { bild: "🔥", kurz: "Backen", satz: "Der Kuchen backt im Ofen." },
    { bild: "🍰", kurz: "Essen", satz: "Mia isst ein Stück Kuchen." } ] },
  { gruppe: 1, titel: "Der Schneemann", tipp: "Am Anfang ist der Garten noch grün.", schritte: [
    { bild: "❄️", kurz: "Schneien", satz: "Es schneit die ganze Nacht." },
    { bild: "⚪", kurz: "Rollen", satz: "Luca rollt drei Kugeln." },
    { bild: "⛄", kurz: "Schneemann", satz: "Der Schneemann steht im Garten." } ] },
  { gruppe: 1, titel: "Die Sonnenblume", tipp: "Am Anfang ist die Erde noch leer.", schritte: [
    { bild: "🌱", kurz: "Säen", satz: "Lena steckt einen Samen in die Erde." },
    { bild: "💧", kurz: "Giessen", satz: "Lena giesst die Erde." },
    { bild: "🌻", kurz: "Blühen", satz: "Die Sonnenblume blüht." } ] },
  { gruppe: 1, titel: "Das Geburtstagsfest", tipp: "Am Anfang weiss noch niemand vom Fest.", schritte: [
    { bild: "✉️", kurz: "Einladung", satz: "Tim verteilt die Einladungen." },
    { bild: "🚪", kurz: "Gäste", satz: "Die Gäste klingeln an der Tür." },
    { bild: "🎂", kurz: "Kerzen", satz: "Tim bläst die Kerzen aus." } ] },
  { gruppe: 1, titel: "Beim Zahnarzt", tipp: "Am Anfang geht es Nina nicht gut.", schritte: [
    { bild: "🦷", kurz: "Zahnweh", satz: "Nina hat Zahnweh." },
    { bild: "🚗", kurz: "Fahrt", satz: "Mama fährt mit Nina zum Zahnarzt." },
    { bild: "😁", kurz: "Lachen", satz: "Nina lacht wieder ohne Schmerzen." } ] },
  { gruppe: 1, titel: "Das platte Velo", tipp: "Am Anfang stimmt etwas mit dem Velo nicht.", schritte: [
    { bild: "💨", kurz: "Platt", satz: "Der Reifen ist platt." },
    { bild: "🔧", kurz: "Flicken", satz: "Papa flickt den Reifen." },
    { bild: "🚲", kurz: "Fahren", satz: "Finn fährt wieder los." } ] },
  { gruppe: 1, titel: "Der Schulweg", tipp: "Am Anfang schläft Lara noch.", schritte: [
    { bild: "⏰", kurz: "Wecker", satz: "Der Wecker klingelt." },
    { bild: "🎒", kurz: "Packen", satz: "Lara packt den Schulsack." },
    { bild: "🏫", kurz: "Schule", satz: "Lara sitzt im Klassenzimmer." } ] },
  { gruppe: 1, titel: "In der Bibliothek", tipp: "Am Anfang hat Ben noch kein Buch.", schritte: [
    { bild: "📚", kurz: "Ausleihen", satz: "Ben leiht ein Buch aus." },
    { bild: "📖", kurz: "Lesen", satz: "Ben liest das Buch." },
    { bild: "↩️", kurz: "Zurückbringen", satz: "Ben bringt das Buch zurück." } ] },
  { gruppe: 1, titel: "Der Hamster", tipp: "Am Anfang ist noch kein Tier da.", schritte: [
    { bild: "🏠", kurz: "Käfig", satz: "Emma baut den Käfig auf." },
    { bild: "🐹", kurz: "Einzug", satz: "Der Hamster zieht ein." },
    { bild: "🥕", kurz: "Füttern", satz: "Emma füttert den Hamster." } ] },
  { gruppe: 1, titel: "Das Zeltlager", tipp: "Am Anfang ist Jonas noch zu Hause.", schritte: [
    { bild: "🎒", kurz: "Packen", satz: "Jonas packt den Rucksack." },
    { bild: "🚌", kurz: "Fahrt", satz: "Der Car fährt ins Lager." },
    { bild: "⛺", kurz: "Zelt", satz: "Jonas stellt das Zelt auf." } ] },
  { gruppe: 1, titel: "Der Brief", tipp: "Am Anfang ist das Blatt noch leer.", schritte: [
    { bild: "✍️", kurz: "Schreiben", satz: "Sara schreibt einen Brief." },
    { bild: "📮", kurz: "Einwerfen", satz: "Sara wirft den Brief ein." },
    { bild: "📖", kurz: "Lesen", satz: "Oma liest den Brief." } ] },
  { gruppe: 1, titel: "Die Pizza", tipp: "Am Anfang hat Papa noch nicht angerufen.", schritte: [
    { bild: "📞", kurz: "Bestellen", satz: "Papa bestellt eine Pizza." },
    { bild: "🛵", kurz: "Lieferung", satz: "Der Kurier bringt die Pizza." },
    { bild: "🍕", kurz: "Essen", satz: "Alle essen Pizza." } ] },
  { gruppe: 1, titel: "Die Wäsche", tipp: "Am Anfang sind die Kleider noch schmutzig.", schritte: [
    { bild: "🧺", kurz: "Waschen", satz: "Mama wäscht die Kleider." },
    { bild: "👕", kurz: "Aufhängen", satz: "Die Kleider hängen an der Leine." },
    { bild: "🗄️", kurz: "Einräumen", satz: "Alina räumt die Kleider in den Schrank." } ] },
  { gruppe: 1, titel: "Zähne putzen", tipp: "Am Anfang ist die Bürste noch leer.", schritte: [
    { bild: "🧴", kurz: "Zahnpasta", satz: "Elin drückt Zahnpasta auf die Bürste." },
    { bild: "🪥", kurz: "Putzen", satz: "Elin putzt die Zähne." },
    { bild: "💦", kurz: "Spülen", satz: "Elin spült den Mund aus." } ] },

  // ---------- Gruppe 2: vier Schritte und ein Ablenker (Stufen 3 und 4) ----------
  { gruppe: 2, titel: "Im Schwimmbad", tipp: "Am Anfang ist Nina noch nicht im Schwimmbad drin.",
    ablenker: "Das Schwimmbad hat eine lange Rutschbahn.", schritte: [
    { satz: "Nina kauft ein Ticket." },
    { satz: "Nina zieht sich in der Kabine um." },
    { satz: "Nina springt ins Wasser." },
    { satz: "Nina trocknet sich mit dem Tuch ab." } ] },
  { gruppe: 2, titel: "Der Kuchen für Oma", tipp: "Am Anfang sind die Zutaten noch nicht gemischt.",
    ablenker: "Oma hat am Sonntag Geburtstag.", schritte: [
    { satz: "Tim rührt Mehl, Eier und Zucker zu einem Teig." },
    { satz: "Tim füllt den Teig in die Form." },
    { satz: "Der Kuchen backt eine Stunde im Ofen." },
    { satz: "Oma isst ein Stück vom Kuchen." } ] },
  { gruppe: 2, titel: "Der platte Reifen", tipp: "Am Anfang ist das Velo noch heil.",
    ablenker: "Finns Velo hat eine laute Klingel.", schritte: [
    { satz: "Finn fährt über einen spitzen Stein." },
    { satz: "Die Luft zischt aus dem Reifen." },
    { satz: "Finn klebt einen Flicken auf das Loch." },
    { satz: "Finn pumpt den Reifen wieder auf." } ] },
  { gruppe: 2, titel: "Das Zeltlager", tipp: "Am Anfang ist Lara noch zu Hause.",
    ablenker: "Das Lager ist in den Bergen.", schritte: [
    { satz: "Lara packt den Schlafsack in den Rucksack." },
    { satz: "Der Car fährt die Klasse ins Lager." },
    { satz: "Die Kinder stellen die Zelte auf." },
    { satz: "Lara schläft im Zelt ein." } ] },
  { gruppe: 2, titel: "Beim Zahnarzt", tipp: "Am Anfang sitzt Ben noch gemütlich am Tisch.",
    ablenker: "Ben putzt seine Zähne mit einer blauen Bürste.", schritte: [
    { satz: "Ben hat beim Frühstück plötzlich Zahnweh." },
    { satz: "Mama ruft beim Zahnarzt an." },
    { satz: "Der Zahnarzt flickt das Loch im Zahn." },
    { satz: "Ben kann wieder ohne Schmerzen essen." } ] },
  { gruppe: 2, titel: "Der neue Hund", tipp: "Am Anfang hat Mia noch keinen Hund.",
    ablenker: "Bello hat braune Ohren.", schritte: [
    { satz: "Mia holt den Welpen Bello aus dem Tierheim." },
    { satz: "Mia übt jeden Tag mit Bello das Sitzen." },
    { satz: "Bello setzt sich auf Mias Befehl." },
    { satz: "Bello bekommt zur Belohnung ein Guetzli." } ] },
  { gruppe: 2, titel: "Ein Brief an Opa", tipp: "Am Anfang ist das Papier noch leer.",
    ablenker: "Opa wohnt in einem Dorf am See.", schritte: [
    { satz: "Sara schreibt Opa einen Brief." },
    { satz: "Sara klebt eine Briefmarke auf den Umschlag." },
    { satz: "Sara wirft den Brief in den Briefkasten." },
    { satz: "Opa liest den Brief am Küchentisch." } ] },
  { gruppe: 2, titel: "Das Geburtstagsfest", tipp: "Am Anfang weiss noch niemand vom Fest.",
    ablenker: "Leo wünscht sich ein Skateboard.", schritte: [
    { satz: "Leo schreibt die Einladungen." },
    { satz: "Die Gäste klingeln an der Tür." },
    { satz: "Leo bläst die Kerzen auf dem Kuchen aus." },
    { satz: "Alle essen ein Stück Kuchen." } ] },
  { gruppe: 2, titel: "Die Sonnenblume", tipp: "Am Anfang ist der Topf noch leer.",
    ablenker: "Sonnenblumen drehen sich nach der Sonne.", schritte: [
    { satz: "Elin steckt einen Samen in einen Topf." },
    { satz: "Ein kleiner grüner Spross zeigt sich." },
    { satz: "Die Pflanze wächst höher als Elin." },
    { satz: "Eine grosse gelbe Blüte öffnet sich." } ] },
  { gruppe: 2, titel: "Der Schneemann", tipp: "Am Anfang ist der Garten noch grün.",
    ablenker: "Jonas trägt warme Handschuhe.", schritte: [
    { satz: "In der Nacht fällt viel Schnee." },
    { satz: "Jonas rollt drei grosse Kugeln." },
    { satz: "Jonas setzt die Kugeln aufeinander." },
    { satz: "Jonas steckt dem Schneemann ein Rüebli als Nase an." } ] },
  { gruppe: 2, titel: "In der Bibliothek", tipp: "Am Anfang hat Alina noch kein Buch in der Hand.",
    ablenker: "Die Bibliothek ist am Montag geschlossen.", schritte: [
    { satz: "Alina sucht im Regal ein Buch über Pferde." },
    { satz: "Alina leiht das Buch an der Theke aus." },
    { satz: "Alina liest das Buch bis zur letzten Seite." },
    { satz: "Alina bringt das Buch zurück." } ] },
  { gruppe: 2, titel: "Der Schulweg", tipp: "Am Anfang schläft Samuel noch.",
    ablenker: "Samuels Schulsack ist rot.", schritte: [
    { satz: "Der Wecker klingelt um sieben Uhr." },
    { satz: "Samuel steigt aus dem Bett und zieht sich an." },
    { satz: "Samuel geht zur Bushaltestelle." },
    { satz: "Der Bus bringt Samuel zur Schule." } ] },
  { gruppe: 2, titel: "Die Pizza", tipp: "Am Anfang gibt es nur Mehl und Wasser.",
    ablenker: "Papa kocht am liebsten am Samstag.", schritte: [
    { satz: "Papa knetet den Pizzateig." },
    { satz: "Papa belegt die Pizza mit Tomaten und Käse." },
    { satz: "Die Pizza backt im heissen Ofen." },
    { satz: "Die Familie isst die Pizza." } ] },
  { gruppe: 2, titel: "Das Vogelhaus", tipp: "Am Anfang sind die Bretter noch zu lang.",
    ablenker: "Meisen sind kleine Vögel.", schritte: [
    { satz: "Luca sägt die Bretter zu." },
    { satz: "Luca nagelt die Bretter zusammen." },
    { satz: "Luca hängt das Vogelhaus an den Baum." },
    { satz: "Eine Meise pickt Körner im Vogelhaus." } ] },

  // ---------- Gruppe 3: fünf Schritte (Stufe 5 mit Zeitwörtern) ----------
  { gruppe: 3, titel: "Das Zeltlager", tipp: "Am Anfang ist Noah noch zu Hause.", schritte: [
    { satz: "Noah packt den Rucksack.", nach: "packt Noah den Rucksack." },
    { satz: "Der Car fährt die Klasse in die Berge.", nach: "fährt der Car die Klasse in die Berge." },
    { satz: "Die Kinder stellen die Zelte auf.", nach: "stellen die Kinder die Zelte auf." },
    { satz: "Noah rollt den Schlafsack im Zelt aus.", nach: "rollt Noah den Schlafsack im Zelt aus." },
    { satz: "Noah schläft im Zelt ein.", nach: "schläft Noah im Zelt ein." } ] },
  { gruppe: 3, titel: "Kuchen für das Fest", tipp: "Am Anfang ist der Schrank noch zu.", schritte: [
    { satz: "Mia holt Mehl, Eier und Zucker aus dem Schrank.", nach: "holt Mia Mehl, Eier und Zucker aus dem Schrank." },
    { satz: "Mia rührt alles zu einem Teig.", nach: "rührt Mia alles zu einem Teig." },
    { satz: "Mia füllt den Teig in die Form.", nach: "füllt Mia den Teig in die Form." },
    { satz: "Der Kuchen backt im Ofen.", nach: "backt der Kuchen im Ofen." },
    { satz: "Alle essen ein Stück Kuchen.", nach: "essen alle ein Stück Kuchen." } ] },
  { gruppe: 3, titel: "Der platte Reifen", tipp: "Am Anfang ist das Velo noch ganz.", schritte: [
    { satz: "Finn fährt über eine Scherbe.", nach: "fährt Finn über eine Scherbe." },
    { satz: "Die Luft zischt aus dem Reifen.", nach: "zischt die Luft aus dem Reifen." },
    { satz: "Finn sucht das Loch im Schlauch.", nach: "sucht Finn das Loch im Schlauch." },
    { satz: "Finn klebt einen Flicken auf das Loch.", nach: "klebt Finn einen Flicken auf das Loch." },
    { satz: "Finn pumpt den Reifen auf und fährt weiter.", nach: "pumpt Finn den Reifen auf und fährt weiter." } ] },
  { gruppe: 3, titel: "Beim Zahnarzt", tipp: "Am Anfang weiss noch niemand vom Loch im Zahn.", schritte: [
    { satz: "Lena beisst in einen Apfel und spürt einen Stich im Zahn.", nach: "beisst Lena in einen Apfel und spürt einen Stich im Zahn." },
    { satz: "Mama ruft beim Zahnarzt an.", nach: "ruft Mama beim Zahnarzt an." },
    { satz: "Lena sitzt im Wartezimmer.", nach: "sitzt Lena im Wartezimmer." },
    { satz: "Der Zahnarzt flickt das Loch im Zahn.", nach: "flickt der Zahnarzt das Loch im Zahn." },
    { satz: "Lena beisst wieder ohne Schmerzen in den Apfel.", nach: "beisst Lena wieder ohne Schmerzen in den Apfel." } ] },
  { gruppe: 3, titel: "Der neue Hamster", tipp: "Am Anfang hat Emma noch kein Tier.", schritte: [
    { satz: "Emma kauft im Tierladen einen Hamster.", nach: "kauft Emma im Tierladen einen Hamster." },
    { satz: "Zu Hause setzt Emma ihn in den Käfig.", nach: "setzt Emma ihn zu Hause in den Käfig." },
    { satz: "Der Hamster schnuppert in jeder Ecke.", nach: "schnuppert der Hamster in jeder Ecke." },
    { satz: "Der Hamster findet den Napf mit den Körnern.", nach: "findet der Hamster den Napf mit den Körnern." },
    { satz: "Der Hamster frisst sich satt.", nach: "frisst sich der Hamster satt." } ] },
  { gruppe: 3, titel: "Der Schulweg", tipp: "Am Anfang schläft Tim noch.", schritte: [
    { satz: "Der Wecker klingelt um sieben.", nach: "klingelt der Wecker um sieben." },
    { satz: "Tim steigt aus dem Bett.", nach: "steigt Tim aus dem Bett." },
    { satz: "Tim zieht sich an.", nach: "zieht Tim sich an." },
    { satz: "Tim wartet an der Bushaltestelle.", nach: "wartet Tim an der Bushaltestelle." },
    { satz: "Der Bus bringt Tim zur Schule.", nach: "bringt der Bus Tim zur Schule." } ] },
  { gruppe: 3, titel: "Das Vogelhaus", tipp: "Am Anfang gibt es nur ein leeres Blatt.", schritte: [
    { satz: "Luca zeichnet einen Plan für ein Vogelhaus.", nach: "zeichnet Luca einen Plan für ein Vogelhaus." },
    { satz: "Luca sägt die Bretter zu.", nach: "sägt Luca die Bretter zu." },
    { satz: "Luca nagelt die Bretter zusammen.", nach: "nagelt Luca die Bretter zusammen." },
    { satz: "Luca hängt das Vogelhaus an den Baum.", nach: "hängt Luca das Vogelhaus an den Baum." },
    { satz: "Eine Meise pickt Körner im Vogelhaus.", nach: "pickt eine Meise Körner im Vogelhaus." } ] },
  { gruppe: 3, titel: "Der Brief an Oma", tipp: "Am Anfang ist das Blatt noch leer.", schritte: [
    { satz: "Sara schreibt Oma einen Brief.", nach: "schreibt Sara Oma einen Brief." },
    { satz: "Sara steckt den Brief in den Umschlag.", nach: "steckt Sara den Brief in den Umschlag." },
    { satz: "Sara wirft den Brief in den Briefkasten.", nach: "wirft Sara den Brief in den Briefkasten." },
    { satz: "Der Pöstler bringt den Brief zu Oma.", nach: "bringt der Pöstler den Brief zu Oma." },
    { satz: "Oma liest den Brief.", nach: "liest Oma den Brief." } ] },
  { gruppe: 3, titel: "Der Schneemann", tipp: "Am Anfang ist der Garten noch grün.", schritte: [
    { satz: "In der Nacht fällt viel Schnee.", nach: "fällt in der Nacht viel Schnee." },
    { satz: "Jonas rollt drei Kugeln.", nach: "rollt Jonas drei Kugeln." },
    { satz: "Jonas setzt die Kugeln aufeinander.", nach: "setzt Jonas die Kugeln aufeinander." },
    { satz: "Jonas steckt dem Schneemann ein Rüebli als Nase an.", nach: "steckt Jonas dem Schneemann ein Rüebli als Nase an." },
    { satz: "Jonas macht ein Foto vom fertigen Schneemann.", nach: "macht Jonas ein Foto vom fertigen Schneemann." } ] },
  { gruppe: 3, titel: "Die Sonnenblume", tipp: "Am Anfang ist der Topf noch leer.", schritte: [
    { satz: "Elin steckt einen Samen in die Erde.", nach: "steckt Elin einen Samen in die Erde." },
    { satz: "Elin giesst die Erde jeden Tag.", nach: "giesst Elin die Erde jeden Tag." },
    { satz: "Ein kleiner Spross zeigt sich.", nach: "zeigt sich ein kleiner Spross." },
    { satz: "Die Pflanze wächst bis zum Fenster.", nach: "wächst die Pflanze bis zum Fenster." },
    { satz: "Eine grosse gelbe Blüte öffnet sich.", nach: "öffnet sich eine grosse gelbe Blüte." } ] },
  { gruppe: 3, titel: "Pizza backen", tipp: "Am Anfang gibt es nur Mehl und Wasser.", schritte: [
    { satz: "Papa knetet den Teig.", nach: "knetet Papa den Teig." },
    { satz: "Papa rollt den Teig flach aus.", nach: "rollt Papa den Teig flach aus." },
    { satz: "Ben belegt die Pizza mit Tomaten und Käse.", nach: "belegt Ben die Pizza mit Tomaten und Käse." },
    { satz: "Die Pizza backt im heissen Ofen.", nach: "backt die Pizza im heissen Ofen." },
    { satz: "Die Familie isst die Pizza.", nach: "isst die Familie die Pizza." } ] },
  { gruppe: 3, titel: "Im Schwimmbad", tipp: "Am Anfang steht Nina noch vor dem Eingang.", schritte: [
    { satz: "Nina kauft an der Kasse ein Ticket.", nach: "kauft Nina an der Kasse ein Ticket." },
    { satz: "Nina zieht sich in der Kabine um.", nach: "zieht Nina sich in der Kabine um." },
    { satz: "Nina springt ins Wasser.", nach: "springt Nina ins Wasser." },
    { satz: "Nina schwimmt drei Längen.", nach: "schwimmt Nina drei Längen." },
    { satz: "Nina trocknet sich mit dem Tuch ab.", nach: "trocknet Nina sich mit dem Tuch ab." } ] },
  { gruppe: 3, titel: "In der Bibliothek", tipp: "Am Anfang hat Alina noch kein Buch.", schritte: [
    { satz: "Alina geht in die Bibliothek.", nach: "geht Alina in die Bibliothek." },
    { satz: "Alina sucht im Regal ein Buch über Pferde.", nach: "sucht Alina im Regal ein Buch über Pferde." },
    { satz: "Alina leiht das Buch an der Theke aus.", nach: "leiht Alina das Buch an der Theke aus." },
    { satz: "Alina liest das Buch bis zur letzten Seite.", nach: "liest Alina das Buch bis zur letzten Seite." },
    { satz: "Alina bringt das Buch zurück.", nach: "bringt Alina das Buch zurück." } ] },

  // ---------- Gruppe 3: sechs Schritte (Königsstufe, ohne Zeitwörter) ----------
  { gruppe: 3, titel: "Das Geburtstagsfest", tipp: "Am Anfang weiss noch niemand vom Fest.", schritte: [
    { satz: "Leo schreibt die Einladungen.", nach: "schreibt Leo die Einladungen." },
    { satz: "Leo verteilt sie in der Klasse.", nach: "verteilt Leo sie in der Klasse." },
    { satz: "Am Samstag klingeln die Gäste.", nach: "klingeln am Samstag die Gäste." },
    { satz: "Leo bläst die Kerzen auf dem Kuchen aus.", nach: "bläst Leo die Kerzen auf dem Kuchen aus." },
    { satz: "Alle essen ein Stück Kuchen.", nach: "essen alle ein Stück Kuchen." },
    { satz: "Die Gäste gehen nach Hause.", nach: "gehen die Gäste nach Hause." } ] },
  { gruppe: 3, titel: "Der Kuchen", tipp: "Am Anfang weiss Mia noch nicht, was sie alles braucht.", schritte: [
    { satz: "Mia liest das Rezept.", nach: "liest Mia das Rezept." },
    { satz: "Mia holt die Zutaten aus dem Schrank.", nach: "holt Mia die Zutaten aus dem Schrank." },
    { satz: "Mia rührt alles zu einem Teig.", nach: "rührt Mia alles zu einem Teig." },
    { satz: "Mia füllt den Teig in die Form.", nach: "füllt Mia den Teig in die Form." },
    { satz: "Der Kuchen backt im Ofen.", nach: "backt der Kuchen im Ofen." },
    { satz: "Mia isst ein Stück Kuchen.", nach: "isst Mia ein Stück Kuchen." } ] },
  { gruppe: 3, titel: "Das Velo", tipp: "Am Anfang ist das Velo noch ganz.", schritte: [
    { satz: "Finn fährt über eine Scherbe.", nach: "fährt Finn über eine Scherbe." },
    { satz: "Die Luft zischt aus dem Reifen.", nach: "zischt die Luft aus dem Reifen." },
    { satz: "Finn schiebt das Velo nach Hause.", nach: "schiebt Finn das Velo nach Hause." },
    { satz: "Papa sucht das Loch im Schlauch.", nach: "sucht Papa das Loch im Schlauch." },
    { satz: "Papa klebt einen Flicken auf das Loch.", nach: "klebt Papa einen Flicken auf das Loch." },
    { satz: "Finn pumpt den Reifen auf und fährt weiter.", nach: "pumpt Finn den Reifen auf und fährt weiter." } ] },
  { gruppe: 3, titel: "Eine Nacht im Zelt", tipp: "Am Anfang ist Noah noch zu Hause.", schritte: [
    { satz: "Noah packt den Rucksack.", nach: "packt Noah den Rucksack." },
    { satz: "Die Klasse fährt mit dem Car in die Berge.", nach: "fährt die Klasse mit dem Car in die Berge." },
    { satz: "Die Kinder stellen die Zelte auf.", nach: "stellen die Kinder die Zelte auf." },
    { satz: "Noah rollt den Schlafsack im Zelt aus.", nach: "rollt Noah den Schlafsack im Zelt aus." },
    { satz: "Noah schläft im Zelt ein.", nach: "schläft Noah im Zelt ein." },
    { satz: "Am Morgen weckt ihn die Sonne.", nach: "weckt ihn am Morgen die Sonne." } ] },
  { gruppe: 3, titel: "Das Loch im Zahn", tipp: "Am Anfang weiss noch niemand vom Loch.", schritte: [
    { satz: "Lena spürt beim Essen einen Stich im Zahn.", nach: "spürt Lena beim Essen einen Stich im Zahn." },
    { satz: "Mama ruft beim Zahnarzt an.", nach: "ruft Mama beim Zahnarzt an." },
    { satz: "Lena sitzt im Wartezimmer.", nach: "sitzt Lena im Wartezimmer." },
    { satz: "Der Zahnarzt schaut in Lenas Mund.", nach: "schaut der Zahnarzt in Lenas Mund." },
    { satz: "Der Zahnarzt flickt das Loch im Zahn.", nach: "flickt der Zahnarzt das Loch im Zahn." },
    { satz: "Lena beisst wieder ohne Schmerzen in den Apfel.", nach: "beisst Lena wieder ohne Schmerzen in den Apfel." } ] },
  { gruppe: 3, titel: "Der Hund Bello", tipp: "Am Anfang hat Lena noch keinen Hund.", schritte: [
    { satz: "Lena holt den Welpen Bello aus dem Tierheim.", nach: "holt Lena den Welpen Bello aus dem Tierheim." },
    { satz: "Zu Hause zeigt Lena ihm sein Körbchen.", nach: "zeigt Lena ihm zu Hause sein Körbchen." },
    { satz: "Lena übt mit Bello das Sitzen.", nach: "übt Lena mit Bello das Sitzen." },
    { satz: "Bello setzt sich endlich auf Befehl.", nach: "setzt sich Bello endlich auf Befehl." },
    { satz: "Lena gibt ihm ein Guetzli.", nach: "gibt Lena ihm ein Guetzli." },
    { satz: "Bello schläft müde in seinem Körbchen ein.", nach: "schläft Bello müde in seinem Körbchen ein." } ] },
  { gruppe: 3, titel: "Bis ins Klassenzimmer", tipp: "Am Anfang schläft Tim noch.", schritte: [
    { satz: "Der Wecker klingelt um sieben.", nach: "klingelt der Wecker um sieben." },
    { satz: "Tim steigt aus dem Bett.", nach: "steigt Tim aus dem Bett." },
    { satz: "Tim zieht sich an.", nach: "zieht Tim sich an." },
    { satz: "Tim wartet an der Bushaltestelle.", nach: "wartet Tim an der Bushaltestelle." },
    { satz: "Der Bus bringt Tim zur Schule.", nach: "bringt der Bus Tim zur Schule." },
    { satz: "Tim setzt sich an seinen Platz im Klassenzimmer.", nach: "setzt sich Tim an seinen Platz im Klassenzimmer." } ] },
  { gruppe: 3, titel: "Ein Haus für die Meise", tipp: "Am Anfang gibt es nur ein leeres Blatt.", schritte: [
    { satz: "Luca zeichnet einen Plan.", nach: "zeichnet Luca einen Plan." },
    { satz: "Luca sägt die Bretter zu.", nach: "sägt Luca die Bretter zu." },
    { satz: "Luca nagelt die Bretter zusammen.", nach: "nagelt Luca die Bretter zusammen." },
    { satz: "Luca streicht das Vogelhaus rot an.", nach: "streicht Luca das Vogelhaus rot an." },
    { satz: "Luca hängt das Vogelhaus an den Baum.", nach: "hängt Luca das Vogelhaus an den Baum." },
    { satz: "Eine Meise pickt Körner im Vogelhaus.", nach: "pickt eine Meise Körner im Vogelhaus." } ] },
  { gruppe: 3, titel: "Post für Oma", tipp: "Am Anfang ist das Blatt noch leer.", schritte: [
    { satz: "Sara schreibt Oma einen Brief.", nach: "schreibt Sara Oma einen Brief." },
    { satz: "Sara steckt den Brief in den Umschlag.", nach: "steckt Sara den Brief in den Umschlag." },
    { satz: "Sara wirft den Brief in den Briefkasten.", nach: "wirft Sara den Brief in den Briefkasten." },
    { satz: "Der Pöstler bringt den Brief zu Oma.", nach: "bringt der Pöstler den Brief zu Oma." },
    { satz: "Oma liest den Brief.", nach: "liest Oma den Brief." },
    { satz: "Oma ruft Sara an und bedankt sich.", nach: "ruft Oma Sara an und bedankt sich." } ] },
  { gruppe: 3, titel: "Schnee im Garten", tipp: "Am Anfang ist der Garten noch grün.", schritte: [
    { satz: "In der Nacht fällt viel Schnee.", nach: "fällt in der Nacht viel Schnee." },
    { satz: "Jonas zieht die Stiefel an und geht in den Garten.", nach: "zieht Jonas die Stiefel an und geht in den Garten." },
    { satz: "Jonas rollt drei Kugeln.", nach: "rollt Jonas drei Kugeln." },
    { satz: "Jonas setzt die Kugeln aufeinander.", nach: "setzt Jonas die Kugeln aufeinander." },
    { satz: "Jonas steckt dem Schneemann ein Rüebli als Nase an.", nach: "steckt Jonas dem Schneemann ein Rüebli als Nase an." },
    { satz: "Jonas macht ein Foto vom fertigen Schneemann.", nach: "macht Jonas ein Foto vom fertigen Schneemann." } ] },
  { gruppe: 3, titel: "Vom Samen zur Blüte", tipp: "Am Anfang ist der Topf noch leer.", schritte: [
    { satz: "Elin steckt einen Samen in die Erde.", nach: "steckt Elin einen Samen in die Erde." },
    { satz: "Elin giesst die Erde jeden Tag.", nach: "giesst Elin die Erde jeden Tag." },
    { satz: "Ein kleiner Spross zeigt sich.", nach: "zeigt sich ein kleiner Spross." },
    { satz: "Die Pflanze wächst bis zum Fenster.", nach: "wächst die Pflanze bis zum Fenster." },
    { satz: "Eine grosse gelbe Blüte öffnet sich.", nach: "öffnet sich eine grosse gelbe Blüte." },
    { satz: "Elin erntet im Herbst die Kerne.", nach: "erntet Elin im Herbst die Kerne." } ] },
  { gruppe: 3, titel: "Pizza-Abend", tipp: "Am Anfang gibt es nur Mehl und Wasser.", schritte: [
    { satz: "Papa knetet den Teig.", nach: "knetet Papa den Teig." },
    { satz: "Papa rollt den Teig flach aus.", nach: "rollt Papa den Teig flach aus." },
    { satz: "Ben belegt die Pizza mit Tomaten und Käse.", nach: "belegt Ben die Pizza mit Tomaten und Käse." },
    { satz: "Papa schiebt die Pizza in den heissen Ofen.", nach: "schiebt Papa die Pizza in den heissen Ofen." },
    { satz: "Papa holt die fertige Pizza aus dem Ofen.", nach: "holt Papa die fertige Pizza aus dem Ofen." },
    { satz: "Die Familie isst die Pizza.", nach: "isst die Familie die Pizza." } ] },
  { gruppe: 3, titel: "Ein Nachmittag im Schwimmbad", tipp: "Am Anfang steht Nina noch vor dem Eingang.", schritte: [
    { satz: "Nina kauft an der Kasse ein Ticket.", nach: "kauft Nina an der Kasse ein Ticket." },
    { satz: "Nina zieht sich in der Kabine um.", nach: "zieht Nina sich in der Kabine um." },
    { satz: "Nina duscht sich kurz ab.", nach: "duscht Nina sich kurz ab." },
    { satz: "Nina springt ins Wasser.", nach: "springt Nina ins Wasser." },
    { satz: "Nina schwimmt drei Längen.", nach: "schwimmt Nina drei Längen." },
    { satz: "Nina trocknet sich mit dem Tuch ab.", nach: "trocknet Nina sich mit dem Tuch ab." } ] },
];
