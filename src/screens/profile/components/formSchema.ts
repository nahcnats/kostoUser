import z from 'zod';

export const formSchema = z.object({
    name: z
        .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string'
        })
        .min(2),
    countryCode: z
        .string(),
    phoneNumber: z
        .string(),
    language: z
        .string(),
    email: z
        .string().email({
            message: 'Invalid email address'
        }),
    isVerified: z
        .boolean(),
    birthday: z
        .string(),
    gender: z
        .string(),
    referralCode: z
        .string({
            invalid_type_error: 'Referral must be a string'
        }),
    referredBy: z
        .string({
            invalid_type_error: 'Referred by must be a string'
        }).min(2),
});