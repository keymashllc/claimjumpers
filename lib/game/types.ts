import { MetalType, Biome, SpecimenForm, SpecimenGrade } from "@/lib/prisma-types";

export type MiningMode = "drill" | "blast";

export interface VeinResult {
  isSpecimen: boolean;
  metalType?: MetalType;
  units?: number;
  specimen?: {
    form: SpecimenForm;
    grade: SpecimenGrade;
    metalType: MetalType;
    biome: Biome;
  };
}

export interface MiningShiftResult {
  veins: VeinResult[];
  damage: number;
}

export interface DropAction {
  type: "keep" | "melt" | "sell";
  itemId: string;
  metalType?: MetalType;
  units?: number;
}

