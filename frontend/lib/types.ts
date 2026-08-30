export interface Chef {
  chef_id: string;
  name: string;
  specialty: string;
  bio?: string;
  status: "pending" | "active" | "blocked";
  rating_avg: number;
  image_url?: string;
}

export interface MenuItem {
  menu_item_id: number;
  chef_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
}

export interface OrderItem {
  menu_item_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  order_id: number;
  customer_id: string;
  chef_id: string;
  status: "Pending" | "Accepted" | "Preparing" | "On the Way" | "Delivered" | "Cancelled";
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  placed_at: string;
  items: OrderItem[];
}
