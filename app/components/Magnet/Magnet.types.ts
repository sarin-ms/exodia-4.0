import type { ReactNode } from "react";

export interface MagnetProps {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  maxOffset?: number;
}
