/* Wörter für die Morphem-Schere — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG D.5.D.1.c (Grundanspruch): Stamm, Wortfamilie, Morpheme; D.5.E.1.d (Grundanspruch):
   Morpheme für die Stammregel nutzen (e oder ä, eu oder äu). Selbst zusammengestellte Wörter.
   Schweizer Schreibweise (ss statt ß).

   Inhaltslisten (Liste-Id = Schlüssel; Prüfstand im Katalog, Eintrag „morphem-schere“, Feld listen):

   bausteine — Wörter mit ihren Morphemgrenzen: "|" trennt die Bausteine, der STAMM steht in Klammern.
     Was vor dem Stamm steht, zeigt das Spiel als Vorsilbe, was danach steht als Endung (das Spiel sagt
     „Endung“ für Nachsilben wie -ung, -lich, -keit und für Endungen wie -en, -er; mit dem Lehrmittel
     abgleichen). Beispiel: "ver|(kauf)|en" → ver | kauf | en, Stamm „kauf“.
     Der Stamm ist der bedeutungstragende Kern, der in der Wortfamilie wiederkehrt; mit Umlaut zählt er
     als derselbe Stamm (Verkäufer: Stamm „käuf“ zu kaufen). Weggelassen sind unsichere Fälle: Ablaut
     (Flug, Verbot), verdunkelte Bildungen (Zeitung, Hoffnung), Zusammensetzungen aus zwei Stämmen.

   stamm-ea — Wörter mit e/ä oder eu/äu im Stamm: [Wort mit Lücke, verwandtes Wort mit a/au].
     Die Lücke steht in geschweiften Klammern, die RICHTIGE Schreibweise zuerst: "B{ä|e}cker".
     Wörter mit e/eu haben kein verwandtes Wort mit a/au: zweites Feld leer (""). Weggelassen sind
     Wörter, die mit der anderen Schreibweise auch ein Wort ergeben (Wände/Wende, Leute/läute, Kälte/Kelte).
     Die Liste e-ae der Regel-Lücke passt nicht als Verweis: Sie hat keine verwandten Wörter und nur
     15 Einträge; Hände und Gläser von dort sind hier weggelassen. */

