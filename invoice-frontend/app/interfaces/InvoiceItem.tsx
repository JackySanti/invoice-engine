export type ItemType = "Product" | "Service"

export interface InvoiceItem {
    id: string
    description: string
    quantity: number
    price: number
    type: ItemType
}
