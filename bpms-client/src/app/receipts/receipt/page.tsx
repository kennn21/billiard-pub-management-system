"use client"; // this is a client component 👈🏽

import DataFetcher from '@/helper/DataFetcher'

import Converters from '../../../utils/Converters'

import { Table, Receipt, Food } from '../../../interface/interface'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import "bootstrap/dist/css/bootstrap.min.css" // Import bootstrap CSS

export default function ReceiptInfo(){
  const [receipt, setReceipt] = useState<Receipt>()


  const searchParams = useSearchParams()
  const router = useRouter()

  const receipt_id = searchParams.get("id")!

    const navigateToReceipts = () => {
        router.push("/receipts")
      };

      useEffect(() => {
        const fetchData = async () => {
          const dataFetcher = new DataFetcher("http://127.0.0.1:5000")
          const fetchedReceipt = await dataFetcher.getReceiptById(receipt_id)
          setReceipt(fetchedReceipt)
        };
    
        fetchData()
      }, [setReceipt])

      if(receipt){
        console.log(receipt)
        return(
            <>
                <h4 className='card-title'>{Converters.convertReceiptId(receipt.receipt_id)}</h4>
                <p className="card-text">{Converters.convertOrderedFood(receipt.food_orders)}</p>
                <p className="card-text">Table served at: {receipt.start_time}</p>
                <p className="card-text">Table left at: {receipt.end_time}</p>
                <p className="card-text">{Converters.convertPrice(receipt.total_price)}</p>
                <p className="card-text">{receipt.table_id}</p>
    
                <button className="btn-primary" onClick={navigateToReceipts}>
                Go Back
                </button>
            </>
          )
      }
}