import axios, { AxiosResponse } from 'axios';
import { Table, Receipt, Food } from '../interface/interface';
import { v4 as uuidv4 } from 'uuid';
import { json } from 'stream/consumers';
import { start } from 'repl';

class DataFetcher {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  //Tables
  public async getTables(): Promise<Table[]> {
    try {
      const response: AxiosResponse = await axios.get(`${this.apiUrl}/tables`);
      return response.data;
    } catch (error) { 
      console.error(error);
      return [];
    }
  }

  public async getTableById(table_id: string): Promise<Table | undefined> {
    try {
      const response: AxiosResponse = await axios.get(`${this.apiUrl}/tables/${table_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  //Receipts

  public async getReceipts(): Promise<Receipt[]> {
    try {
      const response: AxiosResponse = await axios.get(`${this.apiUrl}/receipts`);
      return response.data;
    } catch (error) { 
      console.error(error);
      return [];
    }
  }

  public async getReceiptById(receipt_id: string): Promise<Receipt | undefined> {
    try {
      const response: AxiosResponse = await axios.get(`${this.apiUrl}/receipts/${receipt_id}`);
      return response.data
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  public async updateReceiptById(receipt_id: string, updatedOrders: string, total_price: number): Promise<string | undefined> {
    try {
      const receipt: any = {
        "food_orders": updatedOrders,
        "total_price": total_price
    }
      const response: AxiosResponse = await axios.put(`${this.apiUrl}/update/receipts/${receipt_id}`, receipt)

      console.log("Successfully updated receipt "+ receipt_id)
      return response.data
    } catch(e) {
      console.log(e)
      console.log("Failed to update receipt " + receipt_id)
      return undefined
    }
  }

  public async setTableToReserved(table_id: string): Promise<String | undefined> {
    try {
      // Create a new Receipt
      const startTime: string = new Date().toISOString(); // Current time
      const receipt: Receipt = {
        "receipt_id": uuidv4().toString(),
        "food_orders": "none",
        "total_price": "0",
        "start_time": startTime,
        "end_time": "32121",
        "table_id": table_id
    }
      const jsonReceipt = JSON.stringify(receipt);
      const receiptResponse: AxiosResponse = await axios.post(`${this.apiUrl}/create/receipt`, receipt);

      // Update the table status
      const updatedTable: any = {
        "table_id": table_id,
        "status": "0",
        "active_receipt_id": receipt.receipt_id
      };
      const response: AxiosResponse = await axios.put(`${this.apiUrl}/update/tables/${table_id}`, updatedTable);
      
      // Return success message
      return "Successfully updated and created a new receipt.";
    } catch (error) {
      console.error(error);
      return "Failed to update or create a new receipt.";
    }
  }

  public async finishTable(table_id: string, active_receipt_id: string): Promise<String | undefined>{
    try {
      // Update the table status
      const myJson: any = {
        "table_id": table_id,
        "status": "1",
        "active_receipt_id": "none"
      };
      const response: AxiosResponse = await axios.put(`${this.apiUrl}/update/tables/${table_id}`, myJson)
      
      // Create a new Receipt
      const endTime: string = new Date().toISOString(); // Current time
      const updatedReceipt: any= {
        end_time: endTime
      };
      const receiptResponse: AxiosResponse = await axios.put(`${this.apiUrl}/update/receipts/${active_receipt_id}`, updatedReceipt)
      
      // Return success message
      return "Successfully updated table status to Available!";
    } catch (error) {
      console.error(error);
      return "Failed to update table status to Available!";
    }
  }


}

export default DataFetcher;
