"use client"; // this is a client component 👈🏽

//Library Imports

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import '@/app/static/style/card.css'
import 'bootstrap/dist/css/bootstrap.css'

//User Defined Dependencies
  //Services (Class)
    import DataFetcher from '@/helper/DataFetcher'
    import Converters from '@/utils/Converters'
  //Modules
    import { Receipt, Order } from '../../../../interface/interface'
    import { menu } from '@/app/static/menu'
    import { config } from '@/app/static/config';

export default function ReceiptInfo(){
  const [receipt, setReceipt] = useState<Receipt>()
  const [orders, setOrders] = useState<Order[]>([])


  const searchParams = useSearchParams()
  const router = useRouter()

  const receipt_id = searchParams.get("id")!

    const navigateToReceipts = () => {
        router.push("/admin/receipts")
      };

      useEffect(() => {
        const fetchData = async () => {
          const dataFetcher = new DataFetcher("http://127.0.0.1:5000")
          const fetchedReceipt = await dataFetcher.getReceiptById(receipt_id)
          setReceipt(fetchedReceipt)
        };
    
        fetchData()
        if(receipt){
          handleLoadOrder(receipt.food_orders)
        }
      }, [setReceipt])

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

      if(receipt){

        //load Order
        return(
            <>
              <div className='card col-lg-4' key={receipt.receipt_id}>
                <img className='card-img-top' src={config.receipt_image_url}/>
                <div className="card-body">
                <h4 className='card-title'>{Converters.convertReceiptId(receipt.receipt_id)}</h4>
                <p className="card-text">{receipt.receipt_id}</p>

                <h2>Orders</h2>
                <ul>
                  {orders.map((order, index) => (
                    <li key={index}>
                      <span>{order.food.name}</span>
                      <span> x {order.quantity}</span>
                    </li>
                  ))}
                </ul>
                
                <p className="card-text"><b>Table served at: </b>{receipt.start_time}</p>
                <p className="card-text"><b>Table left at:</b> {receipt.end_time}</p>
                <p className="card-text"><b>Total Price: </b>{Converters.convertPrice(receipt.total_price)}</p>
                <p className="card-text"><b>Table: </b>{receipt.table_id}</p>
  
                </div>
              </div>
              <button className="btn btn-primary mx-auto" onClick={navigateToReceipts}>
                Go Back
              </button>

            </>
          )
      }
}