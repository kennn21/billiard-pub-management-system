export default class Converters {
    static convertStatus(status: string): string {
      return status === "0" ? "unavailable" : "available"
    }

    static convertOrderedFood(ordered_food:string): string {
      return ordered_food === "ordered_food" ? "No food ordered" : ordered_food
    }

    static convertReceiptId(receipt_id:string): string {
      return `Receipt ${receipt_id.substring(0,5)}`
    }

    static convertPrice(price: number | string): string {
      return `Rp ${price}`
    }
  }