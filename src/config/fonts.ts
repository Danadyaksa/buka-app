export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'display' | 'typewriter' | 'handwriting';
}

export const FONTS: FontOption[] = [
  {
    id: 'typewriter',
    name: 'American Typewriter',
    family: "'Courier Prime', 'Courier New', monospace",
    category: 'typewriter',
  },
  {
    id: 'inter',
    name: 'Apple SD Gothic / Inter',
    family: "'Inter', -apple-system, sans-serif",
    category: 'sans',
  },
  {
    id: 'montserrat',
    name: 'Avenir Next / Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'sans',
  },
  {
    id: 'playfair',
    name: 'Bodoni / Baskerville',
    family: "'Playfair Display', serif",
    category: 'serif',
  },
  {
    id: 'oswald',
    name: 'Futura / Oswald',
    family: "'Oswald', sans-serif",
    category: 'display',
  },
  {
    id: 'space-grotesk',
    name: 'Arkhip / Space Grotesk',
    family: "'Space Grotesk', sans-serif",
    category: 'display',
  },
  {
    id: 'caveat',
    name: 'Bradley Hand / Caveat',
    family: "'Caveat', cursive",
    category: 'handwriting',
  },
  {
    id: 'pacifico',
    name: 'Chalkduster / Pacifico',
    family: "'Pacifico', cursive",
    category: 'handwriting',
  },
  {
    id: 'system-sans',
    name: 'Helvetica / Arial',
    family: "Helvetica, Arial, sans-serif",
    category: 'sans',
  },
];
