# Auftrag R11 — Rechnermodelle an der SG-Oberstufe (für die lokale Sitzung)

Stand: 2026-11-04 (LST_Session1, Cloud). Hintergrund: Entscheide TR1 a, RE1 a, RM1 b in
[../HANDOVER.md](../HANDOVER.md). Der Lernsteig bekommt einen eingebauten Taschenrechner, der je Modell **Aussehen,
Tastenanordnung und Bedienlogik** gängiger Schulrechner nachempfindet und Tipps je Modell gibt (RM1 b). Dafür braucht es
belegte Angaben. Prompt zum Einfügen in die lokale Sitzung:

---

> **Recherche R11 für den Lernsteig: Taschenrechner-Modelle an der Oberstufe SG.** Ergebnis als
> `docs/lernsteig/lehrplan/rechnermodelle_sg.md`, im Aufbau wie `sg_oberstufe_praxis.md`: Tabelle *Quellen und
> Reichweite* (Kürzel, Quelle, Stand, wie gelesen), dann die Abschnitte unten. Regeln wie immer: nur zitierter
> Wortlaut mit Quelle gilt als Beleg, keine Suchmaschinen-Zusammenfassungen; je Angabe die Quelle; Reichweite der
> Suche nennen; Unbelegtes als Annahme markieren. PDFs mit `quelle_suchen.py` durchsuchen, nicht mit grep.
>
> 1. **Welche Modelle?** Welche Taschenrechner sind an der Aufnahmeprüfung SG erlaubt oder genannt? Ausgangspunkt:
>    TR (Kantonale Rektorenkonferenz SG, *Taschenrechner für die Aufnahmeprüfung*, Version November 2023) — steht dort
>    eine Modellliste oder nur eine Funktionsbeschreibung? Dazu: Welche Modelle empfehlen SG-Oberstufen auf
>    Materiallisten oder Elternbriefen (Stichprobe, Schulen mit Ort nennen), welche Lehrmittel (mathbuch) setzen ein
>    Modell voraus? Ergebnis: Liste der Modelle mit Häufigkeit und Belegen, höchstens 3–5 Modelle für den Lernsteig
>    vorschlagen.
> 2. **Bedienlogik je Modell** (aus den Bedienungsanleitungen der Hersteller, mit Seitenzahl): Eingabe negativer
>    Zahlen (eigene Vorzeichentaste oder Minus), Potenz (Taste, Reihenfolge), Quadrat- und n-te Wurzel (vor oder nach
>    der Zahl), Klammern, Ergebnis übernehmen (Ans), Bruch- und Dezimaldarstellung umschalten, Fliesskomma und
>    wissenschaftliche Schreibweise, Dezimalzeichen und Tausendertrennung in der Anzeige, natürliche oder lineare
>    Anzeige, was davon an der Prüfung verboten ist (CAS, Gleichungslöser) und ob es sich abschalten lässt.
>    Typische Bedienfehler, die Lehrpersonen oder Anleitungen nennen (für die Tipps je Modell).
> 3. **Aussehen und Rechte:** Dürfen Aussehen und Tastenbild eines Modells in einer kostenlosen Lern-App nachempfunden
>    werden? Gibt es Freigaben der Hersteller für Schulen oder Lernsoftware (offizielle Emulatoren, Pressebilder,
>    Lizenzen)? Was sagen Design- und Markenrecht in der Schweiz dazu (DesG, MSchG, UWG Nachahmung) — nur mit
>    Quelle, sonst als offene Frage. Ergebnis: was erlaubt ist, was nicht, und wo eine Anfrage beim Hersteller nötig
>    wäre (Kipppunkt zu RM1 b).
> 4. **Stellwerk 8:** Gilt dort ein anderer oder ein eingebauter Rechner (Bezug zu R10)?
>
> Am Ende: kurze Folgerungen für den Lernsteig als Annahmen, und offene Punkte als Tabelle wie in
> `lehrplan_sg_sek1.md` Abschnitt 6. Commit mit Präfix `LST:`, Push auf master des Cloud-Repos Lernsteig, damit die
> Cloud-Sitzung es übernehmen kann.

---

Die Cloud-Sitzung baut den Rechner bis dahin mit der Funktion nach RE1 a in einer Ansicht „allgemein“; Modelle kommen
nach R11 dazu.
