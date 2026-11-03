/* Hello-Dialog: englische Mini-Dialoge — ZU PRÜFEN durch Eltern oder Lehrperson.
   Lehrplan SG FS1E.3.A.1 (Sprechen, dialogisch): a mit ganz einfachen Worten Kontakt aufnehmen (begrüssen,
   verabschieden, bedanken, etwas bestellen); b (Orientierungspunkt) in vertrauten Situationen einfache
   Fragen stellen und kurz antworten (Datum, Zeit, Befinden, Farbe); c (Grundanspruch) in alltäglichen
   Situationen Informationen austauschen, auf Gesagtes reagieren (Unterricht, Einkauf, Rollenspiel).
   Britisches Englisch (colour, favourite, Mum, francs). Wortschatz der 3./4. Klasse. Alle Texte selbst
   geschrieben. Die englische Stimme des Geräts spricht die Zeilen; auf den Knöpfen steht nur Englisch.

   Eine Inhaltsliste „dialoge“ (Katalog spiele/gemeinsam/katalog.js, Eintrag hello-dialog, Feld listen);
   sie umfasst alle Tabellen dieser Datei.

   Schreibweise je Tabelle:
   DIALOG_S1_ANTWORTEN  Kennung → [Satz, Emoji]: die Sätze der Einstiegsstufe (Knöpfe mit Bild).
   DIALOG_SITUATIONEN   [Emoji der Szene, deutsches Wort zur Szene, gesprochene Zeile des Gegenübers,
                        Kennung der passenden Antwort, Tipp auf Deutsch (verrät den Satz nicht)].
   DIALOG_PAARE         [Zeile, passende Antwort, [zwei falsche Antworten], Tipp]. Die falschen Antworten
                        sind richtige englische Sätze, die zu einer anderen Zeile passen würden.
   DIALOG_FRAGEN        [Gruppe, Thema, Frage, Antwort]. Gruppe 4 = 3. Klasse, 5 = 4. Klasse (Datum, Zeit,
                        Farbe, Befinden, Wetter). Falsche Möglichkeiten nimmt das Spiel aus anderen Themen,
                        deshalb muss jedes Thema eindeutig sein (eine Antwort passt nie zu einer Frage eines
                        anderen Themas).
   DIALOG_DIALOGE       { gruppe, bild, ort, a, b, zuege, falsch, tipp }: Gruppe 3 = drei Züge (Klassenziel),
                        5 = vier Züge mit Datum, Zeit, Farbe, Befinden (4. Klasse), 6 = vier bis fünf Züge in
                        Shop, School, Playground (Königsstufe). a und b sind die Emoji der Sprecher, die Züge
                        wechseln ab (a, b, a, …). Jeder Zug antwortet auf den vorigen, damit die Reihenfolge
                        eindeutig ist. falsch: zwei Zeilen, die in diesen Dialog nicht passen (für
                        „Welcher Satz passt nicht?“ und als falsche Möglichkeiten). tipp: auf Deutsch.
   DIALOG_HOEFLICH      [Emoji, Zeile, höfliche passende Antwort, unhöfliche Antwort, Antwort, die nicht
                        passt, Tipp] — Königsstufe „Was antwortest du?“. */

const DIALOG_LISTEN = ["dialoge"];

const DIALOG_S1_ANTWORTEN = {
  hello: ["Hello!", "🙋"],
  goodbye: ["Goodbye!", "👋"],
  thanks: ["Thank you!", "🙏"],
  morning: ["Good morning!", "🌞"],
  night: ["Good night!", "🌙"],
};

