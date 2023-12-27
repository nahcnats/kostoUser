export type TMerchant = {
    businessInfo: {
        businessType: string,
        businessRegistrationNumber: string,
        businessName: string,
        businessAddress: string,
        individualName: string,
        individualAddress: string,
        identityNumber: string,
        allowEdit: boolean
    },
    bankInfo: {
        bankName: string,
        accountNumber: string,
        accountName: string
    },
    merchantView: {
        logoImage: {
            uploadedBy: {
                id: string,
                name: string,
                date: string
            },
            _id: string,
            url: string,
            name: string,
            key: string,
            bucket: string,
            mimeType: string,
            count: number,
            status: string,
            __v: number
        },
        coverImage: {
            uploadedBy: {
                id: string,
                name: string,
                date: string
            },
            _id: string,
            url: string,
            name: string,
            key: string,
            bucket: string,
            mimeType: string,
            count: number,
            status: string,
            __v: number
        },
        descriptionDelta: string
    },
    images: {
        gallery: unknown[],
        qrCode: {
            uploadedBy: {
                id: string,
                name: string,
                date: string,
                uType: string
            },
            _id: string,
            url: string,
            name: string,
            key: string,
            mimeType: string,
            count: number,
            status: string,
            __v: number
        }
    },
    createdBy: {
        id: string,
        name: string,
        date: string
    },
    lastUpdatedBy: {
        date: string,
        id: string,
        name: string
    },
    _id: string,
    accountId: string,
    email: string,
    phoneNumber: string,
    name: string,
    address: string,
    shortAddress: string,
    googleMapLink: string,
    shopName: string,
    shopCategories: string[],
    subCategories: string[],
    country: string,
    description: string,
    reviews: unknown[],
    status: string,
    contacts: unknown[],
    links: unknown[],
    operationTimes: [
        {
            day: string,
            startTime: string,
            endTime: string,
            _id: string
        },
    ],
    __v: number
}

export type TMerchantV2 = {
    merchantId: string,
    merchantLogoImage: string
    merchantImage: string,
    merchantPhoneNumber: string,
    operationTimeList: unknown[],
    merchantDescription: string
}