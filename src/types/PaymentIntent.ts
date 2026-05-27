export type PaymentIntent = {
    clientSecret: string
    totalAmount: number
    invoiceItems: Array<{
        title: string
        amount: number
    }>
}
