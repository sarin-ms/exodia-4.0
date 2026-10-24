export const faq = [
  {
    id: "who-is-it-for",
    question: "Who is Exodia for?",
    answer:
      "Exodia brings together curious learners, builders, and tech enthusiasts. If you enjoy exploring ideas, making things, and learning with other people, you’re in the right place.",
  },
  {
    id: "learning-stacks",
    question: "What can I explore at Exodia 4.0?",
    answer:
      "This chapter brings three stacks: Agentic AI, Embedded Systems, and Godot. Explore intelligent agents, connect code with hardware, or bring a game world to life.",
  },
  {
    id: "prior-experience",
    question: "Do I need experience in my chosen stack?",
    answer:
      "Start with the stack that sparks your curiosity. Specific prerequisites and preparation notes will be included in the workshop details, so you can check what you need before choosing.",
  },
  {
    id: "what-to-bring",
    question: "What should I bring along?",
    answer:
      "A laptop, its charger, and a willingness to experiment are a good start. Check your stack’s setup notes for any software or hardware requirements before the event.",
  },
  {
    id: "registration",
    question: "How do I register?",
    answer:
      "Registration for Exodia 4.0 isn’t open yet. The Register button on this website will carry the latest registration updates when they’re available.",
  },
  {
    id: "event-logistics",
    question: "What about travel, accommodation, and meals?",
    answer:
      "These arrangements haven’t been announced for Exodia 4.0 yet. Check the event information when registration opens before making travel or stay plans.",
  },
] as const;

export type FaqItem = (typeof faq)[number];
