export type TWallet = {
    walletId:string,
    amount: number,
    rewardAmount: number,
    trustAmount: number,
    action: number,
    isOneTimePasswordSet: boolean,
    createdBy: string,
    createdByName: string,
    createdDateTime: Date,
    lastUpdatedBy: string,
    lastUpdatedByName: string,
    lastUpdatedDateTime: Date,
    domainEvents: unknown[]
}

export type TWalletToken = {
    token: string
}

export type TWalletTransactions = {
    redirectUrl: string,
    walletId: string,
    walletTransactionId: string,
    amount: number,
    transactionType: string,
    attachmentId: string,
    fromWalletId: string,
    toWalletId: string,
    fromType: string,
    toType: string,
    actionBankInfo: string,
    status: string,
    billId: string,
    ownerDetails: {
        roleType: number,
        userId: string,
        merchantId: string,
        name: string,
        phoneNumber: string
    },
    merchantName: string,
    luckyDrawNumber: number,
    createdBy: string,
    createdByName: string,
    createdDateTime: Date,
    lastUpdatedBy: string,
    lastUpdatedByName: string,
    lastUpdatedDateTime: Date,
    domainEvents: unknown[]
}