import alaska from "../assets/images/timeline/alaskawat.png";
import working from "../assets/images/timeline/working.png";
import working2 from "../assets/images/timeline/working2.png";

/** Swap `color` / `image` / `maskShape` when final assets are ready. */
export type TimelineMaskShape = "circle" | "blob";

export type TimelineFrame = {
  year: string;
  caption: string;
  color: string;
  maskShape: TimelineMaskShape;
  image?: string;
};

export const timelineFrames: TimelineFrame[] = [
  {
    year: "2022",
    caption: "I did my intern as a wordpress developer.",
    color: "#1a5f8f",
    maskShape: "circle",
    // image: ,
  },
  {
    year: "2023",
    caption:
      "2023 Summer WAT, and this is one of the best memories of my life.",
    color: "#1a5f8f",
    maskShape: "circle",
    image: alaska,
  },
  {
    year: "2024",
    caption: "Got my first job as an app developer in Daikin Malaysia!",
    color: "#236b9b",
    maskShape: "circle",
    image: working,
  },
  {
    year: "2025",
    caption:
      "I can tell im getting more and more exposure. Responsibilities always come along with stress. Good luck CC.",
    color: "#2d7aab",
    maskShape: "circle",
    image: working2,
  },
  {
    year: "2026",
    caption: "Photo slot",
    color: "#3282b8",
    maskShape: "circle",
  },
];

/** Expanding mask on the *incoming* layer: circle grows over the previous image. */
export const timelineRevealClipPaths: Record<
  TimelineMaskShape,
  { closed: string; open: string }
> = {
  circle: {
    closed: "circle(0% at 50% 50%)",
    open: "circle(150% at 50% 50%)",
  },
  blob: {
    closed: "ellipse(0% 0% at 50% 50%)",
    open: "ellipse(120% 100% at 50% 50%)",
  },
};
