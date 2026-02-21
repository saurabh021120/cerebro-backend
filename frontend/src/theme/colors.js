/**
 * Cerebro Color Palette
 * Complete theme colors used throughout the application
 */

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#6366F1',
    rgb: 'rgb(99, 102, 241)',
    hsl: 'hsl(239, 84%, 67%)',
    foreground: '#FFFFFF',
  },

  // Background Colors
  background: {
    DEFAULT: '#05080F',
    rgb: 'rgb(5, 8, 15)',
    hsl: 'hsl(222, 47%, 4%)',
  },

  card: {
    DEFAULT: '#090E1A',
    rgb: 'rgb(9, 14, 26)',
    hsl: 'hsl(222, 47%, 7%)',
    foreground: '#F8FAFC',
  },

  foreground: {
    DEFAULT: '#F8FAFC',
    rgb: 'rgb(248, 250, 252)',
    hsl: 'hsl(210, 40%, 98%)',
  },

  // Secondary & Accent Colors
  secondary: {
    DEFAULT: '#1D263A',
    rgb: 'rgb(29, 38, 58)',
    hsl: 'hsl(217, 33%, 17%)',
    foreground: '#F8FAFC',
  },

  accent: {
    DEFAULT: '#8B5CF6',
    rgb: 'rgb(139, 92, 246)',
    hsl: 'hsl(263, 70%, 66%)',
    foreground: '#FFFFFF',
  },

  muted: {
    DEFAULT: '#1D263A',
    rgb: 'rgb(29, 38, 58)',
    hsl: 'hsl(217, 33%, 17%)',
    foreground: '#98A2B3',
  },

  // Utility Colors
  destructive: {
    DEFAULT: '#EF4444',
    rgb: 'rgb(239, 68, 68)',
    hsl: 'hsl(0, 84%, 60%)',
    foreground: '#FFFFFF',
  },

  border: {
    DEFAULT: '#1D263A',
    rgb: 'rgb(29, 38, 58)',
    hsl: 'hsl(217, 33%, 17%)',
  },

  input: {
    DEFAULT: '#1D263A',
    rgb: 'rgb(29, 38, 58)',
    hsl: 'hsl(217, 33%, 17%)',
  },

  ring: {
    DEFAULT: '#6366F1',
    rgb: 'rgb(99, 102, 241)',
    hsl: 'hsl(239, 84%, 67%)',
  },

  // Chart Colors
  chart: {
    1: '#6366F1',
    2: '#8B5CF6',
    3: '#2A9D8F',
    4: '#E9C46A',
    5: '#F4A261',
  },

  // Gradient Colors
  gradients: {
    text: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    primary: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    purple: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    hero: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(2, 6, 23, 0) 70%)',
  },

  // Glass Effect Colors
  glass: {
    background: 'rgba(15, 23, 42, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(99, 102, 241, 0.5)',
  },

  // Glow Effects
  glow: {
    primary: 'rgba(99, 102, 241, 0.5)',
    primaryHover: 'rgba(99, 102, 241, 0.7)',
    hero: 'rgba(99, 102, 241, 0.15)',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Difficulty Colors
  difficulty: {
    beginner: {
      bg: 'rgba(34, 197, 94, 0.2)',
      text: '#4ADE80',
    },
    intermediate: {
      bg: 'rgba(234, 179, 8, 0.2)',
      text: '#FACC15',
    },
    advanced: {
      bg: 'rgba(239, 68, 68, 0.2)',
      text: '#F87171',
    },
  },

  // Feature Gradients (for carousel)
  featureGradients: {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    yellow: 'from-yellow-500 to-orange-500',
    indigo: 'from-indigo-500 to-purple-500',
  },
};

// CSS Variables (for use in inline styles)
export const cssVariables = {
  '--background': '222 47% 4%',
  '--foreground': '210 40% 98%',
  '--card': '222 47% 7%',
  '--card-foreground': '210 40% 98%',
  '--popover': '222 47% 7%',
  '--popover-foreground': '210 40% 98%',
  '--primary': '239 84% 67%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '217 33% 17%',
  '--secondary-foreground': '210 40% 98%',
  '--muted': '217 33% 17%',
  '--muted-foreground': '215 20% 65%',
  '--accent': '263 70% 66%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '217 33% 17%',
  '--input': '217 33% 17%',
  '--ring': '239 84% 67%',
  '--radius': '0.75rem',
};

// Helper function to get color with opacity
export const withOpacity = (color, opacity) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper function to convert HSL to RGB
export const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ];
};

export default colors;
