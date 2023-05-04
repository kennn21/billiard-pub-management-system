"use client"; // this is a client component 👈🏽

import { config } from "@/app/static/config"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

export default function PaymentInterface(){

    const router = useRouter();

    const searchParams = useSearchParams();
    const table_id = searchParams.get("id")!;

    const navigateToMain = () => {
        router.push("/");
      };
    
    return(
        <>
            <h1>Payment for {table_id}</h1>
            <div className="row">
                <div className="col-md-4">
                    <img src={config.payment_image_url_gopay}/>
                </div>
                <div className="col-md-4">
                    <img src={config.payment_image_url_shopeepay}/>
                </div>
                <div className="col-md-4">
                    <img src={config.payment_image_url_ovo}/>
                </div>
            </div>
            <button className="btn btn-primary" onClick={navigateToMain}>Back</button>
        </>
    )
}