// Source reference system that loads actual references from markdown files
import sourceReferencesData from '../../public/data/source_references.json';

type SourceReferencesData = Record<string, Record<string, string>>;
const references = sourceReferencesData as SourceReferencesData;

// Get source reference text for a specific brand and reference number
export function getSourceReference(num: number, brandId?: string): string {
  // If brandId is provided, try to get brand-specific reference
  if (brandId && references[brandId]) {
    const brandRefs = references[brandId];
    if (brandRefs[num.toString()]) {
      return brandRefs[num.toString()];
    }
  }
  
  // Fallback: search all brands for this reference number
  for (const brand in references) {
    const brandRefs = references[brand];
    if (brandRefs[num.toString()]) {
      return brandRefs[num.toString()];
    }
  }
  
  // Final fallback
  return `Source reference [${num}] - See References section at bottom of page`;
}

// Get all references for a specific brand
export function getBrandReferences(brandId: string): Record<number, string> {
  if (!references[brandId]) {
    return {};
  }
  
  const brandRefs = references[brandId];
  const result: Record<number, string> = {};
  
  for (const key in brandRefs) {
    result[parseInt(key)] = brandRefs[key];
  }
  
  return result;
}

