// Source reference mapping for tooltips
export const SOURCE_REFERENCES: Record<number, string> = {
  1: "The Social Hub website - Official pricing and membership information",
  2: "TripAdvisor reviews - Guest feedback and ratings",
  3: "Booking.com - Room rates and availability",
  4: "Google Reviews - Customer sentiment analysis",
  5: "Reddit discussions - Community feedback and experiences",
  6: "Instagram - Visual content and brand positioning",
  7: "Twitter/X - Real-time customer feedback",
  8: "Facebook - Community engagement and reviews",
  9: "LinkedIn - Professional network and business positioning",
  10: "The Social Hub Groningen - Specific location pricing",
  11: "The Social Hub locations - Multi-property pricing data",
  12: "The Social Hub Groningen - Parking services",
  13: "The Social Hub Groningen - Breakfast pricing",
  14: "The Social Hub - Membership program details",
  15: "Soho House - Membership pricing comparison",
  16: "WeWork - Co-working space pricing comparison",
  17: "The Hoxton - Competitive analysis",
  18: "CitizenM - Competitive analysis",
  19: "Mama Shelter - Competitive analysis",
  20: "Zoku - Competitive analysis"
};

export function getSourceReference(num: number): string {
  return SOURCE_REFERENCES[num] || `Source reference [${num}]`;
}
