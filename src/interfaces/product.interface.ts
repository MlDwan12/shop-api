export interface Product {
  id: string;
  name: string;
  category_id: string;
  is_active: boolean;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IProductCreate {
  name: string;
  category_id: string;
  quantity?: number;
}

export interface IProductUpdate extends Partial<IProductCreate> {
  is_active?: boolean;
  quantity?: number;
}
