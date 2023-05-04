"use client"; // this is a client component 👈🏽

//Custom Classes
import DataFetcher from '@/helper/DataFetcher'
import Converters from '../utils/Converters'

import { Table, Receipt, Food } from '../interface/interface'
import { useEffect, useState } from 'react'
import { config } from './static/config'
import { useRouter } from 'next/navigation'

import "bootstrap/dist/css/bootstrap.min.css" // Import bootstrap CSS
import './globals.css'

export default function Home() {
  const [tables, SetTables] = useState<Table[]>([])

  const router = useRouter()

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js") //get Bootstrap

    const fetchData = async () => {
      const dataFetcher = new DataFetcher('http://127.0.0.1:5000')
      const fetchedTables = await dataFetcher.getTables();
      SetTables(fetchedTables);
    };

    fetchData()
  }, [])
  
  function GoToTable({ table_id }: { table_id: string }) {
    const handleClick = () => {
      router.push('/table?id='+table_id)
    }
    return (
      <a href="#" className="btn btn-primary" onClick={handleClick}>Go To Table</a>
    )
  }

  function GoToReceipts(){
    const handleClick = () => {
      router.push('/receipts')
    }
    return(
      <a href="#" className="btn btn-primary" onClick={handleClick}>Receipts Page</a>
    )
  }
  

  return (
    <main>
      <div className='row'>
      {tables.map((table) => (
        <div className='col-sm-4' key={table.table_id}>
          <img className='card-img-top' src={config.table_image_url}/>
          <div className="card-body">
            <h5 className="card-title">{table.name}</h5>
            <p className="card-text">Status: {Converters.convertStatus(table.status)}</p>
            <GoToTable table_id={table.table_id} />
          </div>
        </div>
      ))}
      <GoToReceipts/>
      </div>
    </main>
  )
}