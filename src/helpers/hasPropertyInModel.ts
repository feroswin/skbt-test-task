import { ICategory } from '../interfaces/category.interface';

export function hasPropertyCategoryInModel(property: string): boolean {
    const typoObject: ICategory = {
        id: 'string',
        name: 'string',
        slug: 'string',
        description: 'string',
        createdDate: new Date(Date.now()),
        active: true,
    };

    return Object.keys(typoObject).includes(property);
}
