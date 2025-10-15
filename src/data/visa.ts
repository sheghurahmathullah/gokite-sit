/**
 * TypeScript interfaces for Apply Visa page components
 */

export interface VisaOption {
    id: string;
    title: string;
    visaType: string;
    stayDuration: string;
    visaValidity: string;
    processingTime: string;
    originalPrice: number;
    discountedPrice: number;
    finalPrice: number;
    badge?: string;
  }
  
  export interface TimelineStep {
    id: number;
    date: string;
    title: string;
    description: string;
    icon: 'calendar' | 'document' | 'process' | 'check';
  }
  
  export interface Requirement {
    id: string;
    name: string;
    mandatory: boolean;
  }
  
  export interface FAQ {
    id: string;
    question: string;
    answer: string;
  }
  
  export type VisaTab = 'types' | 'process' | 'eligibility' | 'faq';
  