/* Inhaltsliste „English grammar“ (FS1E.5.D.1) — zum Durchsehen ohne Code. UNGEPRÜFT (LST_Session1), bis Patrik sie
   durchgesehen hat. Je Eintrag: satz (mit „___“ für die Lücke) und optionen mit der richtigen zuerst, oder art "satz"
   mit ganzen Sätzen (richtiger zuerst); thema benennt die Struktur (für Hinweis und Lösungsweg). Achtung beim Erweitern:
   Es darf nur EINE Antwort korrekt sein (etwa nicht „must“ und „have to“ zugleich anbieten).
   Britisches Englisch wie in den Schweizer Lehrmitteln üblich (Annahme). */
"use strict";

const ENGLISCH = {
  // b: Konjugation wichtiger Verben (be, have), Personalpronomen als Subjekt, Frage mit Fragewort
  b: [
    { satz: "My sister ___ twelve years old.", optionen: ["is", "are", "am", "be"], thema: "be" },
    { satz: "We ___ from Switzerland.", optionen: ["are", "is", "am", "be"], thema: "be" },
    { satz: "I ___ hungry.", optionen: ["am", "is", "are", "be"], thema: "be" },
    { satz: "They ___ a big dog.", optionen: ["have", "has", "having", "is"], thema: "have" },
    { satz: "Tom ___ two brothers.", optionen: ["has", "have", "having", "is"], thema: "have" },
    { satz: "Anna is my friend. ___ lives in Bern.", optionen: ["She", "Her", "He", "They"], thema: "pronomen-subjekt" },
    { satz: "Ben and I play football. ___ play every Saturday.", optionen: ["We", "Us", "They", "Our"], thema: "pronomen-subjekt" },
    { satz: "___ is your birthday? — In May.", optionen: ["When", "Who", "What", "Where"], thema: "fragewort" },
    { satz: "___ do you live? — In Zurich.", optionen: ["Where", "When", "Who", "Why"], thema: "fragewort" },
    { satz: "___ is that girl? — That's my cousin.", optionen: ["Who", "What", "Where", "How"], thema: "fragewort" },
    { satz: "___ old are you? — I'm thirteen.", optionen: ["How", "What", "Who", "Where"], thema: "fragewort" },
  ],
  // c: Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen
  c: [
    { art: "satz", optionen: ["Where do you live?", "Where you live?", "Where live you?", "Where does you live?"], thema: "wortfolge-frage" },
    { art: "satz", optionen: ["Does she like pizza?", "Do she like pizza?", "She likes pizza?", "Likes she pizza?"], thema: "wortfolge-frage" },
    { art: "satz", optionen: ["I often play tennis.", "I play often tennis.", "Often I tennis play.", "I play tennis often play."], thema: "wortfolge-aussage" },
    { art: "satz", optionen: ["We watched a film yesterday.", "We yesterday watched a film.", "Yesterday watched we a film.", "We watched yesterday a film."], thema: "wortfolge-aussage" },
    { art: "satz", optionen: ["She gave her brother a book.", "She gave to her brother a book.", "She gave her brother to a book.", "She her brother gave a book."], thema: "zwei-objekte" },
    { art: "satz", optionen: ["Can you show me the way?", "Can you show to me the way?", "Can you me show the way?", "Can show you me the way?"], thema: "zwei-objekte" },
    { satz: "There are three ___ in the park. (child)", optionen: ["children", "childs", "childrens", "childes"], thema: "plural" },
    { satz: "My ___ hurt after the hike. (foot)", optionen: ["feet", "foots", "feets", "footes"], thema: "plural" },
    { satz: "Two ___ are talking. (woman)", optionen: ["women", "womans", "womens", "woman"], thema: "plural" },
    { satz: "The cat caught two ___. (mouse)", optionen: ["mice", "mouses", "mices", "mouse"], thema: "plural" },
    { satz: "We have English ___ Monday.", optionen: ["on", "in", "at", "to"], thema: "praeposition" },
    { satz: "My birthday is ___ July.", optionen: ["in", "on", "at", "to"], thema: "praeposition" },
    { satz: "The lesson starts ___ eight o'clock.", optionen: ["at", "on", "in", "to"], thema: "praeposition" },
    { satz: "The keys are ___ the table.", optionen: ["on", "at", "of", "to"], thema: "praeposition" },
  ],
  // d: Hilfs- und Modalverben, Formen der Negation, Demonstrativ-, Reflexiv- und Possessivpronomen; Zeitformen erkennen;
  //    begründende Konjunktionen
  d: [
    { satz: "You ___ wear a helmet on a motorbike. It's the law.", optionen: ["must", "musts", "must to", "mustes"], thema: "modal" },
    { satz: "My little brother ___ swim very well.", optionen: ["can", "cans", "can to", "is can"], thema: "modal" },
    { satz: "She ___ like coffee.", optionen: ["doesn't", "don't", "isn't", "not"], thema: "negation" },
    { satz: "We ___ go to school yesterday.", optionen: ["didn't", "don't", "doesn't", "weren't"], thema: "negation" },
    { satz: "They ___ watching TV right now.", optionen: ["aren't", "don't", "doesn't", "isn't"], thema: "negation" },
    { satz: "He hurt ___ when he fell off his bike.", optionen: ["himself", "herself", "him", "his"], thema: "reflexiv" },
    { satz: "We enjoyed ___ at the party.", optionen: ["ourselves", "us", "ourself", "our"], thema: "reflexiv" },
    { satz: "___ shoes over there are mine.", optionen: ["Those", "This", "These", "That"], thema: "demonstrativ" },
    { satz: "Look at ___ bird here on the branch!", optionen: ["this", "these", "those", "them"], thema: "demonstrativ" },
    { satz: "This isn't your pen. It's ___.", optionen: ["mine", "my", "me", "I"], thema: "possessiv" },
    { satz: "The children love ___ teacher.", optionen: ["their", "there", "they're", "them"], thema: "possessiv" },
    { satz: "I stayed at home ___ I was ill.", optionen: ["because", "but", "so", "or"], thema: "konjunktion" },
    { satz: "It was raining, ___ we took the bus.", optionen: ["so", "because", "but", "or"], thema: "konjunktion" },
    { satz: "Which tense? «She has finished her homework.» ___", optionen: ["present perfect", "simple past", "simple present", "past progressive"], thema: "zeitform" },
    { satz: "Which tense? «They were playing football.» ___", optionen: ["past progressive", "present progressive", "simple past", "present perfect"], thema: "zeitform" },
    { satz: "Which tense? «We visited our grandparents last week.» ___", optionen: ["simple past", "present perfect", "simple present", "past progressive"], thema: "zeitform" },
  ],
};

if (typeof module !== "undefined") module.exports = ENGLISCH;
