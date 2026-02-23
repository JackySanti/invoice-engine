import { useState, useEffect } from "react";
import { InvoiceItem } from "../../../interfaces/InvoiceItem";

interface Props {
    item: InvoiceItem;
    updateItem: (id: string, changes: Partial<InvoiceItem>) => void;
    removeItem: (id: string) => void;
    recalcInvoice: () => void;
}

export const RowItem = ({ item, updateItem, removeItem, recalcInvoice }: Props) => {
    const [localDescription, setLocalDescription] = useState(item.description);
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [localPrice, setLocalPrice] = useState(item.price);

    useEffect(() => {
        setLocalDescription(item.description);
        setLocalQuantity(item.quantity);
        setLocalPrice(item.price);
    }, [item.description, item.quantity, item.price]);

    const handleUpdate = (changes: Partial<InvoiceItem>) => {
        updateItem(item.id, changes);
        recalcInvoice();
    };

    return (
        <tr>
            <td className="px-2 py-1">
                <input
                    type="text"
                    value={item.id}
                    placeholder="01"
                    className="mt-1 text-[.9rem] hover:border border-dashed border-gray-300 rounded-md px-2 focus:outline-none focus:border-gray-400"
                    onChange={(e) => setLocalDescription(e.target.value)}
                    onBlur={() => handleUpdate({ id: item.id })}
                />
            </td>
            <td className="px-2 py-1">
                <input
                    type="text"
                    value={localDescription}
                    placeholder="Item Description"
                    className="mt-1 text-[.9rem] hover:border border-dashed border-gray-300 rounded-md px-2 focus:outline-none focus:border-gray-400"
                    onChange={(e) => setLocalDescription(e.target.value)}
                    onBlur={() => handleUpdate({ description: localDescription })}
                />
            </td>
            <td className="px-2 py-1 text-center">
                <input
                    type="number"
                    min="0"
                    value={localQuantity}
                    placeholder="1"
                    className="w-32 mt-1 text-[.9rem] text-center hover:border border-dashed border-gray-300 rounded-md px-2 focus:outline-none focus:border-gray-400"
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        setLocalQuantity(newValue < 0 ? 0 : newValue);
                    }}
                    onBlur={() => handleUpdate({ quantity: localQuantity })}
                />
            </td>
            <td className="px-2 py-1 text-center">
                <input
                    type="number"
                    min="0"
                    value={localPrice}
                    placeholder="$0.00"
                    className="w-32 mt-1 text-[.9rem] text-center hover:border border-dashed border-gray-300 rounded-md px-2 focus:outline-none focus:border-gray-400"
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        setLocalPrice(newValue < 0 ? 0 : newValue);
                    }}
                    onBlur={() => handleUpdate({ price: localPrice })}
                />
            </td>
            <td className="px-2 py-1">
                <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-auto border-gray-800 rounded-xl text-gray-800 hover:bg-red-500 hover:text-white transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};