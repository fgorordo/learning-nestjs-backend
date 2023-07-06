import { genSaltSync, hashSync, compareSync } from "bcrypt";


export const generateSalt = () => {
    return genSaltSync();
};

export const hashData = ( data: string, salt: string ) => {
    return hashSync(data,salt)
};

export const compareHash = (candidate: string, original: string) => {
    return compareSync(candidate, original);
};