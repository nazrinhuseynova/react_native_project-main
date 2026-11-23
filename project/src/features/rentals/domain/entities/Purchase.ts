export interface Purchase {
  id: string;
  userId: string;
  titleId: string;
  titleName?: string;
  amountCents: number;
  currency: string;
  purchasedAt: string; 
}