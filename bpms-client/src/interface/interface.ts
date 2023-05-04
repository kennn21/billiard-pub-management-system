export interface Table {
    table_id: string;
    name: string;
    status: string;
    active_receipt_id: string;
  }
  
export interface Receipt {
      receipt_id: string;
      food_orders: string;
      total_price: string;
      start_time: string;
      end_time: string;
      table_id: string;
  }
  
export interface Food {
  id: number;
  name: string;
  info: string;
  price: number;
  }

export interface Order {
  food: Food;
  quantity: number;
}