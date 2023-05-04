"use client"; // this is a client component 👈🏽

import DataFetcher from '@/helper/DataFetcher'

import Converters from '../../utils/Converters'

import { Table, Receipt, Food } from '../../interface/interface'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import "bootstrap/dist/css/bootstrap.min.css" // Import bootstrap CSS
import '../globals.css'


export default function TableInfo() {
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
    router.push("/order?id=" + table_id);
  };

  if (table) {
    return (
      <>
        <h1>Table {table.name}</h1>
        <h3>Table Status: {Converters.convertStatus(table.status)}</h3>
        {table.status === "1" && (
          <button className="btn-primary" onClick={orderTable}>
            Order Table
          </button>
        )}
        {table.status === "0" && (
          <>
            <button className="btn-primary" onClick={finishTable}>
              Finish Table
            </button>
            <button className="btn-primary" onClick={navigateToOrderPage}>
              Order Food
            </button>
          </>
        )}
        <button className="btn-primary" onClick={navigateToMain}>
          Back
        </button>


      </>
    );
  } else {
    return <></>;
  }
}
