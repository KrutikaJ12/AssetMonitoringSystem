import {
  Truck,
  Tractor,
  Cog,
  Container,
  Construction,
} from "lucide-react";

export const assetIcons: Record<string, React.ElementType> = {
  forklift: Construction,
  "electric forklift": Construction,
  "diesel forklift": Construction,

  excavator: Construction,
  "backhoe loader": Construction,
  "wheel loader": Construction,
  bulldozer: Construction,
  "motor grader": Construction,

  "dump truck": Truck,
  tractor: Tractor,

  "mobile crane": Construction,
  "tower crane": Construction,

  "dg set": Cog,
  "air compressor": Cog,

  "concrete mixer": Container,
  "water tanker": Truck,
  "generator trailer": Cog,
};