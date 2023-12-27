export type TSignInOtp = {
    token: string
}

export type TRegister = {
    userId: string,
    name: string,
    password: string,
    email: string,
    countryCode: string,
    phoneNumber: string,
    walletId: string,
    merchantIds: string,
    roleType: number,
    status: number,
    isVerified: boolean,
    referralCode: string,
    referredBy: string,
    birthday: Date,
    gender: number,
    createdBy: string,
    createdByName: string,
    createdDateTime: Date,
    lastUpdatedBy: string,
    lastUpdatedByName: string,
    lastUpdatedDateTime: Date,
    domainEvents: unknown[]
}