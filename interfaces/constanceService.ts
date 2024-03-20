
export interface IConstanceService {
    _id             : number;
    provider        : string;
    invoiceNumber   : string;
    date            : string;
    amount          : Number;
    concept         : string;
    isSigned        : boolean;

    createdAt?: string;
    updatedAt?: string;
}