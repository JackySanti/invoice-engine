"use client";

import { useState, useEffect } from "react";
import { RowItem } from "./RowItem";
import { InvoiceItem } from "../../../interfaces/InvoiceItem";

interface Props {
  items: InvoiceItem[];
  addItem: (item: InvoiceItem) => void;
  updateItem: (id: string, changes: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  recalcInvoice: () => void;
}

export const Table = ({ items, addItem, updateItem, removeItem, recalcInvoice }: Props) => {
  const [isService, setIsService] = useState(false);
  const [showServiceSwitch, setShowServiceSwitch] = useState(false);

  const [serviceToggleRequested, setServiceToggleRequested] = useState(false);

  const handleAddRow = () => {
    if (items.length >= 10) {
      alert("You cannot add more than 10 items.");
      return;
    }

    const newItem: InvoiceItem = {
      id: String(items.length + 1).padStart(2, "0"),
      description: "",
      quantity: 1,
      price: 0,
      type: isService ? "Service" : "Product",
    };

    try {
      addItem(newItem);
      recalcInvoice();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateItem = (id: string, changes: Partial<InvoiceItem>) => {
    updateItem(id, changes);
    recalcInvoice();
  };

  const toggleServiceSwitch = () => {
    setIsService((prev) => !prev);
    setServiceToggleRequested(true);
  };

  useEffect(() => {
    if (!serviceToggleRequested) return;

    items.forEach((item) => {
      updateItem(item.id, { type: isService ? "Service" : "Product" });
    });

    recalcInvoice();
    setServiceToggleRequested(false);
  }, [serviceToggleRequested, isService, items, updateItem, recalcInvoice]);

  return (
    <div className="relative">
      <table className="w-full">
        <thead className="bg-gray-700 h-8">
          <tr className="text-white">
            <th className="text-[.9rem] font-medium">ID</th>
            <th className="text-[.9rem] font-medium">Description</th>
            <th className="text-[.9rem] font-medium">
              <div className="flex items-center justify-center gap-2 relative">
                {isService ? "Hours" : "Quantity"}

                <button onClick={() => setShowServiceSwitch((prev) => !prev)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                  </svg>
                </button>

                {showServiceSwitch && (
                  <div className="absolute top-full left-0 mt-2 bg-white text-gray-700 p-2 border border-gray-100 rounded-xl shadow-sm z-10 flex flex-col gap-2 w-80">
                    <div className="grid gap-2">
                      <div>
                        <div className="flex justify-end">
                          <button className="text-gray-500 hover:text-red-800 font-bold text-sm"
                            onClick={() => setShowServiceSwitch(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <span>Are you a service based company?</span>
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <p>Product</p>
                        <button
                          className={`mx-2 relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${isService ? "bg-blue-500" : "bg-gray-300"}`
                          }
                          role="switch"
                          aria-checked={isService}
                          onClick={toggleServiceSwitch}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform bg-white rounded-full transition-transform ${isService ? "translate-x-4" : "translate-x-1"
                              }`}
                          ></span>
                        </button>
                        <p>Service</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </th>
            <th className="text-[.9rem] font-medium">{isService ? "Rate" : "Price"}</th>
            <th className="text-[.9rem] font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <RowItem
              key={item.id}
              item={item}
              updateItem={handleUpdateItem}
              removeItem={removeItem}
              recalcInvoice={recalcInvoice}
            />
          ))}
        </tbody>
      </table>

      <hr className="border-t border-gray-300 my-1" />

      <div className="w-full flex justify-end mt-2">
        <button className="flex items-center justify-center gap-2 p-1 font-small text-sm text-gray-500 hover:text-gray-700"
          onClick={handleAddRow} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add More</span>
        </button>
      </div>
    </div>
  );
};