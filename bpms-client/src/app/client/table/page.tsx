"use client"; // this is a client component 👈🏽

import DataFetcher from '@/helper/DataFetcher'

import Converters from '../../../utils/Converters'

import { Table, Receipt, Food } from '../../../interface/interface'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { config } from '@/app/static/config'


export default function TableBooking() {
  const [table, setTable] = useState<Table>()
  const [receiptId, setReceiptId] = useState<string>()

  const router = useRouter();

  const searchParams = useSearchParams()
  const table_id = searchParams.get("id")!

  useEffect(() => {
    const fetchData = async () => {
      const dataFetcher = new DataFetcher("http://127.0.0.1:5000")
      const fetchedTable = await dataFetcher.getTableById(table_id)
      setTable(fetchedTable)
      setReceiptId(fetchedTable?.active_receipt_id)
    }

    fetchData()
  }, [setTable, setReceiptId, table_id])

  const navigateToMain = () => {
    router.push("/");
  };

  const orderTable = async () => {
    console.log("Ordering table...")
    const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
    if (table) {
      const res = await dataFetcher.setTableToReserved(table_id);
      console.log(res);
      setTable({
        ...table,
        status: "0",
      });

    console.log("Table ordered")

    }
    
  };

  const finishTable = async () => {
    const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
    if (table) {
      const res = await dataFetcher.finishTable(table_id, table.active_receipt_id);
      console.log(res);
      setTable({
        ...table,
        status: "1",
      });
      navigateToReceiptPage()
    }
  };

  const navigateToOrderPage = () => {
    router.push("/client/order?id=" + table_id)
  };

  const navigateToReceiptPage = () => {
    if(receiptId){
      router.push("/client/receipt?id=" + table_id + "&r_id=" + receiptId)
    } else{
      navigateToMain()
    }
  }

  if (table) {
    return (
      <>
      <br/>
      <br/>
      <div className="text-center">
        <h1>{table.name}</h1>
        <div className="text-center">
            <img className="card-img-top" style={{width: "36rem"}} src={config.table_image_url}/>
        </div>
        <h3>Table Status: {Converters.convertStatus(table.status)}</h3>
        <br/>
        {table.status === "1" && (
          <>
          <button className="btn btn-primary" onClick={orderTable}>
            Order Table
          </button>&nbsp;
          </>
        )}
        {table.status === "0" && (
          <>
            <button className="btn btn-success" onClick={finishTable}>
              Finish & Pay
            </button> &nbsp;
            <button className="btn btn-primary" onClick={navigateToOrderPage}>
              Order Food
            </button>&nbsp;
          </>
        )}
        <button className="btn btn-danger" onClick={navigateToMain}>
          Back
        </button>

        </div>


      </>
    );
  } else {
    return <></>;
  }
}
