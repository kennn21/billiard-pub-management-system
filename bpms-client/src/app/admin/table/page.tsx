"use client"; // this is a client component 👈🏽

import DataFetcher from '@/helper/DataFetcher'

import Converters from '../../../utils/Converters'

import { Table, Receipt, Food } from '../../../interface/interface'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { config } from '@/app/static/config';



export default function TableManager() {
  const [table, SetTable] = useState<Table>();

  const router = useRouter();

  const searchParams = useSearchParams();
  const table_id = searchParams.get("id")!;

  useEffect(() => {
    const fetchData = async () => {
      const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
      const fetchedTable = await dataFetcher.getTableById(table_id);
      SetTable(fetchedTable);
    };

    fetchData();
  }, [SetTable]);

  const navigateToMain = () => {
    router.push("/");
  };

  const orderTable = async () => {
    const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
    if (table) {
      const res = await dataFetcher.setTableToReserved(table_id);
      console.log(res);
      SetTable({
        ...table,
        status: "0",
      });
    }
  };

  const finishTable = async () => {
    const dataFetcher = new DataFetcher("http://127.0.0.1:5000");
    if (table) {
      const res = await dataFetcher.finishTable(table_id, table.active_receipt_id);
      console.log(res);
      SetTable({
        ...table,
        status: "1",
      });
    }
  };

  const navigateToOrderPage = () => {
    router.push(`/admin/order?id=${table_id}`);
  };

  if (table) {
    return (
      <>
      <div className='text-center'>
        <h1>{table.name}</h1>
        <div className="text-center">
            <img className="card-img-top" style={{width: "36rem"}} src={config.table_image_url}/>
        </div>
        <h3>Table Status: {Converters.convertStatus(table.status)}</h3>
        {table.status === "1" && (
          <>
          <button className="btn btn-primary" onClick={orderTable}>
            Reserve table
          </button>&nbsp;
          </>
        )}
        {table.status === "0" && (
          <>
            <button className="btn btn-success" onClick={finishTable}>
              Finish Table
            </button> &nbsp;
            <button className="btn btn-primary" onClick={navigateToOrderPage}>
              Food orders
            </button> &nbsp;
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
