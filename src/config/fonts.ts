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
    id: 'apple-sd',
    name: 'Apple SD Gothic Neo',
    family: "'Inter', -apple-system, sans-serif",
    category: 'sans',
  },
  {
    id: 'poppins',
    name: 'Arial Rounded / Poppins',
    family: "'Poppins', sans-serif",
    category: 'sans',
  },
  {
    id: 'system-sans',
    name: 'Arial / Helvetica',
    family: "Arial, Helvetica, sans-serif",
    category: 'sans',
  },
  {
    id: 'space-grotesk',
    name: 'Arkhip / Space Grotesk',
    family: "'Space Grotesk', sans-serif",
    category: 'display',
  },
  {
    id: 'cormorant',
    name: 'Audrey / Cormorant',
    family: "'Cormorant Garamond', serif",
    category: 'serif',
  },
  {
    id: 'montserrat',
    name: 'Avenir Next / Montserrat',
    family: "'Montserrat', sans-serif",
    category: 'sans',
  },
  {
    id: 'playfair',
    name: 'Baskerville / Playfair',
    family: "'Playfair Display', serif",
    category: 'serif',
  },
  {
    id: 'abril',
    name: 'Bodoni / Abril Fatface',
    family: "'Abril Fatface', serif",
    category: 'serif',
  },
  {
    id: 'dancing',
    name: 'Bradley Hand / Dancing Script',
    family: "'Dancing Script', cursive",
    category: 'handwriting',
  },
  {
    id: 'caveat',
    name: 'Caveat Handwritten',
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
    id: 'marker',
    name: 'Marker Felt / Permanent Marker',
    family: "'Permanent Marker', cursive",
    category: 'handwriting',
  },
  {
    id: 'syne',
    name: 'Didot / Syne Bold',
    family: "'Syne', sans-serif",
    category: 'display',
  },
  {
    id: 'oswald',
    name: 'Futura / Oswald',
    family: "'Oswald', sans-serif",
    category: 'display',
  },
  {
    id: 'bangers',
    name: 'Gagalin / Bangers',
    family: "'Bangers', cursive",
    category: 'display',
  },
];
