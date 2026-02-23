"use client";

import { useInvoice } from "../app/hooks/useInvoice";
import { Header } from "./components/Header";
import { Invoice } from "./components/Invoice";

export default function Home() {
  const {
    resetInvoice,
    generateInvoice,
    invoiceNumber,
    invoiceDate,
    dueDate,
    companyInformation,
    billedBy,
    billedTo,
    items,
    subtotal,
    total,
    taxPercentage,
    discountPercentage,
    tax,
    discount,
    notes,
    setTaxPercentage,
    setDiscountPercentage,
    setTax,
    setDiscount,
    setNotes,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setcompanyInformation,
    setBilledBy,
    setBilledTo,
    addItem,
    removeItem,
    updateItem,
    recalcInvoice,
  } = useInvoice();

  return (
    <main>
      <div className="container mx-auto px-8 py-6">
        <Header 
          generateInvoice={generateInvoice}
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          companyInformation={companyInformation}
          billedBy={billedBy}
          billedTo={billedTo}
        />

        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex justify-between gap-2">
            <h1 className="text-lg"> Preview</h1>
            <button
              className="p-1 border border-gray-300 rounded-2xl shadow-md text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={resetInvoice}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
          <hr className="border-t border-gray-300 my-4"></hr>

          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="bg-white px-8 py-4 shadow-sm">
              <Invoice
                items={items}
                subtotal={subtotal}
                total={total}
                taxPercentage={taxPercentage}
                discountPercentage={discountPercentage}
                tax={tax}
                discount={discount}
                notes={notes}
                invoiceNumber={invoiceNumber}
                invoiceDate={invoiceDate}
                dueDate={dueDate}
                companyInformation={companyInformation}
                billedBy={billedBy}
                billedTo={billedTo}
                setTaxPercentage={setTaxPercentage}
                setDiscountPercentage={setDiscountPercentage}
                setTax={setTax}
                setDiscount={setDiscount}
                setNotes={setNotes}
                setInvoiceNumber={setInvoiceNumber}
                setInvoiceDate={setInvoiceDate}
                setDueDate={setDueDate}
                setcompanyInformation={setcompanyInformation}
                setBilledBy={setBilledBy}
                setBilledTo={setBilledTo}
                addItem={addItem}
                removeItem={removeItem}
                updateItem={updateItem}
                recalcInvoice={recalcInvoice}
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
