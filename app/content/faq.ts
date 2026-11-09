export const faq = [
  {
    id: "about-exodia",
    question: "What is Exodia?",
    answer:
      "Exodia is a state level technical fest at the College of Engineering Chengannur, celebrating technology, innovation and creativity.",
  },
  {
    id: "who-is-it-for",
    question: "Who can participate?",
    answer:
      "College students and technology enthusiasts from across Kerala are welcome to participate.",
  },
  {
    id: "learning-stacks",
    question: "What are the major technical stacks?",
    answer:
      "Exodia features three domains: Agentic AI, Embedded Systems and Game Development.",
  },
  {
    id: "prior-experience",
    question: "Do I need prior technical knowledge?",
    answer:
      "Not necessarily! Participants with different skill levels are welcome. Specific event requirements will be shared separately.",
  },
  {
    id: "registration",
    question: "How can I register?",
    answer:
      "Visit the official Exodia website, explore the events and follow the registration instructions.",
  },
  {
    id: "certificates",
    question: "Will participants receive certificates?",
    answer: "Yes, the participants will receive certificates.",
  },
  {
    id: "venue",
    question: "Where will Exodia take place?",
    answer:
      "Exodia will be hosted at the College of Engineering Chengannur (CEC), Kerala.",
  },
] as const;

export type FaqItem = (typeof faq)[number];
