/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormQuestion {
  id: string;
  questionText: string;
  category: string;
  options: {
    key: string;
    text: string;
    weight: Record<string, number>; // Weights for styles: Japandi, Industrial, Boho, Rustico
  }[];
}

export interface FormAnswers {
  cozinha: string;
  cores: string;
  revestimento: string;
  iluminacao: string;
  moveis: string;
  personalidade: string;
  userName?: string;
  userEmail?: string;
}

export interface HomeStyleInfo {
  id: string;
  name: string;
  tagline: string;
  imageUrl?: string;
  description: string;
  colors: { name: string; hex: string }[];
  elements: string[];
  productFocus: string[];
}

export interface ScrapedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  store: string;
  category: "Revestimento" | "Mobiliário" | "Iluminação" | "Decoração";
  imageUrl: string;
  link: string;
  styleCompatibility: string[]; // List of matching styles e.g. ["Japandi", "Boho"]
  rating: number;
}

export interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  phone?: string;
  date: string;
  time: string;
  serviceType: string;
  styleProfile?: string;
  notes?: string;
  status: "Pendente" | "Confirmado";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
