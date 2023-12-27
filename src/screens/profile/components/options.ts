import * as resources from '../../../translations/resources';

export const genderCodes = [
    {
        code: 'male',
        name: "MALE"
    },
    {
        code: 'female',
        name: "FEMALE"
    }
];

export const getLanguageCodes = () => {
    let langList = [];

    for (const [key, value] of Object.entries(resources)) {
        langList.push({
            code: key, 
            name: value.language
        })
    }

    return langList;
}