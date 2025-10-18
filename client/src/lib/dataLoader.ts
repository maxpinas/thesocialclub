// Utility functions for loading research data

export async function loadMarkdown(filename: string): Promise<string> {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return '';
  }
}

export async function loadJSON<T>(filename: string): Promise<T | null> {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

export function parseMarkdownSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = markdown.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if line is a heading (# or ##)
    const headingMatch = line.match(/^#{1,2}\s+(.+)$/);
    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      // Start new section
      currentSection = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

export function extractSampleSize(text: string): number {
  const match = text.match(/n=(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

export function extractConfidenceScore(text: string): number {
  const stars = (text.match(/⭐/g) || []).length;
  return stars;
}

export function countThemes(text: string): Array<{ theme: string; count: number }> {
  if (!text) return [];
  
  const themes: Array<{ theme: string; count: number }> = [];
  const parts = text.split(', ');
  
  for (const part of parts) {
    const match = part.match(/(.+?)\s*\(n=(\d+)\)/);
    if (match) {
      themes.push({
        theme: match[1].trim(),
        count: parseInt(match[2], 10)
      });
    }
  }
  
  return themes.sort((a, b) => b.count - a.count);
}

