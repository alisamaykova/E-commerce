export type CartItemImage = {
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
  };
};

export type CartItem = {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    images?: CartItemImage[];
  };
  quantity: number;
};
