import { useState } from "react"

export enum AmountType {
    Money = "Money",
    Percent = "Percent",
}

interface Adjustment {
    value: number
    type: AmountType
}

interface Props {
    subtotal: number
    tax: Adjustment
    discount: Adjustment
    total: number
    setTax: (value: Adjustment) => void
    setDiscount: (value: Adjustment) => void
}

export const Price = ({ subtotal, tax, discount, total, setTax, setDiscount }: Props) => {
    const renderInput = (
        adjustment: Adjustment,
        setAdjustment: (v: Adjustment) => void
    ) => {
        const toggleType = () => {
            setAdjustment({
                ...adjustment,
                type:
                    adjustment.type === AmountType.Percent
                        ? AmountType.Money
                        : AmountType.Percent
            })
        }

        return (
            <div className="flex items-center gap-1">
                {adjustment.type === AmountType.Money && (
                    <button
                        type="button"
                        onClick={toggleType}
                        className="text-gray-600 font-medium"
                    >
                        $
                    </button>
                )}

                <input
                    type="number"
                    min="0"
                    className="w-32 px-2 py-1 text-right text-[.9rem] border-dashed border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                    value={adjustment.value}
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        setAdjustment({
                            ...adjustment,
                            value: newValue < 0 ? 0 : newValue
                        })
                    }}
                />

                {adjustment.type === AmountType.Percent && (
                    <button
                        type="button"
                        onClick={toggleType}
                        className="text-gray-600 font-medium"
                    >
                        %
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="w-1/4 grid grid-row-2">
            <div className="overflow-x-auto border border-gray-100 rounded-xl p-2">
                <div className="flex justify-between">
                    <p className="text-[.9rem] text-gray-500">Subtotal</p>
                    <p className="w-32 text-right text-[.9rem] px-1">
                        {subtotal.toFixed(2)}
                    </p>
                </div>

                <div className="flex justify-between mt-2">
                    <p className="text-[.9rem] text-gray-500">Tax</p>
                    {renderInput(tax, setTax)}
                </div>

                <div className="flex justify-between mt-2">
                    <p className="text-[.9rem] text-gray-500">Discount</p>
                    {renderInput(discount, setDiscount)}
                </div>

                <div className="flex justify-between bg-gray-50 p-2 rounded-md mt-4">
                    <p className="text-[.9rem] text-gray-700 font-semibold">Total</p>
                    <p className="text-[.9rem] text-gray-700 font-semibold">
                        {total.toFixed(2)}
                    </p>
                </div>

            </div>
        </div>
    )
}