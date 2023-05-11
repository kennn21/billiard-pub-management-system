"use client"; // this is a client component 👈🏽

//Custom Classes
import DataFetcher from '@/helper/DataFetcher'
import Converters from '../utils/Converters'

import { Table, Receipt, Food } from '../interface/interface'
import { useEffect, useState } from 'react'
import { config } from './static/config'
import { useRouter } from 'next/navigation'

import 'bootstrap/dist/css/bootstrap.css';

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
  
  function GoToTableAsClient({ table_id }: { table_id: string }) {
    const handleClick = () => {
      router.push('/client/table?id='+table_id)
    }
    return (
      <a href="#" className="btn btn-primary" onClick={handleClick}>Client</a>
    )
  }

  function GoToTableAsAdmin({ table_id }: { table_id: string }) {
    const handleClick = () => {
      router.push('/admin/table?id='+table_id)
    }
    return (
      <a href="#" className="btn btn-danger" onClick={handleClick}>Admin</a>
    )
  }

  function GoToReceipts(){
    const handleClick = () => {
      router.push('/admin/receipts')
    }
    return(
      <a href="#" className="" onClick={handleClick}>-Receipts Page-</a>
    )
  }
  

  return (
    <main>
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-9 text-center">
        <br/>
          <h1>Welcome to Shelby Billiard</h1>
          <h2>Play Play Play</h2>
        </div>
      </div>
      <div className="text-center">
      <GoToReceipts/>
      </div>
      <div className='col-sm-4' ><p></p></div>
      <div className='row text-center'>
      {tables.map((table) => (
        <div className='col-sm-4 C' key={table.table_id}>
          <div className="col-md-10 col-lg-12">
          <div className="icon-box text-center">
            <br/>
            <br/>
            
            <h5 className="card-title text-center">{table.name}</h5>
            <img className="card-img-top"src={config.table_image_url}/>
            <p className="card-text center">Status: {Converters.convertStatus(table.status)}</p>
            <GoToTableAsClient table_id={table.table_id} />&nbsp;&nbsp;&nbsp;
            <GoToTableAsAdmin table_id={table.table_id} />
          </div>
        </div>
        </div>

      ))}
      </div>
    </main>
  )
}