/**
 * Format options for time formatting functions
 */
export type TimeFormatOptions = {
  /**
   * Include hours in the formatted output
   * @default false
   */
  includeHours?: boolean;
  
  /**
   * Pad numbers with leading zeros
   * @default true
   */
  padWithZeros?: boolean;
};
