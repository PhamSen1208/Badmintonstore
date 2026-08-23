export type BrandListItem = {
    id: number;
    brandCode: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    description?: string | null;
    createdAt: string;
};

export type CreateBrandRequest = {
    brandCode: string;
    name: string;
    slug?: string;
    logoUrl?: string;
    description?: string;
};