const MORPHEM_LISTEN = {
  bausteine: [
    // Stamm und Endung
    "(spiel)|en", "(lach)|en", "(lern)|en", "(Fahr)|er", "(Lehr)|er", "(Spiel)|er", "(Sieg)|er",
    "(Frei)|heit", "(Kind)|heit", "(Krank)|heit", "(Freund)|schaft", "(Sauber)|keit",
    "(Wohn)|ung", "(Heiz)|ung", "(Lös)|ung", "(Warn)|ung", "(Meld)|ung",
    "(lust)|ig", "(wind)|ig", "(sonn)|ig", "(fleiss)|ig", "(farb)|ig",
    "(freund)|lich", "(glück)|lich", "(ehr)|lich", "(les)|bar", "(ess)|bar", "(dank)|bar",
    // Vorsilbe und Stamm
    "Un|(glück)", "Un|(sinn)", "Ur|(wald)", "Be|(such)", "Ver|(trag)", "Ein|(kauf)", "un|(sicher)", "un|(klar)",
    "Vor|(teil)", "Nach|(teil)",
    // drei Bausteine
    "ver|(kauf)|en", "Ver|(käuf)|er", "Ent|(deck)|ung", "un|(freund)|lich", "be|(zahl)|en", "er|(zähl)|en",
    "ver|(lauf)|en", "ent|(fern)|en", "Be|(such)|er", "Be|(wohn)|er", "Er|(find)|ung", "Er|(zieh)|ung",
    "ver|(misch)|en", "zer|(brech)|en", "zer|(reiss)|en", "ent|(lauf)|en", "ab|(fahr)|en", "an|(ruf)|en",
    "auf|(räum)|en", "mit|(spiel)|en", "vor|(les)|en", "nach|(denk)|en", "aus|(pack)|en", "ein|(kauf)|en",
    "un|(glück)|lich", "un|(ehr)|lich", "Ver|(spät)|ung", "Be|(lohn)|ung", "Ver|(letz)|ung", "Ver|(pack)|ung",
    "Ent|(täusch)|ung", "Er|(laub)|nis", "Ge|(heim)|nis", "Er|(leb)|nis", "un|(ruh)|ig", "Er|(fahr)|ung",
    "Ver|(bind)|ung", "Ent|(spann)|ung", "Ent|(scheid)|ung", "Un|(sicher)|heit", "be|(freund)|et",
    "(Spiel)|er|in", "(Fahr)|er|in", "(Lehr)|er|in", "(Les)|er|in",
    "(Freund)|lich|keit", "(Ehr)|lich|keit", "(Dank)|bar|keit", "ver|(gess)|lich",
    // vier Bausteine
    "Un|(freund)|lich|keit", "Un|(acht)|sam|keit", "Un|(ehr)|lich|keit", "Un|(dank)|bar|keit",
    "Ver|(gess)|lich|keit", "Ent|(schuld)|ig|ung", "ent|(schuld)|ig|en", "Be|(ruh)|ig|ung",
    "Ver|(käuf)|er|in", "Be|(such)|er|in", "Be|(wohn)|er|in", "Be|(sitz)|er|in",
    "Ent|(deck)|er|in", "Er|(find)|er|in", "Er|(zieh)|er|in",
  ],
  "stamm-ea": [
    // ä oder äu: verwandt mit a oder au
    ["B{ä|e}cker", "backen"], ["H{äu|eu}ser", "Haus"], ["M{äu|eu}se", "Maus"], ["B{äu|eu}me", "Baum"],
    ["L{ä|e}nder", "Land"], ["B{ä|e}nke", "Bank"], ["W{ä|e}rme", "warm"], ["St{ä|e}rke", "stark"],
    ["Bl{ä|e}tter", "Blatt"], ["R{ä|e}der", "Rad"], ["Z{ä|e}hne", "Zahn"], ["N{ä|e}chte", "Nacht"],
    ["S{ä|e}cke", "Sack"], ["K{ä|e}mme", "Kamm"], ["Tr{äu|eu}me", "Traum"], ["l{äu|eu}ft", "laufen"],
    ["Gr{ä|e}ser", "Gras"], ["Schr{ä|e}nke", "Schrank"], ["B{ä|e}lle", "Ball"], ["H{ä|e}lfte", "halb"],
    ["L{ä|e}nge", "lang"], ["Kr{äu|eu}ter", "Kraut"], ["B{äu|eu}che", "Bauch"], ["Z{äu|eu}ne", "Zaun"],
    ["G{ä|e}rtner", "Garten"], ["F{ä|e}sser", "Fass"], ["T{ä|e}nzerin", "tanzen"], ["Erk{ä|e}ltung", "kalt"],
    ["s{äu|eu}bern", "sauber"], ["{ä|e}ngstlich", "Angst"], ["gef{ä|e}hrlich", "Gefahr"], ["L{äu|eu}fer", "laufen"],
    ["R{äu|eu}ber", "rauben"], ["f{ä|e}hrt", "fahren"], ["Verk{äu|eu}fer", "kaufen"],
    // e oder eu: kein verwandtes Wort mit a oder au
    ["F{e|ä}ld", ""], ["W{e|ä}tter", ""], ["N{e|ä}st", ""], ["W{e|ä}lt", ""], ["F{e|ä}nster", ""],
    ["B{e|ä}cher", ""], ["K{e|ä}rze", ""], ["Br{e|ä}tt", ""], ["G{e|ä}ld", ""], ["H{e|ä}rbst", ""],
    ["L{e|ä}hrer", ""], ["Schn{e|ä}cke", ""], ["H{e|ä}lm", ""], ["Z{e|ä}lt", ""], ["B{e|ä}rg", ""], ["St{e|ä}rn", ""],
    ["F{eu|äu}er", ""], ["Fr{eu|äu}nd", ""], ["n{eu|äu}n", ""], ["{Eu|Äu}le", ""], ["B{eu|äu}tel", ""], ["K{eu|äu}le", ""],
    ["Kr{eu|äu}z", ""], ["St{eu|äu}er", ""],
  ],
};
