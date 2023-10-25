import { Blog } from "../schema/blogs";

export interface IBlogDetails extends Blog {
    categoryDetails: {
        name: string,
        _id: string,
        createdAt: string,
        updatedAt: string,
        iconUrl: string,
        createdBy: string,
    },
    subCategoryDetails: {
        name: string,
        _id: string,
        createdAt: string,
        updatedAt: string,
        iconUrl: string,
        createdBy: string,
    }
}