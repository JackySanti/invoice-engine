"use client";

import { useEffect } from "react";
import { AmountType } from "../hooks/useInvoice";
import { HeaderInvoice } from "./invoice/HeaderInvoice";
import { BillingInformation } from "./invoice/BillingInformation";
import { Table } from "./invoice/table/Table";
import { Price } from "./invoice/Price";
import { Notes } from "./invoice/Notes";
import { InvoiceItem } from "../interfaces/InvoiceItem";
import { CompanyInformation } from "../interfaces/companyInformation";
import { BillingInfo } from "../interfaces/billingInfo";

interface Adjustment {
    value: number;
    type: AmountType;
}

interface InvoiceProps {
    items: InvoiceItem[];
    subtotal: number;
    total: number;
    taxPercentage: number;
    discountPercentage: number;
    tax: Adjustment;
    discount: Adjustment;
    notes: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    companyInformation: CompanyInformation;
    billedBy: BillingInfo;
    billedTo: BillingInfo;
    setTaxPercentage: (value: number) => void;
    setDiscountPercentage: (value: number) => void;
    setTax: (value: Adjustment) => void;
    setDiscount: (value: Adjustment) => void;
    setNotes: (value: string) => void;
    setInvoiceNumber: (value: string) => void;
    setInvoiceDate: (value: string) => void;
    setDueDate: (value: string) => void;
    setcompanyInformation: (value: CompanyInformation) => void;
    setBilledBy: (value: BillingInfo) => void;
    setBilledTo: (value: BillingInfo) => void;
    addItem: (item: InvoiceItem) => void;
    removeItem: (id: string) => void;
    updateItem: (id: string, changes: Partial<InvoiceItem>) => void;
    recalcInvoice: () => void;
}

export const Invoice = ({
    items,
    subtotal,
    total,
    taxPercentage,
    discountPercentage,
    tax,
    discount,
    notes,
    invoiceNumber,
    invoiceDate,
    dueDate,
    companyInformation,
    billedBy,
    billedTo,
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
}: InvoiceProps) => {
    useEffect(() => {
        setTaxPercentage(tax.value);
        setDiscountPercentage(discount.value);
    }, [tax, discount]);

    return (
        <>  
            <div className="grid grid-cols-2 gap-4 items-start mt-4 mb-6" id="preview-header">
                <HeaderInvoice
                    infoCompany={companyInformation}
                    setinfoCompany={setcompanyInformation}
                    invoiceNumber={invoiceNumber}
                    setInvoiceNumber={setInvoiceNumber}
                    invoiceDate={invoiceDate}
                    setInvoiceDate={setInvoiceDate}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                />
            </div>

            {/* Billing Information */}
            <div className="grid grid-cols-2 gap-4 my-8">
                <div>
                    <BillingInformation
                        title="Billed by:"
                        info={billedBy}
                        setInfo={(value) => setBilledBy({ ...billedBy, ...value })}
                    />
                </div>
                <div>
                    <BillingInformation
                        title="Billed to:"
                        info={billedTo}
                        setInfo={(value) => setBilledTo({ ...billedTo, ...value })}
                    />
                </div>
            </div>

            {/* Table of Items */}
            <div className="mb-6" id="preview-items">
                <Table
                    items={items}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    recalcInvoice={recalcInvoice}
                />
            </div>

            {/* Price Panel */}
            <div className="flex flex-row-reverse" id="preview-price">
                <Price
                    subtotal={subtotal}
                    tax={tax}
                    discount={discount}
                    total={total}
                    setTax={(value) => {
                        setTax(value);
                        recalcInvoice();
                    }}
                    setDiscount={(value) => {
                        setDiscount(value);
                        recalcInvoice();
                    }}
                />
            </div>

            {/* Notes */}
            <div className="mb-4" id="preview-footer">
                <Notes notes={notes} setNotes={setNotes} />
            </div>
        </>
    );
};