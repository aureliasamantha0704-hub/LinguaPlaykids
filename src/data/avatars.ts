import { AvatarShopItem } from '../types';

export interface MascotOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
}

export const MASCOTS: MascotOption[] = [
  {
    id: 'lion',
    name: 'Leo the Lion',
    emoji: '🦁',
    color: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    description: 'Brave and cheerful language explorer!',
  },
  {
    id: 'panda',
    name: 'Mianmian the Panda',
    emoji: '🐼',
    color: '#10b981',
    bgGradient: 'from-emerald-400 to-teal-600',
    description: 'Loves eating bamboo and practicing Mandarin!',
  },
  {
    id: 'dragon',
    name: 'Sparky the Dragon',
    emoji: '🐲',
    color: '#ef4444',
    bgGradient: 'from-red-400 to-rose-600',
    description: 'Magical dragon with endless energy for learning!',
  },
  {
    id: 'bunny',
    name: 'Bella the Bunny',
    emoji: '🐰',
    color: '#ec4899',
    bgGradient: 'from-pink-400 to-purple-500',
    description: 'Hops around Word Forest finding sweet words!',
  },
  {
    id: 'penguin',
    name: 'Pippin the Penguin',
    emoji: '🐧',
    color: '#06b6d4',
    bgGradient: 'from-cyan-400 to-blue-600',
    description: 'Cool penguin traveler who loves quizzes!',
  },
];

export const SHOP_HATS: AvatarShopItem[] = [
  {
    id: 'none',
    name: 'Natural Look',
    type: 'hat',
    price: 0,
    icon: '✨',
  },
  {
    id: 'crown',
    name: 'Golden Crown',
    type: 'hat',
    price: 30,
    icon: '👑',
  },
  {
    id: 'wizard',
    name: 'Wizard Hat',
    type: 'hat',
    price: 50,
    icon: '🧙‍♂️',
  },
  {
    id: 'party',
    name: 'Party Hat',
    type: 'hat',
    price: 20,
    icon: '🥳',
  },
  {
    id: 'headphones',
    name: 'Cool Headphones',
    type: 'hat',
    price: 40,
    icon: '🎧',
  },
  {
    id: 'glasses',
    name: 'Smart Glasses',
    type: 'hat',
    price: 25,
    icon: '👓',
  },
  {
    id: 'flower',
    name: 'Flower Clip',
    type: 'hat',
    price: 15,
    icon: '🌸',
  },
  {
    id: 'dino',
    name: 'Dino Hood',
    type: 'hat',
    price: 60,
    icon: '🦖',
  },
];

export const SHOP_BACKGROUNDS: AvatarShopItem[] = [
  {
    id: 'bg_default',
    name: 'Sunshine Meadow',
    type: 'background',
    price: 0,
    icon: '🌈',
    previewClass: 'from-amber-100 to-orange-200',
  },
  {
    id: 'bg_space',
    name: 'Galactic Space',
    type: 'background',
    price: 45,
    icon: '🌌',
    previewClass: 'from-indigo-900 to-purple-950',
  },
  {
    id: 'bg_candy',
    name: 'Candy Land',
    type: 'background',
    price: 35,
    icon: '🍭',
    previewClass: 'from-pink-200 to-rose-300',
  },
  {
    id: 'bg_underwater',
    name: 'Ocean Reef',
    type: 'background',
    price: 50,
    icon: '🐠',
    previewClass: 'from-cyan-300 to-blue-600',
  },
];
