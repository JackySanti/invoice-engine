"use client";
import { useState } from "react";
import { CompanyInformation } from "../../interfaces/companyInformation";

interface HeaderInvoiceProps {
    infoCompany: CompanyInformation;
    setinfoCompany: (info: CompanyInformation) => void;
    invoiceNumber: string;
    setInvoiceNumber: (value: string) => void;
    invoiceDate: string;
    setInvoiceDate: (value: string) => void;
    dueDate: string;
    setDueDate: (value: string) => void;
}

export const HeaderInvoice = ({
    infoCompany,
    setinfoCompany,
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate
}: HeaderInvoiceProps) => {
    const [websiteError, setWebsiteError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const handleWebsiteBlur = () => {
        if (!infoCompany.website || infoCompany.website.trim() === "") {
            setWebsiteError(true);
            setTimeout(() => {
                alert("Website is required");
            }, 0);
        } else {
            setWebsiteError(false);
        }
    };

    const handleEmailBlur = () => {
        if (!infoCompany.email || infoCompany.email.trim() === "") {
            setEmailError(true);
            setTimeout(() => {
                alert("Email is required");
            }, 0);
        } else {
            setEmailError(false);
        }
    };
    return (
        <>
            <div>
                <div className="w-32 border border-dashed border-gray-300 rounded-md p-3 flex justify-center items-center">
                    <label className="flex items-center gap-3 cursor-pointer text-gray-400">
                        {!infoCompany.logo && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        )}
                        <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const base64 = event.target?.result as string;
                                        setinfoCompany({ ...infoCompany, logo: base64 });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </label>

                    {infoCompany.logo && <img className="h-[6rem] w-auto" src={infoCompany.logo} alt="Logo" />}
                </div>

                <div>
                    <input
                        className={`w-full m-0 px-2 text-[.8rem] text-gray-600 hover:border border-dashed rounded-md px-2 focus:text-left focus:outline-none ${
                            websiteError
                                ? "border border-red-800 focus:border-red-800"
                                : "border-gray-300 focus:border-gray-400"
                        }`}
                        type="text" placeholder="Website *" value={infoCompany.website || ""}
                        onChange={(e) => {
                            setinfoCompany({ ...infoCompany, website: e.target.value });
                            if (e.target.value.trim() !== "") {
                                setWebsiteError(false);
                            }
                        }}
                        onBlur={handleWebsiteBlur}
                    />
                    <input
                        className={`w-full m-0 px-2 text-[.8rem] text-gray-600 hover:border border-dashed rounded-md px-2 focus:text-left focus:outline-none ${
                            emailError
                                ? "border border-red-800 focus:border-red-800"
                                : "border-gray-300 focus:border-gray-400"
                        }`}
                        type="email" placeholder="Email *" value={infoCompany.email || ""}
                        onChange={(e) => {
                            setinfoCompany({ ...infoCompany, email: e.target.value });
                            if (e.target.value.trim() !== "") {
                                setEmailError(false);
                            }
                        }}
                        onBlur={handleEmailBlur}
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-end">
                    <label className="font-semibold text-lg">Invoice No</label>
                    <input
                        className="w-32 font-bold text-lg text-blue-600 text-center hover:border border-dashed border-gray-300 rounded-md px-2 focus:text-left focus:outline-none focus:border-gray-400"
                        type="text" placeholder="####" maxLength={10} value={invoiceNumber} 
                        onChange={(e) => {
                            setInvoiceNumber(e.target.value);
                        }} 
                    />
                </div>
                <div className="flex justify-end mt-3 gap-2">
                    <div className="flex flex-col">
                        <label className="text-gray-800 text-[.8rem] font-semibold">Invoice Date</label>
                        <input className="hover:border border-dashed border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-gray-400"
                            type="date" value={invoiceDate} 
                            onChange={(e) => {
                                setInvoiceDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 text-[.8rem] font-semibold">Due Date</label>
                        <input className="hover:border border-dashed border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-gray-400"
                            type="date" value={dueDate} 
                            onChange={(e) => {
                                setDueDate(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};