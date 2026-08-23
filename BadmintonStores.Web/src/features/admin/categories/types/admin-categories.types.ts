export type CategoryListItem = {
    id: number;
    categoryCode: string;
    name: string;
    slug: string;
    description?: string | null;
    parentId?: number | null;
    createdAt: string;
};

export type CreateCategoryRequest = {
    categoryCode: string;
    name: string;
    slug?: string;
    description?: string;
    parentId?: number;
};
