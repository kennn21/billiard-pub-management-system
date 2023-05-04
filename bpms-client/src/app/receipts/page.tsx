"use client"; // this is a client component 👈🏽

import { Receipt} from '@/interface/interface'
import { useEffect, useState } from 'react'
import { config } from '../static/config'
import { useRouter } from 'next/navigation'

import Converters from '../../utils/Converters'
import DataFetcher from '@/helper/DataFetcher'



export default function ReceiptsPage(){

  const [receipts, setReceipts] = useState<Receipt[]>([])

  const router = useRouter()

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js") //get Bootstrap

    const fetchData = async () => {
      const dataFetcher = new DataFetcher('http://127.0.0.1:5000')
      const fetchedReceipts = await dataFetcher.getReceipts()
      setReceipts(fetchedReceipts)
    };

    fetchData()
  }, [])

  function GoToReceipt({ receipt_id }: { receipt_id: string }) {
    const router = useRouter()
    const handleClick = () => {
      router.push('/receipts/receipt?id='+receipt_id)
    }
    return (
      <a href="#" className="btn btn-primary" onClick={handleClick}>Go To Receipt</a>
    )
  }

  const navigateToMain = () => {
    router.push("/")
  };

    return(
        <>
            <main>
                <div className='row'>
                {receipts.map((receipt) => (
                    <div className='col-lg-4' key={receipt.receipt_id}>
                        <img className='card-img-top' src={config.receipt_image_url}/>
                        <div className="card-body">
                            <h4 className='card-title'>{Converters.convertReceiptId(receipt.receipt_id)}</h4>
                            <p className="card-text">{receipt.food_orders}</p>
                            <p className="card-text">{receipt.start_time}</p>
                            <p className="card-text">{receipt.end_time}</p>
                            <p className="card-text">{receipt.table_id}</p>
                            <p className="card-text">{Converters.convertPrice(receipt.total_price)}</p>
                            <GoToReceipt receipt_id={receipt.receipt_id} />
                        </div>
                    </div>
                ))}
                <button className="btn btn-primary" onClick={()=>navigateToMain()}>Main Page</button>
                </div>
            </main>
        </>
    )
}