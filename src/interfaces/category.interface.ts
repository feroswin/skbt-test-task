export interface ICategory {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    createdDate: Date;
    active: boolean;
}
