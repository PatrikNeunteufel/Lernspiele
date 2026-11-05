/* Inhaltsliste „Français : grammaire“ (FS2F.5.D.1) — zum Durchsehen ohne Code. UNGEPRÜFT (LST_Session1), bis Patrik
   sie durchgesehen hat. Je Eintrag: satz (mit „___“ für die Lücke) und optionen mit der richtigen zuerst, oder art "satz"
   mit ganzen Sätzen (richtiger zuerst); thema benennt die Struktur. Achtung beim Erweitern: nur EINE Antwort darf
   korrekt sein (etwa bei der Verneinung nicht „pas“ und „jamais“ zugleich als Lücke anbieten).
   Vor ? ! : steht ein geschütztes Leerzeichen ( ), wie im Französischen üblich. */
"use strict";

const FRANZOESISCH = {
  // b: Konjugation wichtiger Verben, Personalpronomen als Subjekt, Frage mit Fragewort
  b: [
    { satz: "Je ___ suisse.", optionen: ["suis", "es", "est", "sommes"], thema: "etre" },
    { satz: "Nous ___ en classe.", optionen: ["sommes", "êtes", "sont", "est"], thema: "etre" },
    { satz: "Ils ___ un chien.", optionen: ["ont", "a", "avons", "sont"], thema: "avoir" },
    { satz: "Tu ___ quel âge ?", optionen: ["as", "a", "ai", "es"], thema: "avoir" },
    { satz: "Elle ___ au cinéma.", optionen: ["va", "vas", "vais", "vont"], thema: "aller" },
    { satz: "Vous ___ du sport ?", optionen: ["faites", "faisons", "font", "fais"], thema: "faire" },
    { satz: "Nous ___ le français.", optionen: ["parlons", "parle", "parlez", "parlent"], thema: "verbe-er" },
    { satz: "Les élèves ___ la porte.", optionen: ["ferment", "ferme", "fermons", "fermez"], thema: "verbe-er" },
    { satz: "Marie est ma sœur. ___ a douze ans.", optionen: ["Elle", "Il", "Ils", "Elles"], thema: "pronom-sujet" },
    { satz: "Paul et moi, ___ jouons au foot.", optionen: ["nous", "vous", "ils", "on"], thema: "pronom-sujet" },
    { satz: "___ est-ce que tu habites ? — À Berne.", optionen: ["Où", "Quand", "Qui", "Comment"], thema: "interrogatif" },
    { satz: "___ est-ce que tu as cours de maths ? — Le lundi.", optionen: ["Quand", "Où", "Qui", "Combien"], thema: "interrogatif" },
    { satz: "___ coûte le livre ? — Douze francs.", optionen: ["Combien", "Comment", "Qui", "Où"], thema: "interrogatif" },
  ],
  // c: Wortfolge in Aussage und Frage, Verben mit zwei Objekten, unregelmässiger Plural, häufige Präpositionen
  c: [
    { art: "satz", optionen: ["Est-ce que tu aimes la musique ?", "Est-ce tu aimes la musique ?", "Est-ce que aimes tu la musique ?", "Tu est-ce que aimes la musique ?"], thema: "ordre-question" },
    { art: "satz", optionen: ["Où est-ce que vous habitez ?", "Où vous est-ce que habitez ?", "Est-ce que où vous habitez ?", "Où est-ce vous habitez ?"], thema: "ordre-question" },
    { art: "satz", optionen: ["Je mange souvent des pommes.", "Je souvent mange des pommes.", "Souvent je des pommes mange.", "Je mange des souvent pommes."], thema: "ordre-phrase" },
    { art: "satz", optionen: ["Elle écrit une lettre à son ami.", "Elle écrit son ami une lettre.", "Elle écrit à une lettre son ami.", "Elle une lettre écrit à son ami."], thema: "deux-objets" },
    { art: "satz", optionen: ["Je donne le livre à Marie.", "Je donne Marie le livre.", "Je donne à le livre Marie.", "Je le livre donne à Marie."], thema: "deux-objets" },
    { satz: "Un cheval, deux ___.", optionen: ["chevaux", "chevals", "chevauxs", "chevales"], thema: "pluriel" },
    { satz: "Un journal, deux ___.", optionen: ["journaux", "journals", "journauxs", "journales"], thema: "pluriel" },
    { satz: "Un gâteau, deux ___.", optionen: ["gâteaux", "gâteaus", "gâteauxs", "gâteaues"], thema: "pluriel" },
    { satz: "Un œil, deux ___.", optionen: ["yeux", "œils", "œux", "yeuxs"], thema: "pluriel" },
    { satz: "J'habite ___ Suisse.", optionen: ["en", "à", "au", "aux"], thema: "preposition" },
    { satz: "Demain, je vais ___ Berne.", optionen: ["à", "en", "au", "aux"], thema: "preposition" },
    { satz: "Nous partons en vacances ___ Portugal.", optionen: ["au", "en", "à", "aux"], thema: "preposition" },
    { satz: "Le livre est ___ la table, pas dessous.", optionen: ["sur", "sous", "dans", "à"], thema: "preposition" },
  ],
  // d: Hilfs- und Modalverben, Formen der Negation, Demonstrativ- und Reflexivpronomen; im Text: Zeitformen,
  //    Possessivpronomen, begründende Konjunktionen
  d: [
    { satz: "Je ___ faire mes devoirs, c'est obligatoire.", optionen: ["dois", "doit", "devons", "devez"], thema: "modal" },
    { satz: "Nous ___ aller au cinéma ce soir, nous en avons très envie.", optionen: ["voulons", "voulez", "veulent", "veux"], thema: "modal" },
    { art: "satz", optionen: ["Je ne mange pas de viande.", "Je mange ne pas de viande.", "Je ne pas mange de viande.", "Je ne mange de viande pas."], thema: "negation" },
    { art: "satz", optionen: ["Il n'a jamais vu la mer.", "Il a ne jamais vu la mer.", "Il n'a vu jamais la mer.", "Il ne jamais a vu la mer."], thema: "negation" },
    { satz: "___ arbre est très vieux.", optionen: ["Cet", "Ce", "Cette", "Ces"], thema: "demonstratif" },
    { satz: "___ chaussures sont neuves.", optionen: ["Ces", "Cette", "Ce", "Cet"], thema: "demonstratif" },
    { satz: "___ maison est grande.", optionen: ["Cette", "Ce", "Cet", "Ces"], thema: "demonstratif" },
    { satz: "Le matin, je ___ lève à six heures.", optionen: ["me", "te", "se", "nous"], thema: "reflexif" },
    { satz: "Ils ___ couchent tard.", optionen: ["se", "leur", "nous", "me"], thema: "reflexif" },
    { satz: "C'est le vélo de moi : c'est ___ vélo.", optionen: ["mon", "ma", "mes", "ton"], thema: "possessif" },
    { satz: "Elle cherche les clés d'elle : elle cherche ___ clés.", optionen: ["ses", "sa", "son", "leurs"], thema: "possessif" },
    { satz: "Quel temps ? « J'ai fini mes devoirs. » ___", optionen: ["passé composé", "imparfait", "présent", "futur proche"], thema: "temps" },
    { satz: "Quel temps ? « Nous allons partir demain. » ___", optionen: ["futur proche", "passé composé", "présent", "imparfait"], thema: "temps" },
    { satz: "Quel temps ? « Quand j'étais petit, je jouais beaucoup. » ___", optionen: ["imparfait", "passé composé", "présent", "futur proche"], thema: "temps" },
    { satz: "Je reste à la maison ___ je suis malade.", optionen: ["parce que", "mais", "donc", "ou"], thema: "conjonction" },
    { satz: "Il pleut, ___ je prends mon parapluie.", optionen: ["donc", "parce que", "mais", "ou"], thema: "conjonction" },
  ],
};

if (typeof module !== "undefined") module.exports = FRANZOESISCH;
