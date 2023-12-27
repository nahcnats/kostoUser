export type TBlock = {
    blockId: string,
    userId: string,
    currentAmount: number,
    status: string,
    merchantName: string,
    name: string,
    countryCode: string,
    phoneNumber: string,
    blockType: string,
    totalAmount: number,
    createdBy: Date,
    createdByName: string,
    createdDateTime: Date,
    lastUpdatedBy: string,
    lastUpdatedByName: string,
    lastUpdatedDateTime: Date,
    domainEvents: unknown[]
}