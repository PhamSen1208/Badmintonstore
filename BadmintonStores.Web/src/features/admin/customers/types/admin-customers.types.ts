export type CustomerListItem = {
    customerId: number;
    userId: number;
    customerCode: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
}

export type GetCustomersResponse = {
    items: CustomerListItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export type GetCustomersParams = {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
}

export type CreateCustomerRequest = {
    userId: number;
    customerCode: string;
    fullName: string;
    gender: string;
    dateOfBirth?: string;
};

export type UpdateCustomerRequest = {
    fullName: string;
    gender: string;
    dateOfBirth?: string;
};