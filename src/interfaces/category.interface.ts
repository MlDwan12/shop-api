export interface Category {
  id: string;
  name: string;
  parent_id?: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  children?: Category[];
  product_count?: number;
}

export interface ICategoryCreate {
  name: string;
  parent_id?: string;
}

export interface ICategoryUpdate extends Partial<ICategoryCreate> {
  is_active?: boolean;
}
