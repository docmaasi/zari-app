export interface ChatTheme {
  id: string;
  name: string;
  description: string;
  free: boolean;
  matrixColor: string;
  matrixOpacity: number;
  matrixSpeed: number;
  bgClass: string;
  fontClass: string;
}

export const chatThemes: ChatTheme[] = [
  {
    id: "matrix-purple",
    name: "Neon Matrix",
    description: "Purple rain with falling code",
    free: true,
    matrixColor: "#7c5cfc",
    matrixOpacity: 0.06,
    matrixSpeed: 1,
    bgClass: "bg-[#06060e]",
    fontClass: "font-mono",
  },
  {
    id: "matrix-green",
    name: "Classic Matrix",
    description: "The original green cascade",
    free: false,
    matrixColor: "#00ff41",
    matrixOpacity: 0.07,
    matrixSpeed: 1.2,
    bgClass: "bg-[#0a0a0a]",
    fontClass: "font-mono",
  },
  {
    id: "matrix-pink",
    name: "Pink Cyber",
    description: "Hot pink digital rain",
    free: false,
    matrixColor: "#e855a0",
    matrixOpacity: 0.06,
    matrixSpeed: 0.8,
    bgClass: "bg-[#0e060a]",
    fontClass: "font-mono",
  },
  {
    id: "matrix-blue",
    name: "Ocean Code",
    description: "Deep blue data streams",
    free: false,
    matrixColor: "#38b2ff",
    matrixOpacity: 0.06,
    matrixSpeed: 0.9,
    bgClass: "bg-[#060a0e]",
    fontClass: "font-mono",
  },
  {
    id: "matrix-gold",
    name: "Golden Circuit",
    description: "Warm amber glow",
    free: false,
    matrixColor: "#f59e0b",
    matrixOpacity: 0.05,
    matrixSpeed: 0.7,
    bgClass: "bg-[#0e0a06]",
    fontClass: "font-mono",
  },
  {
    id: "matrix-red",
    name: "Red Pill",
    description: "You chose the red pill",
    free: false,
    matrixColor: "#ef4444",
    matrixOpacity: 0.06,
    matrixSpeed: 1.3,
    bgClass: "bg-[#0e0606]",
    fontClass: "font-mono",
  },
];

export function getTheme(id: string): ChatTheme {
  return chatThemes.find((t) => t.id === id) || chatThemes[0];
}
