"use client"

//Library Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from 'next/navigation'

//User Defined Imports
  //Classes
    import Converters from '../../utils/Converters'
    import DataFetcher from '@/helper/DataFetcher'
    
  //Modules
    import { menu } from './menu';
    import { Food, Order, Table, Receipt } from '../../interface/interface'


export default function FoodMenu() {
  const [orders, setOrders] = useState<Order[]>([])
  const [table, setTable] = useState<Table>()
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [receipt, setReceipt] = useState<any>()

  const searchParams = useSearchParams()
  const router = useRouter()
  const table_id = searchParams.get("id")!

  useEffect(() => {
    const fetchData = async () => {
      const dataFetcher = new DataFetcher("http://127.0.0.1:5000");

      const fetchedTable = await dataFetcher.getTableById(table_id);
      setTable(fetchedTable);

      if (fetchedTable && fetchedTable.active_receipt_id) {
        const fetchedReceipt = await dataFetcher.getReceiptById(fetchedTable.active_receipt_id);
        setReceipt(fetchedReceipt);
        if (fetchedReceipt && fetchedReceipt.food_orders && fetchedReceipt.food_orders != "none") {
          handleLoadOrder(fetchedReceipt.food_orders);
        }
      }
    };

    fetchData()
  }, [table_id])

  useEffect(() => {
    handleSaveOrder()
  }, [orders])

  const handleAddToOrder = (food: Food, quantity: number) => {
    const existingOrder = orders.find((order) => order.food.id === food.id);
    if (existingOrder) {
      const updatedOrder = { ...existingOrder, quantity: existingOrder.quantity + quantity };
      const newOrders = orders.map((order) => (order.food.id === food.id ? updatedOrder : order));
      setOrders(newOrders);
    } else {
      const newOrder = { food, quantity };
      setOrders([...orders, newOrder]);
    }
  };

  const handleRemoveFromOrder = (food: Food, quantity: number) => {
    const existingOrder = orders.find((order) => order.food.id === food.id);
    if (existingOrder) {
      const updatedOrder = { ...existingOrder, quantity: existingOrder.quantity - quantity };
      if (updatedOrder.quantity <= 0) {
        const newOrders = orders.filter((order) => order.food.id !== food.id);
        setOrders(newOrders);
      } else {
        const newOrders = orders.map((order) => (order.food.id === food.id ? updatedOrder : order));
        setOrders(newOrders);
      }
    }
  }

  const saveOrder = async (totalPrice: number) => {
    if (receipt) {
      const orderString = orders.map((order) => `${order.food.id}/${order.quantity}`).join(',');
      const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
      await dataFetcher.updateReceiptById(receipt.receipt_id, orderString, totalPrice);
    } else {
      console.error('Receipt is undefined');
    }
  }
  

const handleLoadOrder = (orderString: string) => {
  const newOrders = orderString
    .split(',')
    .map((orderString) => {
      const [foodId, quantityString] = orderString.split('/');
      const food = menu.find((food) => food.id === parseInt(foodId));
      const quantity = parseInt(quantityString);
      if (!food) {
        console.error(`Invalid food ID in order: ${foodId}`);
        throw new Error(`Invalid food ID in order: ${foodId}`);
      }
      return { food, quantity };
    });
  setOrders(newOrders);
}

//Navigations
const navigateToTable = () => {
  router.push('/table?id='+table_id)
};

const handleSaveOrder = () => {
  const totalPrice = orders.reduce((total, order) => {
    return total + order.food.price * order.quantity
  }, 0);
  setTotalPrice(totalPrice)
  saveOrder(totalPrice)
}


  return (
    <div>
      <h2>Food Menu</h2>
      <ul>
        {menu.map((food) => (
          <li key={food.id}>
            <span>{food.name}</span>
            <span> | {Converters.convertPrice(food.price.toFixed(2))}</span>
            <button onClick={() => handleRemoveFromOrder(food, 1)}>-</button>
            <button onClick={() => handleAddToOrder(food, 1)}>+</button>
          </li>
        ))}
      </ul>
      <h2>Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <span>{order.food.name}</span>
            <span> x {order.quantity}</span>
          </li>
        ))}
      </ul>
      <h4>Total Price: {Converters.convertPrice(totalPrice)}</h4>
      <button className="btn btn-primary" onClick={()=>navigateToTable()}>Back</button>
    </div>
  );
}  