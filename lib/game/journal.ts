import { MetalType, Biome, SpecimenForm, SpecimenGrade } from "@/lib/prisma-types";

export type JournalPageType =
  | `metal-${MetalType}`
  | `biome-${Biome}`
  | `form-${SpecimenForm}`
  | "grade-Ultra";

export interface JournalSlot {
  pageType: JournalPageType;
  slotIndex: number; // 0-5
  requirements: {
    metalType?: MetalType;
    biome?: Biome;
    form?: SpecimenForm;
    grade?: SpecimenGrade;
  };
}

/**
 * Generate all journal page definitions
 */
export function generateJournalPages(): JournalSlot[] {
  const slots: JournalSlot[] = [];
  
  // 6 Metal Pages (SOL/AES/VIR/LUN/NOC/CRN)
  const metals: MetalType[] = ["SOL", "AES", "VIR", "LUN", "NOC", "CRN"];
  for (const metal of metals) {
    for (let i = 0; i < 6; i++) {
      slots.push({
        pageType: `metal-${metal}` as JournalPageType,
        slotIndex: i,
        requirements: { metalType: metal },
      });
    }
  }
  
  // 3 Biome Pages (Desert/Rift/Glacier)
  const biomes: Biome[] = ["Desert", "Rift", "Glacier"];
  for (const biome of biomes) {
    for (let i = 0; i < 6; i++) {
      slots.push({
        pageType: `biome-${biome}` as JournalPageType,
        slotIndex: i,
        requirements: { biome },
      });
    }
  }
  
  // 3 Form/Grade Pages (Coins, Bars, Ultra)
  const forms: SpecimenForm[] = ["Coin", "Bar"];
  for (const form of forms) {
    for (let i = 0; i < 6; i++) {
      slots.push({
        pageType: `form-${form}` as JournalPageType,
        slotIndex: i,
        requirements: { form },
      });
    }
  }
  
  // Ultra grade page
  for (let i = 0; i < 6; i++) {
    slots.push({
      pageType: "grade-Ultra",
      slotIndex: i,
      requirements: { grade: "Ultra" },
    });
  }
  
  return slots;
}

/**
 * Check if a specimen matches journal slot requirements
 */
export function matchesJournalSlot(
  specimen: {
    metalType: MetalType;
    biome: Biome;
    form: SpecimenForm;
    grade: SpecimenGrade;
  },
  requirements: {
    metalType?: MetalType;
    biome?: Biome;
    form?: SpecimenForm;
    grade?: SpecimenGrade;
  }
): boolean {
  if (requirements.metalType && specimen.metalType !== requirements.metalType) {
    return false;
  }
  if (requirements.biome && specimen.biome !== requirements.biome) {
    return false;
  }
  if (requirements.form && specimen.form !== requirements.form) {
    return false;
  }
  if (requirements.grade && specimen.grade !== requirements.grade) {
    return false;
  }
  return true;
}

/**
 * Find all matching journal slots for a specimen
 * In MVP, a specimen can fill MULTIPLE slots (more rewarding)
 */
export function findMatchingJournalSlots(
  specimen: {
    metalType: MetalType;
    biome: Biome;
    form: SpecimenForm;
    grade: SpecimenGrade;
  },
  allPages: JournalSlot[],
  filledSlots: Set<string> // Set of "pageType-slotIndex" strings
): JournalSlot[] {
  return allPages.filter((slot) => {
    const key = `${slot.pageType}-${slot.slotIndex}`;
    if (filledSlots.has(key)) {
      return false; // Already filled
    }
    return matchesJournalSlot(specimen, slot.requirements);
  });
}

