import signLanguage from "../assets/images/experience/signLangReg.png";
import myAcson from "../assets/images/experience/myAcson.png";
import kamiInventory from "../assets/images/experience/kamiInventory.png";
import ragChat from "../assets/images/experience/ragChat.png";

export type RoadmapStop = {
  year: number;
  title: string;
  description: string;
  image: string;
  /** Horizontal position along the roadmap art (%) */
  x: number;
  /** Vertical position along the roadmap art (%) */
  y: number;
  side: "above" | "below";
};

/**
 * Positions tuned to winding path in `roadmap.svg` (viewBox 1455×1081):
 * entry → valley (2023) → peak (2025) → valley (2024) → peak (2026).
 */
export const roadmapStops: RoadmapStop[] = [
  {
    year: 2022,
    title: "Building foundations",
    description:
      "Industry-wise, completed an internship at BP Health Care; academically, explored computer vision and machine learning stuff.",
    image: signLanguage,
    x: 17,
    y: 63,
    side: "below",
  },
  {
    year: 2023,
    title: "Short break",
    description:
      "Joined USA summer WAT after graduation, met lots of amazing people. Yea i had my good time there!",
    image: myAcson,
    x: 43,
    y: 63,
    side: "below",
  },
  {
    year: 2024,
    title: "Growing",
    description:
      "Joined Daikin Malaysia as a mobile app dev, gaining exposure and learnt a lot from the team. ",
    image: kamiInventory,
    x: 61,
    y: 57,
    side: "below",
  },
  {
    year: 2025,
    title: "Climbing up",
    description:
      "Doing good in app team, learnt a lot of cloud stuff as well along the way. Handling alots of projects as well.",
    image: ragChat,
    x: 49,
    y: 35,
    side: "below",
  },
  {
    year: 2026,
    title: "Whats next",
    description: "We will see.",
    image: "",
    x: 73,
    y: 38,
    side: "below",
  },
];
