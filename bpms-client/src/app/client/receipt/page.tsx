"use client"; // this is a client component 👈🏽

import { useEffect,useState } from "react"
import { config } from "@/app/static/config"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

import DataFetcher from "@/helper/DataFetcher"
import { Receipt } from "@/interface/interface"
import Converters from "@/utils/Converters"

//Styles
import '@/app/static/style/card.css'

export default function ReceiptInterface(){

    const [receipt, setReceipt] = useState<Receipt>()

    const router = useRouter();

    const searchParams = useSearchParams();
    const table_id = searchParams.get("id");
    const receipt_id = searchParams.get("r_id");

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js") //get Bootstrap
    
        const fetchData = async () => {
          const dataFetcher = new DataFetcher('http://127.0.0.1:5000')
          if(receipt_id) {
            const fetchedReceipt = await dataFetcher.getReceiptById(receipt_id)
            setReceipt(fetchedReceipt)
          }
        };
    
        fetchData()
      }, [])
    
    const navigateToMain = () => {
        router.push("/");
      };
    
      if(receipt){
        return(
            <>
                <div className="container d-flex p-2 justify-content-center">
                    <div className='card col-md-6 mb-4 text-center mx-3 ' key={receipt.receipt_id}>
                        <img className='card-img-top pt-3' src={config.receipt_image_url}/>
                        <div className="card-body">
                            <h4 className='card-title'>Receipt for {table_id}</h4>  
                            <p className="card-text">{receipt.food_orders}</p>
                            <p className="card-text">{receipt.start_time}</p>
                            <p className="card-text">{receipt.end_time}</p>
                            <p className="card-text">{receipt.table_id}</p>
                            <p className="card-text">{Converters.convertPrice(receipt.total_price)}</p>
                            <button className="btn btn-danger col-2 mx-auto" onClick={navigateToMain}>Back</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}