const DIALOG_SITUATIONEN = [
  ["🏫", "Ankommen", "Hello, Tom!", "hello", "Jemand kommt und grüsst dich. Grüss zurück."],
  ["👩‍🏫", "Ankommen", "Hello, I'm Mrs Smith.", "hello", "Deine neue Lehrerin grüsst dich. Grüss zurück."],
  ["🧑‍🤝‍🧑", "Ankommen", "Hi there!", "hello", "Ein Kind grüsst dich. Was sagst du zurück?"],
  ["🚪", "Gehen", "Bye, Tom! See you tomorrow.", "goodbye", "Jemand geht weg. Was sagt man beim Gehen?"],
  ["🚌", "Gehen", "Bye-bye! Have a nice day!", "goodbye", "Der Bus fährt los. Was sagt man beim Abschied?"],
  ["🏠", "Gehen", "See you later!", "goodbye", "Dein Freund geht nach Hause. Was sagst du?"],
  ["🎁", "Geschenk", "Here is a present for you.", "thanks", "Du bekommst etwas. Was sagt man dann?"],
  ["🍪", "Geschenk", "Here you are, a biscuit.", "thanks", "Du bekommst einen Keks. Was sagt man dann?"],
  ["🎂", "Geschenk", "I have got a cake for you!", "thanks", "Du bekommst einen Kuchen. Was sagt man dann?"],
  ["✏️", "Geschenk", "This pencil is for you.", "thanks", "Du bekommst einen Stift. Was sagt man dann?"],
  ["🌅", "Morgen", "Good morning, children!", "morning", "Es ist früh am Morgen. Wie grüsst man am Morgen?"],
  ["☀️", "Morgen", "Good morning, Tom! Wake up!", "morning", "Du wachst auf. Wie grüsst man am Morgen?"],
  ["🌙", "Nacht", "Good night, sleep well.", "night", "Es ist Schlafenszeit. Was sagt man vor dem Schlafen?"],
  ["🛏️", "Nacht", "Time for bed. Good night!", "night", "Du gehst ins Bett. Was sagt man vor dem Schlafen?"],
  ["🏫", "Ankommen", "Welcome to our school!", "hello", "Jemand heisst dich willkommen. Grüss zurück."],
  ["🎒", "Gehen", "Time to go home. Bye!", "goodbye", "Die Schule ist aus. Was sagt man beim Gehen?"],
  ["🍎", "Geschenk", "Here you are, an apple.", "thanks", "Du bekommst einen Apfel. Was sagt man dann?"],
  ["🌞", "Morgen", "Good morning, class!", "morning", "Die Lehrerin grüsst am Morgen. Grüss zurück."],
];

const DIALOG_PAARE = [
  ["Hello!", "Hi!", ["Goodbye!", "Thank you!"], "Jemand grüsst dich. Grüss zurück."],
  ["Hi, Tom!", "Hi, Lea!", ["Bye, Lea!", "Here you are."], "Jemand grüsst dich mit Namen. Grüss zurück."],
  ["How are you?", "I'm fine, thank you.", ["My name is Lea.", "I'm eight."], "Die Frage fragt, wie es dir geht."],
  ["What's your name?", "My name is Lea.", ["I'm fine, thank you.", "I'm eight."], "Die Frage fragt nach deinem Namen."],
  ["How old are you?", "I'm eight.", ["My name is Tom.", "I'm fine."], "Die Frage fragt nach deinem Alter."],
  ["Goodbye!", "Bye!", ["Hello!", "Thank you!"], "Jemand verabschiedet sich. Was sagst du zurück?"],
  ["Thank you!", "You're welcome.", ["Hello!", "I'm nine."], "Jemand bedankt sich. Was antwortet man darauf?"],
  ["Good morning!", "Good morning!", ["Good night!", "Thank you!"], "Jemand grüsst am Morgen. Grüss gleich zurück."],
  ["Good night!", "Good night! Sleep well.", ["Good morning!", "Here you are."], "Jemand wünscht eine gute Nacht. Wünsch sie zurück."],
  ["Nice to meet you.", "Nice to meet you, too.", ["I'm eight.", "Goodbye!"], "Jemand freut sich, dich kennenzulernen. Du dich auch."],
  ["Where do you live?", "I live in St. Gallen.", ["I'm nine.", "My name is Ben."], "Die Frage fragt, wo du wohnst."],
  ["Do you like apples?", "Yes, I do.", ["I'm eight.", "Good night!"], "Die Frage fragt, ob du etwas magst: Ja oder Nein."],
  ["Have you got a pet?", "Yes, I've got a cat.", ["I'm from Switzerland.", "It's three o'clock."], "Die Frage fragt, ob du ein Haustier hast."],
  ["Can you swim?", "Yes, I can.", ["My name is Anna.", "Good morning!"], "Die Frage fragt, ob du etwas kannst: Ja oder Nein."],
  ["What's your favourite colour?", "My favourite colour is blue.", ["I'm eight.", "I live in Bern."], "Die Frage fragt nach deiner Lieblingsfarbe."],
  ["See you tomorrow!", "See you!", ["Hello!", "Here you are."], "Jemand verabschiedet sich bis morgen. Was sagst du zurück?"],
  ["Sorry!", "That's OK.", ["I'm nine.", "Good morning!"], "Jemand entschuldigt sich. Was sagt man dann?"],
  ["Happy birthday!", "Thank you!", ["Good night!", "I'm from Zurich."], "Jemand gratuliert dir. Was sagt man dann?"],
  ["Can I have a biscuit, please?", "Here you are.", ["I'm eight.", "Good night!"], "Jemand möchte etwas haben. Was sagst du beim Geben?"],
  ["Here you are.", "Thank you!", ["Good morning!", "My name is Tom."], "Jemand gibt dir etwas. Was sagt man dann?"],
];

