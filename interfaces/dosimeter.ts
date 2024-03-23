
export interface IDosimeter {
    _id?        : number; 
    month       : Number;
    year        : Number;
    headquarter : string;   
    service     : string;
    location    : string;
    document    : string;
    
    createdAt?: string;
    updatedAt?: string;
}