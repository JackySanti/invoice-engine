"use client";

import { useState, useEffect } from "react";
import { InvoiceItem, ItemType } from "@/app/interfaces/InvoiceItem";
import { postRequest } from "../api/axios.api";
import { CompanyInformation } from "@/app/interfaces/companyInformation";
import { BillingInfo } from "../../app/interfaces/billingInfo";

export enum AmountType {
    Money = "Money",
    Percent = "Percent",
}

interface Adjustment {
    value: number;
    type: AmountType;
}

export function useInvoice() {
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: "01", description: "", quantity: 0, price: 0, type: "Product" },
    ]);

    const [taxPercentage, setTaxPercentage] = useState<number>(0);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);

    const [tax, setTax] = useState<Adjustment>({ value: 0, type: AmountType.Percent });
    const [discount, setDiscount] = useState<Adjustment>({ value: 0, type: AmountType.Percent });

    const [notes, setNotes] = useState<string>("");
    const [invoiceType, setInvoiceType] = useState<ItemType | null>("Product");

    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const initialInvoiceState = {
        items: [{ id: "01", description: "", quantity: 0, price: 0, type: "Product" as ItemType }],
        taxPercentage: 0,
        discountPercentage: 0,
        tax: { value: 0, type: AmountType.Percent },
        discount: { value: 0, type: AmountType.Percent },
        notes: "",
        invoiceType: "Product" as ItemType | null,
        subtotal: 0,
        total: 0,
        companyInformation: { website: "", email: "", logo: "" },
        billedBy: { company: '', firstName: '', lastName: '', phoneNumber: '', address: '', cityStateZip: '', country: '' },
        billedTo: { company: '', firstName: '', lastName: '', phoneNumber: '', address: '', cityStateZip: '', country: '' },
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: ""
    };

    const [companyInformation, setcompanyInformation] = useState<CompanyInformation>({
        website: "",
        email: "",
        logo: ""
    });

    const [billedBy, setBilledBy] = useState<BillingInfo>({
        company: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        cityStateZip: '',
        country: '',
    });

    const [billedTo, setBilledTo] = useState<BillingInfo>({
        company: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        cityStateZip: '',
        country: '',
    });

    const [invoiceNumber, setInvoiceNumber] = useState<string>("");
    const [invoiceDate, setInvoiceDate] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");

    const MAX_ITEMS = 10;

    function addItem(item: InvoiceItem) {
        if (items.length >= MAX_ITEMS) {
            alert(`Cannot add more than ${MAX_ITEMS} items.`);
            return;
        }

        if (invoiceType && invoiceType !== item.type) {
            alert("Cannot mix PRODUCT and SERVICE in the same invoice.");
            return;
        }

        if (!invoiceType) {
            setInvoiceType(item.type);
        }

        setItems(prev => [...prev, item]);
    }

    function removeItem(id: string) {
        const updated = items.filter(item => item.id !== id);
        setItems(updated);

        if (updated.length === 0) {
            setInvoiceType("Product");
            setTaxPercentage(0);
            setDiscountPercentage(0);
            setTax({ value: 0, type: AmountType.Percent });
            setDiscount({ value: 0, type: AmountType.Percent });
            setItems([{ id: "01", description: "", quantity: 0, price: 0, type: "Product" }]);
        }
    }

    function updateItem(id: string, changes: Partial<InvoiceItem>) {
        setItems(prev =>
            prev.map(item => (item.id === id ? { ...item, ...changes } : item))
        );
    }

    function resetInvoice() {
        setItems(initialInvoiceState.items);
        setTaxPercentage(initialInvoiceState.taxPercentage);
        setDiscountPercentage(initialInvoiceState.discountPercentage);
        setTax(initialInvoiceState.tax);
        setDiscount(initialInvoiceState.discount);
        setNotes(initialInvoiceState.notes);
        setInvoiceType(initialInvoiceState.invoiceType);
        setSubtotal(initialInvoiceState.subtotal);
        setTotal(initialInvoiceState.total);
        setcompanyInformation(initialInvoiceState.companyInformation);
        setBilledBy(initialInvoiceState.billedBy);
        setBilledTo(initialInvoiceState.billedTo);
        setInvoiceNumber(initialInvoiceState.invoiceNumber);
        setInvoiceDate(initialInvoiceState.invoiceDate);
        setDueDate(initialInvoiceState.dueDate);
    }

    async function recalcInvoice() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

            const response = await postRequest(`${apiUrl}api/v1/invoice/calculation-summary`, {
                items: items.map(item => ({
                    itemNumber: item.id,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    type: item.type,
                })),
                totals: {
                    tax: tax.value,
                    type_tax: tax.type,
                    discount: discount.value,
                    type_discount: discount.type,
                },
            });

            setSubtotal(response.subtotal);
            setTotal(response.total);
        } catch (error) {
            console.error("Failed to invoice calculation-summary:", error);
            setSubtotal(0);
            setTotal(0);
        }
    }

    async function generateInvoice(invoiceNum: string, invDate: string, dueD: string) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

            const response = await postRequest(`${apiUrl}api/v1/invoice/generate-invoice`, {
                invoiceNo: invoiceNum,
                invoiceDate: invDate,
                dueDate: dueD,
                billingInformation: [
                    {
                        type: 'Company',
                        ...companyInformation,
                        ...billedBy
                    },
                    {
                        type: 'Client',
                        ...billedTo
                    }
                ],
                items: items.map(item => ({
                    itemNumber: item.id,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    type: item.type,
                })),
                total: {
                    subtotal,
                    tax: tax.value,
                    type_tax: tax.type,
                    discount: discount.value,
                    type_discount: discount.type,
                    total,
                },
                notes,
            });

            return response;
        } catch (error) {
            console.error("Failed to generate invoice:", error);
            throw error;
        }
    }

    useEffect(() => {
        recalcInvoice();
    }, [items, tax, discount]);

    return {
        items,
        subtotal,
        total,
        taxPercentage,
        discountPercentage,
        tax,
        discount,
        notes,
        invoiceType,
        companyInformation,
        billedBy,
        billedTo,
        invoiceNumber,
        invoiceDate,
        dueDate,
        setTaxPercentage,
        setDiscountPercentage,
        setTax,
        setDiscount,
        setNotes,
        setcompanyInformation,
        setBilledBy,
        setBilledTo,
        setInvoiceNumber,
        setInvoiceDate,
        setDueDate,
        addItem,
        removeItem,
        updateItem,
        recalcInvoice,
        resetInvoice,
        generateInvoice
    };
}