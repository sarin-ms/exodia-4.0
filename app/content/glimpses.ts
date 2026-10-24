export interface Glimpse {
  readonly id: string;
  readonly title: string;
  readonly alt: string;
  readonly thumbnail: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export const glimpses: readonly Glimpse[] = [
  {
    id: "mentor-in-action",
    title: "A new perspective",
    alt: "A mentor explaining a concept beside a projected presentation.",
    thumbnail: "/images/glimpses/mentor-in-action-thumb.webp",
    src: "/images/glimpses/mentor-in-action.webp",
    width: 1500,
    height: 1000,
  },
  {
    id: "workshop-room",
    title: "A room full of curiosity",
    alt: "Participants working at computers in a bright workshop room.",
    thumbnail: "/images/glimpses/workshop-room-thumb.webp",
    src: "/images/glimpses/workshop-room.webp",
    width: 1125,
    height: 1500,
  },
  {
    id: "tech-in-session",
    title: "In the moment",
    alt: "A classroom of participants listening with their laptops open.",
    thumbnail: "/images/glimpses/tech-in-session-thumb.webp",
    src: "/images/glimpses/tech-in-session.webp",
    width: 1800,
    height: 1200,
  },
  {
    id: "after-hours",
    title: "After-hours magic",
    alt: "An evening performance on a decorated stage beside a bonfire.",
    thumbnail: "/images/glimpses/after-hours-thumb.webp",
    src: "/images/glimpses/after-hours.webp",
    width: 1800,
    height: 1200,
  },
  {
    id: "shared-learning",
    title: "Better, together",
    alt: "Participants collaborating around a laptop during a workshop.",
    thumbnail: "/images/glimpses/shared-learning-thumb.webp",
    src: "/images/glimpses/shared-learning.webp",
    width: 1800,
    height: 1200,
  },
  {
    id: "talks-and-ideas",
    title: "Ideas take the stage",
    alt: "An audience listening to a speaker in the college auditorium.",
    thumbnail: "/images/glimpses/talks-and-ideas-thumb.webp",
    src: "/images/glimpses/talks-and-ideas.webp",
    width: 1040,
    height: 694,
  },
  {
    id: "exodia-community",
    title: "The people make it",
    alt: "A large group of Exodia participants gathered in the college courtyard.",
    thumbnail: "/images/glimpses/exodia-community-thumb.webp",
    src: "/images/glimpses/exodia-community.webp",
    width: 1800,
    height: 1200,
  },
  {
    id: "building-together",
    title: "Learning by doing",
    alt: "Participants following a session and working on laptops together.",
    thumbnail: "/images/glimpses/building-together-thumb.webp",
    src: "/images/glimpses/building-together.webp",
    width: 1800,
    height: 1200,
  },
  {
    id: "evening-gathering",
    title: "An evening together",
    alt: "Participants seated outdoors beneath trees and event lights.",
    thumbnail: "/images/glimpses/evening-gathering-thumb.webp",
    src: "/images/glimpses/evening-gathering.webp",
    width: 1280,
    height: 853,
  },
  {
    id: "hands-on-learning",
    title: "From ideas to practice",
    alt: "A hands-on session with a mentor, laptops, and participants in a lab.",
    thumbnail: "/images/glimpses/hands-on-learning-thumb.webp",
    src: "/images/glimpses/hands-on-learning.webp",
    width: 1125,
    height: 1500,
  },
];
