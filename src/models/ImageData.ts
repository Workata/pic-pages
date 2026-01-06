import type { Category } from "models/Category";

export interface ImageData {
  id: string;
  categories: Array<Category>;
  comment: string;
}
