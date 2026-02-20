// Тип для форматов изображения (large, small, medium, thumbnail)
export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

// Тип для одного изображения
export type ProductImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// Основной тип товара
export type Product = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images?: ProductImage[]; // массив изображений (может отсутствовать)
  productCategory?: any;   // пока не используем, позже уточним
};

// Тип ответа от API для списка товаров
export type ProductsResponse = {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
  };
};

// Тип ответа для одного товара
export type ProductResponse = {
  data: Product;
  meta: Record<string, any>;
};