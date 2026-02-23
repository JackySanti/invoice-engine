"use client";

import { useState } from "react";
import { CompanyInformation } from "../interfaces/companyInformation";
import { BillingInfo } from "../interfaces/billingInfo";

interface HeaderProps {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    companyInformation: CompanyInformation;
    billedBy: BillingInfo;
    billedTo: BillingInfo;
    generateInvoice: (invoiceNumber: string, invoiceDate: string, dueDate: string) => Promise<string>;
}

export const Header = ({
    invoiceNumber,
    invoiceDate,
    dueDate,
    companyInformation,
    billedBy,
    billedTo,
    generateInvoice
}: HeaderProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        const newTab = window.open('', '_blank');
        try {
            setIsLoading(true);

            const response = await generateInvoice(invoiceNumber, invoiceDate, dueDate);
            console.log('Header', response);

            if (newTab) {
                newTab.location.href = response;
            }
        } catch (error: any) {
            newTab?.close();
            console.error("Error generating invoice:", error);
            const data = error?.response?.data;
            const message = data?.message;
            const text = Array.isArray(message)
                ? message.join('\n')
                : (message ?? "Error generating invoice. Please try again.");
            alert(text);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex grid grid-cols-2 gap-2 mb-6">
            <h1 className="text-4xl font-light tracking-wide text-gray-900">Create New Invoice</h1>

            <div className="flex flex-row-reverse mt-8 gap-2">
                <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="w-32 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                    <span className="text-sm">{isLoading ? "Downloading..." : "Download"}</span>
                </button>
            </div>
        </div>
    );
}