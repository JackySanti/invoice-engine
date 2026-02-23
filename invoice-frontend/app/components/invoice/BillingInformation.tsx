import { useState, useRef, useEffect } from 'react';
import { BillingInfo } from "../../interfaces/billingInfo"

interface Props {
    title: string;
    info: BillingInfo;
    setInfo: (value: Partial<BillingInfo>) => void;
}
export const BillingInformation = ({ title, info, setInfo }: Props) => {
    const [companyError, setCompanyError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const cityStateZipRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);

    const adjustInputWidth = (input: HTMLInputElement | null) => {
        if (input) {
            // Crear un elemento temporary para medir el ancho del texto
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            span.style.font = window.getComputedStyle(input).font;
            span.style.padding = window.getComputedStyle(input).padding;
            span.textContent = input.value || input.placeholder;
            
            document.body.appendChild(span);
            const width = span.offsetWidth;
            document.body.removeChild(span);
            
            // Convertir ancho a em
            const fontSize = window.getComputedStyle(input).fontSize;
            const fontSizeValue = parseFloat(fontSize);
            const widthInEm = Math.max((width / fontSizeValue) + 0.3, 5);
            input.style.width = `${widthInEm}em`;
        }
    };

    useEffect(() => {
        adjustInputWidth(firstNameRef.current);
    }, [info.firstName]);

    useEffect(() => {
        adjustInputWidth(lastNameRef.current);
    }, [info.lastName]);

    useEffect(() => {
        adjustInputWidth(addressRef.current);
    }, [info.address]);

    useEffect(() => {
        adjustInputWidth(cityStateZipRef.current);
    }, [info.cityStateZip]);

    useEffect(() => {
        adjustInputWidth(countryRef.current);
    }, [info.country]);

    const handleChange = (field: keyof typeof info, value: string) => {
        setInfo({ [field]: value });
        if (value.trim() !== "") {
            if (field === "company") setCompanyError(false);
            if (field === "firstName") {
                setFirstNameError(false);
                setTimeout(() => adjustInputWidth(firstNameRef.current), 0);
            }
            if (field === "lastName") {
                setLastNameError(false);
                setTimeout(() => adjustInputWidth(lastNameRef.current), 0);
            }
            if (field === "address") {
                setTimeout(() => adjustInputWidth(addressRef.current), 0);
            }
            if (field === "cityStateZip") {
                setTimeout(() => adjustInputWidth(cityStateZipRef.current), 0);
            }
            if (field === "country") {
                setTimeout(() => adjustInputWidth(countryRef.current), 0);
            }
            if (field === "phoneNumber") setPhoneError(false);
        }
    };

    const handleCompanyBlur = () => {
        if (!info.company || info.company.trim() === "") {
            setCompanyError(true);
            setTimeout(() => alert("Company is required"), 0);
        } else {
            setCompanyError(false);
        }
    };

    const handleFirstNameBlur = () => {
        if (!info.firstName || info.firstName.trim() === "") {
            setFirstNameError(true);
            setTimeout(() => alert("First Name is required"), 0);
        } else {
            setFirstNameError(false);
        }
    };

    const handleLastNameBlur = () => {
        if (!info.lastName || info.lastName.trim() === "") {
            setLastNameError(true);
            setTimeout(() => alert("Last Name is required"), 0);
        } else {
            setLastNameError(false);
        }
    };

    const handlePhoneBlur = () => {
        if (!info.phoneNumber || info.phoneNumber.trim() === "") {
            setPhoneError(true);
            setTimeout(() => alert("Phone Number is required"), 0);
        } else {
            setPhoneError(false);
        }
    };

    return (
        <>
            <p className="text-gray-600 text-sm mb-2">{title}</p>

            <input
                className={`px-2 font-semibold text-gray-700 hover:border border-dashed rounded-md focus:outline-none w-full mb-2 ${
                    companyError
                        ? "borer border-red-800 focus:border-red-800"
                        : "border-gray-300 focus:border-gray-400"
                }`}
                type="text"
                value={info.company}
                onChange={(e) => handleChange("company", e.target.value)}
                onBlur={handleCompanyBlur}
                placeholder="Client's Company *"
            />

            <div className="flex gap-2 mb-2">
                <input
                    ref={firstNameRef}
                    className={`px-2 text-sm text-gray-600 hover:border border-dashed rounded-md focus:outline-none ${
                        firstNameError
                            ? "borer border-red-800 focus:border-red-800"
                            : "border-gray-300 focus:border-gray-400"
                    }`}
                    type="text"
                    value={info.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    onBlur={handleFirstNameBlur}
                    placeholder="First Name *"
                    style={{ minWidth: "5em" }}
                />
                <input
                    ref={lastNameRef}
                    className={`px-2 text-sm text-gray-600 hover:border border-dashed rounded-md focus:outline-none ${
                        lastNameError
                            ? "borer border-red-800 focus:border-red-800"
                            : "border-gray-300 focus:border-gray-400"
                    }`}
                    type="text"
                    value={info.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    onBlur={handleLastNameBlur}
                    placeholder="Last Name *"
                    style={{ minWidth: "5em" }}
                />
            </div>
            <input
                className={`px-2 text-sm text-gray-600 hover:border border-dashed rounded-md focus:outline-none w-full mb-2 ${
                    phoneError
                        ? "borer border-red-800 focus:border-red-800"
                        : "border-gray-300 focus:border-gray-400"
                }`}
                type="text"
                value={info.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={handlePhoneBlur}
                maxLength={10}
                placeholder="Phone Number *"
            />

            <div className="flex gap-2 mb-2">
                <input
                    ref={addressRef}
                    className="px-2 text-sm text-gray-600 hover:border border-dashed border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                    type="text"
                    value={info.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Address"
                    style={{ minWidth: "5em" }}
                />
                <input
                    ref={cityStateZipRef}
                    className="px-2 text-sm text-gray-600 hover:border border-dashed border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                    type="text"
                    value={info.cityStateZip}
                    onChange={(e) => handleChange("cityStateZip", e.target.value)}
                    placeholder="City, State ZIP"
                    style={{ minWidth: "5em" }}
                />
                <input
                    ref={countryRef}
                    className="px-2 text-sm text-gray-600 hover:border border-dashed border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                    type="text"
                    value={info.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Country"
                    style={{ minWidth: "5em" }}
                />
            </div>
        </>
    );
};