import axios from "axios";
import type {Category} from "./CommonInterface";

export const getMainCategory = async (): Promise<Category[]> => {
    const response = await axios.get('/category-proxy/category/v1/categories?pagingYn=N&categoryType=main');
    return response.data;
}

export const getSubCategory = async (): Promise<Category[]> => {
    const response = await axios.get('/category-proxy/category/v1/categories?pagingYn=N&categoryType=sub');
    return response.data;
}