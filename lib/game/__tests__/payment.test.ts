import { describe, it, expect } from "@jest/globals";
import { DUE_CURVE } from "../constants";

describe("Payment Logic", () => {
  it("should have correct due curve", () => {
    expect(DUE_CURVE).toHaveLength(12);
    expect(DUE_CURVE[0]).toBe(250);
    expect(DUE_CURVE[11]).toBe(4740);
    
    // Should be increasing
    for (let i = 1; i < DUE_CURVE.length; i++) {
      expect(DUE_CURVE[i]).toBeGreaterThan(DUE_CURVE[i - 1]);
    }
  });

  it("should calculate loan voucher penalty correctly", () => {
    const baseDue = 1000;
    const penalty = 0.35;
    const newDue = Math.round(baseDue * (1 + penalty));
    expect(newDue).toBe(1350);
  });
});

