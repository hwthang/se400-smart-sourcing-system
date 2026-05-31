export class PrecisionHelper {
  static isValidBasicPoint(value?: number, factor = 10000): boolean {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return false;
    }

    const result = value * factor;

    // chống floating point precision error
    return Math.abs(result - Math.round(result)) < 1e-9;
  }

  static toBasicPoint(value: number, factor = 10000): number {
    if (!this.isValidBasicPoint(value, factor)) {
      throw new Error(`Value must be divisible by ${1 / factor}`);
    }

    return Math.round(value * factor);
  }

  /**
   * Convert percentage -> basis points
   *
   * 1% = 100 basis points
   *
   * Example:
   * 50% => 5000
   * 0.5% => 50
   * 12.34% => 1234
   */
  static toBasicPointFromPercentage(value: number): number {
    return this.toBasicPoint(value, 100);
  }
}
