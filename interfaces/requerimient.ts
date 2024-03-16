
export interface IRequerimientItem {
    item: number;
    quantity: number;
    type: string;
    description: string;
    brand: string;
    model: string;
    reason: string;
}

export interface IRequerimient {
    _id             : string;
    requerimientId  : string;
    severity        : string;
    expectedMonth   : string;
    service         : string;
    destination     : string;
    comment         : string;
    createdBy       : string;
    items: IRequerimientItem[];

    isSigned        : boolean;

    createdAt?: string;
    updatedAt?: string;
}