const DIALOG_FRAGEN = [
  // Gruppe 4: 3. Klasse
  [4, "name", "What's your name?", "My name is Tom."],
  [4, "name", "What is your name?", "I'm Lea."],
  [4, "alter", "How old are you?", "I'm eight."],
  [4, "alter", "How old are you?", "I'm nine years old."],
  [4, "befinden", "How are you?", "I'm fine, thank you."],
  [4, "befinden", "How are you?", "I'm OK, thanks."],
  [4, "wohnen", "Where do you live?", "I live in St. Gallen."],
  [4, "wohnen", "Where are you from?", "I'm from Switzerland."],
  [4, "haben", "Have you got a pet?", "Yes, I've got a dog."],
  [4, "haben", "Have you got a brother?", "No, I haven't."],
  [4, "moegen", "Do you like pizza?", "Yes, I do."],
  [4, "moegen", "Do you like spiders?", "No, I don't."],
  [4, "koennen", "Can you swim?", "Yes, I can."],
  [4, "koennen", "Can you ride a bike?", "Yes, I can. It's fun!"],
  [4, "farbe", "What's your favourite colour?", "My favourite colour is green."],
  // Gruppe 5: 4. Klasse — Datum, Zeit, Befinden, Farbe, Wetter
  [5, "zeit", "What time is it?", "It's three o'clock."],
  [5, "zeit", "What time is it?", "It's half past four."],
  [5, "zeit", "What time is it, please?", "It's ten o'clock."],
  [5, "datum", "What's the date today?", "It's the fifth of May."],
  [5, "datum", "When is your birthday?", "It's on the third of July."],
  [5, "datum", "What month is it?", "It's June."],
  [5, "tag", "What day is it today?", "It's Monday."],
  [5, "tag", "What day is it tomorrow?", "It's Saturday."],
  [5, "farbe", "What colour is it?", "It's red."],
  [5, "farbe", "What colour is the sky?", "It's blue."],
  [5, "farbe", "What colour is your bag?", "It's yellow."],
  [5, "befinden", "How do you feel?", "I'm happy."],
  [5, "befinden", "How are you today?", "I'm a bit tired."],
  [5, "befinden", "Are you OK?", "Yes, I'm fine."],
  [5, "wetter", "What's the weather like?", "It's sunny."],
  [5, "wetter", "What's the weather like today?", "It's rainy and cold."],
];

