export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type FontFamilyChoice = 'serif' | 'sans' | 'mono';
export type ColumnWidthChoice = 'compact' | 'standard' | 'wide' | 'full';
export type PaperThemeChoice = 'paper' | 'minimal' | 'obsidian' | 'sepia' | 'slate';

export interface TypographySettings {
  fontFamily: FontFamilyChoice;
  fontSize: number; // e.g. 18
  lineHeight: number; // e.g. 1.7
  columnWidth: ColumnWidthChoice;
  paperTheme: PaperThemeChoice;
  typewriterMode: boolean;
  showLineNumbers: boolean;
  spellcheck: boolean;
}

export interface TextMetrics {
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  fleschScore: number;
  fleschRating: string;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export type DiffChunkType = 'unchanged' | 'added' | 'removed';

export interface DiffChunk {
  type: DiffChunkType;
  value: string;
}

export type ActiveTab = 'studio' | 'transform' | 'analyze';
