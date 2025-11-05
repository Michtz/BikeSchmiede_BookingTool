export interface OrderData {
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    product?: {
      name: string;
      _id: string;
    };
  }>;
  customerInfo?: {
    guestInfo?: {
      email: string;
      firstName: string;
      lastName: string;
    };
    selectedAddress?: {
      street: string;
      houseNumber: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
  paidAt: string;
}
