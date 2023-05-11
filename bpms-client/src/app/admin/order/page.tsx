"use client"

//Library Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

//User Defined Imports
  //Services (Class)
    import Converters from '../../../utils/Converters'
    import DataFetcher from '@/helper/DataFetcher'
    
  //Modules
    import { menu_img } from '@/app/static/menu_images';
    import { menu } from '../../static/menu';
    import { Food, Order, Table} from '../../../interface/interface'

  //style
  import '@/app/static/style/card.css'


export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [table, setTable] = useState<Table>()
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [receipt, setReceipt] = useState<any>()

  //Gets Table ID From URL
  const searchParams = useSearchParams()
  const router = useRouter()
  const table_id = searchParams.get("id")!

  //Gets Table Data From DB
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

  //Saves Order everytime the order changes
  useEffect(() => {
    handleSaveOrder()
  }, [orders])

//region Order Item Management
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
//endregion

//region Database Methods
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
//endregion

//region Navigations
const navigateToTable = () => {
  router.push('/admin/table?id='+table_id)
};

const handleSaveOrder = () => {
  const totalPrice = orders.reduce((total, order) => {
    return total + order.food.price * order.quantity
  }, 0);
  setTotalPrice(totalPrice)
  saveOrder(totalPrice)
}
//endregion

  return (
    <div className="container">
  <div className="row justify-content-center mb-4">
    <div className="col-md-8 text-center">
      <h2 className="mb-4">Food Menu</h2>
      <ToastContainer />
    </div>
  </div>
  <div className='row'>
    {menu.map((food, index) => (
      <div className='col-md-3 mb-4' key={food.id}>
        <div className='card mx-auto'>
          <img className='card-img-top' src={menu_img[index].img}/>
          <div className='card-body'>
            <h5 className='card-title'>{food.name}</h5>
            <p className='card-text'>{Converters.convertPrice(food.price.toFixed(2))}</p>
            <div className="d-flex justify-content-center">
              <button className="btn btn-danger me-3" onClick={() => handleRemoveFromOrder(food, 1)}>-</button>
              <button className="btn btn-primary" onClick={() => handleAddToOrder(food, 1)}>+</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="row justify-content-center mt-4">
    <div className="col-md-8 text-center">
      <h2>Orders</h2>
      <ul className="list-group">
        {orders.map((order, index) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
            <span>{order.food.name}</span>
            <span className="badge bg-primary rounded-pill">x {order.quantity}</span>
          </li>
        ))}
      </ul>
      <h4 className="mt-4 mb-0 fw-bold">
        Total Price: {Converters.convertPrice(totalPrice)}
      </h4>
      <button className="btn btn-primary mt-4" onClick={()=>navigateToTable()}>Back</button>
    </div>
  </div>
</div>
  );
}  