# Handover — Lernsteig

## Stand
**2026-11-04, LST_Session1 (Cloud):** Rahmen unter `lernsteig/gemeinsam/` (Vertrag [rahmen.md](rahmen.md)): Konto
(Gast), Niveaus `n1`/`n2` und Prüfungsziel (NV2 a), Stufen nach dem Lehrplan mit Übergängen und Challenge (ST1/ST2 a),
Runde, Serie, Protokoll je Aufgabe, Zahl-, Term- und Auswahl-Antworten, Tabellen und Graphen, eingebauter Rechner mit
Modellen nach R11 (RM1 b). **Neunzehn Mathe-Übungen** in `lernsteig/uebungen/`: rationale-zahlen (MA.1.A.3 g–i),
gleichungen (MA.1.A.4 h, j), terme (MA.1.A.4 i–k), zehnerpotenzen (MA.1.A.1 i–k), ueberschlagen-ordnen (MA.1.A.2 h–j),
aussagen (MA.1.B.2 h, j, k; Liste ungeprüft), folgen (MA.1.C.2 g–j), flaechen-volumen (MA.2.A.3 f–i), groessen
(MA.3.A.2 h–k), prozent-funktionen (MA.3.A.3 g–i), daten-rabatt (MA.3.A.1 j–l), sachsituationen (MA.3.C.2 f–h),
koordinaten (MA.2.C.4 h–j), brueche (MA.1.A.3 f, g, i), lineare-funktionen (MA.3.A.3 j, k), binome-gleichungen (MA.1.A.4 l, m), kombinatorik (MA.3.B.2 d, f, g), zufall (MA.3.C.1 f, h, i), koerper-winkel (MA.2.A.3 j, k); dazu Deutsch: grammatik (D.5.D.1 e–g) und rechtschreibung (D.5.E.1 d–g); Englisch: englisch-grammatik (FS1E.5.D.1 b–d); Französisch: franzoesisch-grammatik (FS2F.5.D.1 b–d); Natur und Technik: stromkreis (NT.5.2 b–d), kraefte (NT.5.1 a, c–e; Liste ungeprüft), atombau (NT.3.2 a, c, d; Liste ungeprüft), stoffwechsel (NT.7.2 a); Listen ungeprüft. Startseite mit Land, Kanton,
Prüfungsziel, Niveau je Fach, Rechnermodell, **Konten** (selbst angelegt, PIN freiwillig mit Wiederherstellungscode,
Einladungslink), **Kompetenzstand** je Lehrplan-Stufe, **Statistik** mit Sichern und Einlesen und Wochenziel, **Aufsicht** (Eltern,
Lehrpersonen: verbunden nur mit Zustimmung, Einstellungen des Geräts; AF1 a, AF2 a). Testskript `docs/lernsteig/werkzeuge/pruefe_uebungen.js --browser` grün.
Pull Request [PatrikNeunteufel/Lernsteig#1](https://github.com/PatrikNeunteufel/Lernsteig/pull/1) offen.

Grundlage: [Konzept der Reihe](../konzept_reihe_eulenpfad.md), Abschnitt 2 (Lernsteig); Auftrag:
[AUFTRAG_cloud.md](AUFTRAG_cloud.md); Abgleich mit Lernspiele: [SYNC_lernspiele.md](SYNC_lernspiele.md).
Lehrplan SG Oberstufe (Real/Sek, Lektionentafel, Niveaus, Fächer): [lehrplan/lehrplan_sg_sek1.md](lehrplan/lehrplan_sg_sek1.md);
Mathematik Zyklus 3 mit GA, OP und Erweiterungen je Stufe: [lehrplan/mathematik_zyklus3.md](lehrplan/mathematik_zyklus3.md);
Sprachen Zyklus 3 (Deutsch, Englisch, Französisch, Italienisch, Latein) mit GA, OP und GER-Niveaus:
[lehrplan/sprachen_zyklus3.md](lehrplan/sprachen_zyklus3.md);
SG-Praxis (Lehrmittel, Beurteilung und Wechsel Real ↔ Sek, Aufnahmeprüfungen mit den geprüften Mathe-Stufen,
Stellwerk 8, Schreibweisen): [lehrplan/sg_oberstufe_praxis.md](lehrplan/sg_oberstufe_praxis.md)
Taschenrechner (erlaubte Modelle an der Aufnahmeprüfung, Bedienlogik je Modell, Rechte am Aussehen, kein Rechner im
Stellwerk 8): [lehrplan/rechnermodelle_sg.md](lehrplan/rechnermodelle_sg.md)
(Recherche 2026-11-04; Annahmen A1–A5 zum Niveau-Modell und offene Recherchen R1–R7 in `lehrplan_sg_sek1.md`,
Abschnitte 5 und 6).

## Entscheide (Patrik, 2026-11-04)
- **Gemeinsamer Kern:** Mechaniken des Eulenpfads dürfen abgeschaut und kopiert werden, ohne Laden aus `eulenpfad/`;
  jede Übernahme in [gemeinsame_mechaniken.md](../gemeinsame_mechaniken.md).
- **SP1 a — Speicher getrennt:** Schlüssel `lernsteig:*`, IndexedDB `lernsteig`, Abgleichdateien
  `lernsteig-sync-<id>.json`, Sicherungen `lernsteig-*.json`. Der Lernsteig liest und schreibt nie `lernspiele:*`.
  Datenformat angelehnt an den Eulenpfad (Runde, Rekord, Löschvermerk). **Zusatz:** Aufstieg aus dem Eulenpfad per Knopf
  der Aufsicht mit Einladung zum Lernsteig (Notiz EP1; Weg der Einladung: Frage EL1).
- **NV1 a — Niveau:** intern `n1` grundlegend, `n2` erweitert, `n3` Pro-Gymi, verankert an den Kompetenzstufen des
  LP21 (Anker noch zu belegen, Recherche Patrik); gespeichert **je Fach** im Profil; Anzeige (Real/Sek, A/B/C …) aus
  einem Lehrplan-Profil je Kanton. Stufen je Niveau relativ zur Basisklasse; Stufe 5–6 = nächstes Niveau. Prototyp:
  `n1` und `n2`. **Zusatz:** Kanton im Profil (Frage KT1).
- **AU1 a — Aufsicht:** Jugendliche legen sich selbst an und können ihr Konto mit eigener PIN schützen (PIN vergessen
  über Wiederherstellungscode). Eine Rolle „Aufsicht“ für Eltern und Lehrpersonen, freiwillig; sie sieht nur
  verbundene Konten, der Jugendliche sieht, wer mitliest. Freigabe nach Prüfstand, die Aufsicht kann sperren; keine
  Frage für Erwachsene. **Zusatz:** Einladung beim Aufstieg, E-Mail und „Passwort vergessen“ per Mail — setzt einen
  Server voraus (Frage DS1).
- **BF1 a — Fortschritt:** Kompetenzstand je Lernziel für die Jugendlichen (sicher / am Üben / offen, regelbasiert mit
  Zahlen), Serie (selbst gesetzt, ohne Stern), Endlos-Rekorde und Bestzeiten. Keine Sterne, keine Ränge, kein
  Teilen-Bild.
- **DS1 a — Server:** Der Prototyp bleibt lokal (PIN mit Wiederherstellungscode, Abgleich über Ordner, keine E-Mail).
  Konten tragen eine eindeutige Kennung, und das Datenformat trennt, was später an einen Server dürfte. Server, E-Mail
  und „Passwort vergessen“ per Mail werden ein eigener Ausbauschritt mit Datenschutzkonzept; Idee Patrik: ein Konzept
  „Server für die Schule“.
- **KT1 a — Kanton:** Profilfeld `lehrplan` je Jugendlichem (Land, in der Schweiz Kanton), beim Anlegen vorgeschlagen
  vom Gerät, die Aufsicht kann ändern oder festlegen; ausserhalb der Schweiz neutrale Niveaunamen.
- **GE1 b — Geburtsdatum:** ganzes Datum (`geboren: "JJJJ-MM-TT"`), das Alter wird berechnet. Wortlaut für `CLAUDE.md`
  vorgeschlagen (Notiz EP3).
- **EL1 a — Einladung:** Link `…/lernsteig/#einladung=…` oder Datei `lernsteig-einladung.json`, nur Stammdaten; der
  Lernsteig füllt die Anmeldung vor und löscht das Fragment. Format im gemeinsamen Kern.
- **AB1 a** (für den Eulenpfad): Aufstiegs-Erfolg im gleichen Rang für jedes Niveau (Notiz EP2).
- **GW1 a — Pro-Gymi:** bleibt Niveau `n3` im Lernsteig; Wechsel zur Gratwanderung mit Eintritt in die Sek II.
  Gymnasiale Fächer der ersten zwei Jahre (etwa Latein), falls die Recherche sie zeigt, als Fach mit `n3`.
- **Z1 a — Zahlschreibweise:** wie der Lehrplan SG. Tausender mit Apostroph ab vier Stellen („1'000“), Dezimalpunkt
  („0.725“), über eine eigene Funktion für die Zahlschreibung im Lernsteig. Die Eulenpfad-Regel aus `CLAUDE.md` gilt für
  den Lernsteig nicht. Begründung und Kipppunkt (mathbuch): [lehrplan/sg_oberstufe_praxis.md](lehrplan/sg_oberstufe_praxis.md),
  Abschnitt 5.
- **GR1 a — Gruppen:** Stufe 1 offline am selben Gerät (abwechselnd oder gemeinsam, Wettbewerb am Beamer, Gutschrift
  aufs eigene Konto); Stufe 2 über mehrere Geräte erst mit Server. Das Rundenformat trägt schon ein Feld `gruppe`.
- **NV2 a — Niveau-Modell (ersetzt `n3` aus NV1 a):** zwei Inhaltsniveaus nach Lehrplan, `n1` = bis Grundanspruch Z3
  (Real), `n2` = GA plus Auftrag Z3 (Sek), je Fach im Profil. Eigenes **Prüfungsziel** im Profil: keins, Stellwerk 8,
  Gymnasium, Einheitsaufnahmeprüfung (EAP); es markiert je Kompetenz die geprüften Stufen nach PA
  (`lehrplan/sg_oberstufe_praxis.md` 3). Schulniveaus g/m/e nur Anzeige: g → `n1`, e → `n2`, bei m wählt der
  Jugendliche, bis R5 eine Zuordnung belegt. Pro-Gymi ist kein Niveau mehr, sondern das Prüfungsziel Gymnasium.
- **ST1 a — Stufen:** Die Stufen einer Übung sind Kompetenzstufen des Lehrplans mit GA, OP und E; das Niveau bestimmt
  die Zielstufe. **Zusatz Patrik:** zwischen den Kompetenzstufen Übergangsstufen und darüber eine Challenge-Stufe
  („über den Erwartungen“). Wie genau: Rückfrage ST2.
- **MZ1 a — Minuszeichen:** angezeigt „−“ (U+2212), bei der Eingabe gelten alle Formen.
- **TR1 a — Taschenrechner:** Katalogfeld `rechner: "ohne" | "mit" | "frei"` je Übung und Stufe nach Lehrplan und PA.
  **Zusatz Patrik:** Aufsicht oder Lehrperson kann es einstellen; der Lernsteig hat einen **eingebauten Rechner**, bei
  „mit“ und „frei“ per Knopf einzuschalten, bei „ohne“ nicht verfügbar.
- **ST2 a — Aufbau der Stufen:** Jede Lehrplan-Stufe der Übung ist eine Referenzstufe; zwischen zwei benachbarten
  ein Übergang (Aufgaben beider gemischt); darüber eine Challenge (alle Stufen gemischt, schwerste Varianten, mehrere
  Schritte, kein Stoff über den Lehrplan hinaus). **Zusatz Patrik:** Die Zahl der Stufen darf je Übung schwanken;
  gleiche Stufen sollen überall gleich heissen und gleich funktionieren; die Challenge hat überall denselben Sonderstatus.
- **RE1 a — eingebauter Rechner:** Funktionen wie an der Aufnahmeprüfung vorausgesetzt (Grundoperationen, Klammern,
  Potenz, Wurzeln, Vorzeichen, Fliesskomma), keine Prozent-Taste, kein CAS, kein Graph; Nutzung je Aufgabe im
  Protokoll, Bestzeit und Kompetenzstand mit und ohne Rechner getrennt.
- **RM1 b — Rechnermodelle:** Der eingebaute Rechner empfindet je Modell Aussehen, Tastenbild und Bedienlogik nach und
  gibt Tipps je Modell. Welche Modelle, ihre Bedienung und was rechtlich erlaubt ist, recherchiert Patrik (R11, Auftrag
  [lehrplan/R11_auftrag_rechnermodelle.md](lehrplan/R11_auftrag_rechnermodelle.md)); bis dahin eine Ansicht
  „allgemein“. Hinweis aus der Vorlage: Ein Nachbau des Aussehens kann Design- und Markenrecht berühren; R11 Punkt 3
  klärt das, bevor ein Modell-Aussehen veröffentlicht wird.
- **UE1 a — erste Übungen:** Rationale Zahlen rechnen (MA.1.A.3 g–i), Terme vereinfachen (MA.1.A.4 i–k), Gleichungen
  lösen (MA.1.A.4 h, j), Grössen umwandeln (MA.3.A.2 h–k), Prozent und Funktionswerte (MA.3.A.3 g–i); die Muster-Übung
  geht in der ersten auf.

## Offen
- NT-Übungen (Wunsch Patrik): warten auf R6 Teil NT — sg.lehrplan.ch ist aus der Cloud gesperrt; Auftrag für die lokale
  Sitzung [lehrplan/R6_auftrag_nt.md](lehrplan/R6_auftrag_nt.md), oder die Domain in der Umgebung freigeben.
- Recherche R11 (Rechnermodelle, Patrik).
- Konzept „Server für die Schule“ (Idee Patrik zu DS1) — noch nicht geschrieben.
- Vorschlag an Patrik: `.gitignore` um `lernsteig-*.json` ergänzen (Notiz EP4); Wortlaut Datenschutz in `CLAUDE.md`
  (Notiz EP3).

## Nächster Schritt
**Einstieg: [STAND_und_PLAN.md](STAND_und_PLAN.md)** (Anleitung, Stand, Plan). Zuerst: Freigabe nach FG1 a
(der Fehler in `brueche` ist behoben). KB1 a, KB2 a entschieden (Kern lokal im Repo Lernspiele).
Patrik prüft den Pull Request und entscheidet KB1, KB2 (`docs/commons_bibliothek.md`). Danach
Freigabe nach FG1 a bauen (Prüfstand `lernsteig/gemeinsam/pruefstand.js`, gesperrt bis geprüft, Aufsicht gibt frei), NT-Übungen nach R6, Freigabe der Listen durch die Aufsicht, weitere Übungen. Report der Sitzung:
[report/LST_Session1_2026-11-04.md](report/LST_Session1_2026-11-04.md).
