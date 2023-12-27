export type TTransactions = {
    name: string,
    phoneNumber: string,
    transactionId: string,
    merchantId: string,
    merchantName: string
    productName: string,
    userId: string,
    amount: number,
    status: string,
    paymentType: string,
    transactionDateTime: Date,
    createdBy: string,
    createdByName: string,
    createdDateTime: Date,
    lastUpdatedBy: string,
    lastUpdatedByName: string,
    lastUpdatedDateTime: Date,
    domainEvents: unknown[]
}