const DIALOG_DIALOGE = [
  // Gruppe 3: drei Züge — begrüssen, bestellen, bedanken, verabschieden
  { gruppe: 3, bild: "🍎", ort: "Shop", a: "🧒", b: "🧑‍🌾",
    zuege: ["Can I have an apple, please?", "Here you are.", "Thank you!"],
    falsch: ["Good night!", "I'm eight."], tipp: "Jemand möchte etwas, bekommt es und bedankt sich." },
  { gruppe: 3, bild: "🍦", ort: "Kiosk", a: "🧒", b: "🧑‍🍳",
    zuege: ["Can I have an ice cream, please?", "Yes, of course. Here you are.", "Thank you very much!"],
    falsch: ["My name is Lea.", "See you tomorrow!"], tipp: "Jemand möchte ein Eis, bekommt es und bedankt sich." },
  { gruppe: 3, bild: "🏫", ort: "School", a: "👩‍🏫", b: "🧒",
    zuege: ["Good morning, class!", "Good morning, Mrs Smith!", "Sit down, please."],
    falsch: ["It's red.", "Good night!"], tipp: "Die Lehrerin grüsst am Morgen, die Klasse grüsst zurück." },
  { gruppe: 3, bild: "👋", ort: "Playground", a: "🧒", b: "👧",
    zuege: ["Hi, Lea!", "Hi, Tom! How are you?", "I'm fine, thanks."],
    falsch: ["It's five o'clock.", "Goodbye!"], tipp: "Zwei Kinder grüssen sich, dann fragt eines, wie es geht." },
  { gruppe: 3, bild: "🎁", ort: "Birthday", a: "👧", b: "🧒",
    zuege: ["Happy birthday! This is for you.", "Oh, thank you!", "You're welcome."],
    falsch: ["How old are you?", "Good morning!"], tipp: "Jemand bekommt ein Geschenk und bedankt sich." },
  { gruppe: 3, bild: "🚪", ort: "School", a: "👩‍🏫", b: "🧒",
    zuege: ["Time to go home. Bye, Tom!", "Bye, Mrs Smith! See you tomorrow.", "See you!"],
    falsch: ["Here you are.", "It's blue."], tipp: "Die Schule ist aus, alle verabschieden sich." },
  { gruppe: 3, bild: "🧑‍🤝‍🧑", ort: "Playground", a: "👧", b: "🧒",
    zuege: ["Hello! What's your name?", "My name is Anna. What's your name?", "I'm Ben."],
    falsch: ["Here you are.", "Good night!"], tipp: "Zwei Kinder lernen sich kennen und fragen nach dem Namen." },
  { gruppe: 3, bild: "🥤", ort: "Home", a: "🧒", b: "👩",
    zuege: ["Can I have some water, please?", "Here you are.", "Thank you, Mum!"],
    falsch: ["I'm nine.", "It's Monday."], tipp: "Jemand möchte etwas trinken, bekommt es und bedankt sich." },
  { gruppe: 3, bild: "🌙", ort: "Home", a: "🧒", b: "👩",
    zuege: ["Good night, Mum!", "Good night, Tom. Sleep well.", "Thank you, Mum."],
    falsch: ["Good morning!", "Here you are."], tipp: "Es ist Schlafenszeit, Mutter und Kind wünschen sich eine gute Nacht." },
  { gruppe: 3, bild: "🍪", ort: "Home", a: "👩", b: "🧒",
    zuege: ["Would you like a biscuit?", "Yes, please!", "Here you are."],
    falsch: ["I'm fine, thank you.", "What's your name?"], tipp: "Jemand bietet einen Keks an, das Kind möchte ihn." },
  { gruppe: 3, bild: "✏️", ort: "School", a: "🧒", b: "👧",
    zuege: ["Can I have a pencil, please?", "Yes, here you are.", "Thanks!"],
    falsch: ["Good night!", "I'm from Switzerland."], tipp: "Jemand möchte einen Stift, bekommt ihn und bedankt sich." },
  { gruppe: 3, bild: "🚌", ort: "Bus", a: "🧒", b: "👴",
    zuege: ["Hello! How are you?", "I'm fine, thank you. And you?", "I'm OK, thanks."],
    falsch: ["It's blue.", "Here you are."], tipp: "Zwei Leute fragen sich, wie es ihnen geht." },

  // Gruppe 5: vier Züge — Datum, Zeit, Farbe, Befinden, Wetter
  { gruppe: 5, bild: "⏰", ort: "Street", a: "🧒", b: "👴",
    zuege: ["Excuse me, what time is it?", "It's three o'clock.", "Thank you!", "You're welcome."],
    falsch: ["It's red.", "I'm eight."], tipp: "Jemand fragt nach der Uhrzeit und bedankt sich." },
  { gruppe: 5, bild: "🎨", ort: "School", a: "👧", b: "🧒",
    zuege: ["What's your favourite colour?", "It's blue. And yours?", "My favourite colour is green.", "Green is nice!"],
    falsch: ["It's Monday.", "Here you are."], tipp: "Zwei Kinder fragen sich nach der Lieblingsfarbe." },
  { gruppe: 5, bild: "📅", ort: "School", a: "🧒", b: "👧",
    zuege: ["What day is it today?", "It's Friday.", "Great! Tomorrow is Saturday!", "Yes, no school!"],
    falsch: ["It's half past two.", "I'm from Zurich."], tipp: "Jemand fragt nach dem Wochentag." },
  { gruppe: 5, bild: "🤒", ort: "School", a: "👩‍🏫", b: "🧒",
    zuege: ["How are you today?", "I'm not so good. I'm tired.", "Oh, sorry. Sit down.", "Thank you."],
    falsch: ["It's sunny.", "What's your name?"], tipp: "Die Lehrerin fragt, wie es dem Kind geht." },
  { gruppe: 5, bild: "🎂", ort: "Playground", a: "🧒", b: "👧",
    zuege: ["When is your birthday?", "It's in May. And yours?", "My birthday is in October.", "Nice!"],
    falsch: ["It's four o'clock.", "Here you are."], tipp: "Zwei Kinder fragen sich nach dem Geburtstag." },
  { gruppe: 5, bild: "🌦️", ort: "Home", a: "🧒", b: "👩",
    zuege: ["What's the weather like today?", "It's rainy.", "Oh no! I want to play outside.", "Let's play inside, then."],
    falsch: ["It's Tuesday.", "I'm nine."], tipp: "Jemand fragt nach dem Wetter." },
  { gruppe: 5, bild: "⏰", ort: "Home", a: "🧒", b: "👩",
    zuege: ["What time is it, please?", "It's half past four.", "Oh no, I'm late!", "Hurry up, then!"],
    falsch: ["It's yellow.", "My name is Ben."], tipp: "Jemand fragt nach der Uhrzeit und ist spät dran." },
  { gruppe: 5, bild: "🚲", ort: "Playground", a: "👧", b: "🧒",
    zuege: ["What colour is your new bike?", "It's red.", "Cool! My bike is blue.", "Blue is nice, too."],
    falsch: ["It's June.", "Good night!"], tipp: "Zwei Kinder reden über die Farbe ihrer Velos." },
  { gruppe: 5, bild: "😊", ort: "School", a: "👧", b: "🧒",
    zuege: ["How do you feel?", "I'm happy! It's my birthday.", "Happy birthday!", "Thank you!"],
    falsch: ["It's Monday.", "It's green."], tipp: "Jemand fragt nach dem Befinden, und es gibt einen Grund zur Freude." },
  { gruppe: 5, bild: "📅", ort: "Home", a: "🧒", b: "👨",
    zuege: ["What's the date today?", "It's the first of May.", "Oh, it's Mum's birthday!", "Let's make a card!"],
    falsch: ["It's six o'clock.", "I'm fine."], tipp: "Jemand fragt nach dem Datum." },

  // Gruppe 6: vier bis fünf Züge — Shop, School, Playground
  { gruppe: 6, bild: "🛒", ort: "Shop", a: "🧒", b: "🧑‍🌾",
    zuege: ["Good morning! Can I have two bananas, please?", "Yes, of course. Here you are.", "How much is it?", "It's one franc.", "Thank you! Goodbye!"],
    falsch: ["Good night!", "I'm eight."], tipp: "Im Laden: grüssen, bestellen, bekommen, nach dem Preis fragen, bezahlen, gehen." },
  { gruppe: 6, bild: "🏫", ort: "School", a: "🧒", b: "👩‍🏫",
    zuege: ["Good morning, Mrs Smith!", "Good morning, Lea! How are you?", "I'm fine, thank you.", "Good. Sit down, please."],
    falsch: ["It's red.", "Can I have an apple, please?"], tipp: "In der Schule: grüssen, nach dem Befinden fragen, antworten." },
  { gruppe: 6, bild: "⚽", ort: "Playground", a: "🧒", b: "👦",
    zuege: ["Hi! Can I play with you?", "Yes, sure! What's your name?", "I'm Ben. And you?", "I'm Tom. Let's play football!", "Great idea!"],
    falsch: ["Good night!", "It's four o'clock."], tipp: "Auf dem Spielplatz: fragen, ob man mitspielen darf, dann die Namen." },
  { gruppe: 6, bild: "🍦", ort: "Kiosk", a: "🧒", b: "🧑‍🍳",
    zuege: ["Hello! Can I have an ice cream, please?", "Yes. Chocolate or vanilla?", "Chocolate, please.", "Here you are.", "Thank you! Bye!"],
    falsch: ["I'm from Bern.", "It's Monday."], tipp: "Am Kiosk: bestellen, die Sorte wählen, bekommen, bedanken." },
  { gruppe: 6, bild: "⏰", ort: "School", a: "🧒", b: "👨‍🏫",
    zuege: ["Sorry, I'm late!", "That's OK. Sit down, please.", "Thank you, Mr Brown.", "Open your books, please."],
    falsch: ["Here you are.", "What's your favourite colour?"], tipp: "In der Schule: Jemand kommt zu spät und entschuldigt sich." },
  { gruppe: 6, bild: "🛝", ort: "Playground", a: "👦", b: "🧒",
    zuege: ["Hello! Is this your ball?", "Yes, it is. Thank you!", "You're welcome. Can I play with you?", "Yes, of course!"],
    falsch: ["It's half past two.", "Good night!"], tipp: "Auf dem Spielplatz: Jemand bringt einen Ball zurück und fragt, ob er mitspielen darf." },
  { gruppe: 6, bild: "📚", ort: "Shop", a: "🧒", b: "👩",
    zuege: ["Excuse me, how much is this book?", "It's five francs.", "OK. Here you are.", "Thank you. Goodbye!", "Bye!"],
    falsch: ["I'm nine.", "What day is it?"], tipp: "Im Laden: nach dem Preis fragen, bezahlen, sich verabschieden." },
  { gruppe: 6, bild: "✏️", ort: "School", a: "🧒", b: "👩‍🏫",
    zuege: ["Excuse me, can I have a pencil, please?", "Yes, here you are.", "Thank you very much!", "You're welcome."],
    falsch: ["It's sunny.", "I'm tired."], tipp: "In der Schule: höflich um einen Stift bitten, bekommen, bedanken." },
  { gruppe: 6, bild: "🎒", ort: "Playground", a: "👧", b: "🧒",
    zuege: ["Hello! I'm new here. What's your name?", "My name is Anna. How old are you?", "I'm eight. And you?", "I'm nine. Let's play!"],
    falsch: ["Here you are.", "It's blue."], tipp: "Auf dem Spielplatz: Ein neues Kind fragt nach Name und Alter." },
  { gruppe: 6, bild: "🏫", ort: "School", a: "👩‍🏫", b: "🧒",
    zuege: ["It's three o'clock. Time to go home!", "Bye, Mrs Smith!", "Bye, children! See you tomorrow!", "See you!"],
    falsch: ["Can I have a biscuit, please?", "It's green."], tipp: "In der Schule: Die Stunde ist aus, alle verabschieden sich." },
];

