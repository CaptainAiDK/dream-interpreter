/**
 * Danish language constants for the dream interpretation app
 */

export const DANISH_UI = {
  // Tabs
  tabs: {
    fullDream: "Fuld drøm",
    scenarios: "Scenarier",
    information: "Information",
  },

  // Full Dream Tab
  fullDream: {
    title: "Fuld drøm tolkning",
    subtitle: "Beskriv din drøm i detaljer for en dybdegående tolkning",
    inputLabel: "Skriv din drøm her",
    inputPlaceholder:
      "Beskriv din drøm så detaljeret som muligt. Hvad skete der? Hvem var der? Hvad følte du?",
    submitButton: "Tolks drøm",
    analyzing: "Analyserer drøm...",
    error: "Fejl ved tolkning af drøm",
    minLength: "Drømmen skal være mindst 10 tegn",
    maxLength: "Drømmen må ikke være længere end 5000 tegn",
  },

  // Scenarios Tab
  scenarios: {
    title: "Drømscenarier",
    subtitle: "Vælg et scenario for at få en hurtig tolkning",
    selectLabel: "Vælg et scenario",
    selectPlaceholder: "Vælg et drømscenario...",
    additionalContext: "Yderligere kontekst (valgfrit)",
    additionalContextPlaceholder: "Tilføj flere detaljer om dit scenario...",
    submitButton: "Tolks scenario",
    analyzing: "Analyserer scenario...",
    error: "Fejl ved tolkning af scenario",
    scenarios: {
      flying: "Flyve",
      falling: "Falde",
      water: "Vand",
      animals: "Dyr",
      people: "Mennesker",
      chase: "Forfølgelse",
      death: "Død",
      house: "Hus",
      school: "Skole",
      work: "Arbejde",
    },
  },

  // Information Tab
  information: {
    title: "Om drømmenes betydning",
    subtitle: "Lær om drømmenes symbolisme og betydning",
    sections: {
      introduction: {
        title: "Introduktion til drømmetolkning",
        content: `Drømme har fascineret mennesker i tusinder af år. De kan give indsigt i vores ubevidste sind, vores ønsker, frygt og håb. 
        
Denne app bruger moderne psykologisk viden og kulturel symbolisme til at hjælpe dig med at forstå dine drømmes betydning.`,
      },
      symbolism: {
        title: "Almindelige drømmesymboler",
        content: `Mange drømme indeholder tilbagevendende symboler. Her er nogle af de mest almindelige:

• Vand: Følelser, det ubevidste, forandring
• Huse: Selvet, forskellige aspekter af personligheden
• Dyr: Instinkter, primitive kræfter, personlighedstræk
• Mennesker: Forskellige dele af dig selv eller mennesker i dit liv
• At flyve: Frihed, ambition, perspektiv
• At falde: Angst, tab af kontrol, usikkerhed`,
      },
      psychology: {
        title: "Psykologisk perspektiv",
        content: `Fra et psykologisk perspektiv tjener drømme flere formål:

1. Emotionel behandling: Drømme hjælper os med at behandle følelser og oplevelser
2. Problemløsning: Vores ubevidste sind arbejder på problemer, mens vi sover
3. Hukommelseskonsolidering: Drømme spiller en rolle i at konsolidere minder
4. Kreativitet: Mange kunstnere og opfindere har fået inspiration fra drømme

Sigmund Freud så drømme som "vejen til det ubevidste", mens Carl Jung betragtede dem som vigtige for personlig vækst.`,
      },
      interpretation: {
        title: "Sådan tolker du dine egne drømme",
        content: `Her er nogle tips til at tolke dine egne drømme:

1. Skriv ned: Skriv drømmen ned så snart du vågner, før du glemmer den
2. Følelser: Fokuser på de følelser, du havde i drømmen
3. Symboler: Identificer vigtige symboler og hvad de betyder for dig personligt
4. Kontekst: Overvej hvad der skete i dit liv, da du havde drømmen
5. Mønster: Se efter tilbagevendende temaer i dine drømme
6. Intuition: Lyt til din egen intuition - du kender dig selv bedst`,
      },
    },
  },

  // Common UI
  common: {
    loading: "Indlæser...",
    error: "Der opstod en fejl",
    success: "Succes",
    close: "Luk",
    back: "Tilbage",
    next: "Næste",
    submit: "Indsend",
    cancel: "Annuller",
    save: "Gem",
    delete: "Slet",
    edit: "Rediger",
    connectionError: "Fejl ved forbindelse til server",
    tryAgain: "Prøv igen",
    noData: "Ingen data tilgængelig",
    history: "Drømmehistorie",
    viewHistory: "Se historik",
    clearHistory: "Ryd historik",
    confirmDelete: "Er du sikker på, at du vil slette?",
  },

  // Error messages
  errors: {
    networkError: "Netværksfejl - kontroller din internetforbindelse",
    serverError: "Serverfejl - prøv igen senere",
    invalidInput: "Ugyldigt input",
    notFound: "Ikke fundet",
    unauthorized: "Du skal være logget ind",
    forbidden: "Adgang nægtet",
    tooManyRequests: "For mange anmodninger - vent venligst",
  },

  // Auth
  auth: {
    login: "Log ind",
    logout: "Log ud",
    loginRequired: "Log ind for at fortsætte",
    welcome: "Velkommen",
  },
};

export type DanishUI = typeof DANISH_UI;
