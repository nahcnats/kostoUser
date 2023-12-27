import z from 'zod';

export const registerFormSchema = z.object({
    name: z
        .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string'
        })
        .min(2),
    email: z
        .string().email({
            message: 'Invalid email address'
        }),
    countryCode: z
        .string(),
    phoneNumber: z
        .string(),
    birthday: z
        .date()
        .min(new Date('1900-01-01'), 'Invalid date time, too old')
        .max(new Date('2023-01-01'), 'Invalid date time, too young')
        .default(new Date()),
    gender: z
        .string(),
    referralCode: z
        .string({
            invalid_type_error: 'Referral must be a string'
        }),
});