const DIALOG_HOEFLICH = [
  ["🥪", "Can I have a sandwich, please?", "Yes, of course. Here you are.", "No! Go away!", "I'm eight.", "Jemand bittet höflich um etwas. Antworte freundlich und passend."],
  ["🚻", "Excuse me, where is the toilet?", "It's over there, next to the door.", "I don't care. Go away!", "It's three o'clock.", "Jemand fragt nach dem Weg. Antworte freundlich und passend."],
  ["⚽", "Can I play with you?", "Yes, sure! Come on!", "No way! Go home!", "My name is Tom.", "Jemand möchte mitspielen. Antworte freundlich und passend."],
  ["🎁", "Thank you for the present!", "You're welcome!", "Whatever. Leave me alone.", "It's red.", "Jemand bedankt sich. Antworte freundlich und passend."],
  ["⏰", "Sorry, I'm late.", "That's OK. Sit down, please.", "Be quiet and sit down!", "I like pizza.", "Jemand entschuldigt sich. Antworte freundlich und passend."],
  ["🙋", "Can you help me, please?", "Yes, of course.", "No. Do it yourself!", "It's Monday.", "Jemand bittet um Hilfe. Antworte freundlich und passend."],
  ["🍎", "Would you like an apple?", "Yes, please.", "Give it to me! Now!", "I'm from Switzerland.", "Jemand bietet dir etwas an. Antworte freundlich und passend."],
  ["🖊️", "Excuse me, is this your pen?", "Yes, it is. Thank you!", "Hands off! It's mine!", "I'm nine.", "Jemand bringt dir etwas zurück. Antworte freundlich und passend."],
  ["🪑", "Can I sit here?", "Yes, of course.", "No! Go away!", "It's half past two.", "Jemand möchte sich zu dir setzen. Antworte freundlich und passend."],
  ["🏫", "Good morning, Mrs Smith!", "Good morning, Tom!", "Leave me alone!", "It's blue.", "Jemand grüsst dich am Morgen. Antworte freundlich und passend."],
  ["🍦", "Here is your ice cream.", "Thank you very much!", "Finally! Give it to me!", "I'm fine.", "Jemand gibt dir etwas. Antworte freundlich und passend."],
  ["🥅", "Do you want to play football?", "Yes, good idea!", "Football is stupid! No!", "It's sunny.", "Jemand lädt dich zum Spielen ein. Antworte freundlich und passend."],
  ["💥", "Oops! Sorry!", "No problem.", "Hey! Look where you are going!", "It's Tuesday.", "Jemand stösst dich an und entschuldigt sich. Antworte freundlich und passend."],
  ["✏️", "Can I borrow your pencil?", "Yes, here you are.", "No! It's mine!", "I live in Zurich.", "Jemand möchte etwas ausleihen. Antworte freundlich und passend."],
  ["🛒", "Excuse me, how much is this?", "It's two francs.", "Can't you read? Look at the sign!", "It's Friday.", "Jemand fragt nach dem Preis. Antworte freundlich und passend."],
];
