export type RentalStatus =
  | 'unstarted' 
  | 'active'    
  | 'expired';  

export interface Rental {
  id: string;
  userId: string;
  titleId: string;
  titleName?: string;
  amountCents: number;
  currency: string;
  purchasedAt: string; 
  firstPlayAt: string | null; 
  availabilityDays: number; 
  playbackHours: number; 
}