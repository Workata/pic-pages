import { getCategories } from "../services/categories";
import { Category } from "../models/Category";


/**
 * Make request for categories and set a state related with them
 * @param setCategories 
 * @return {void}
 */
export const fetchCategories = (setCategories: any): void => {
    getCategories((res: any) => {
      let categories = res.data.map(
        (obj: any) => new Category(obj)
      )
      setCategories(categories);
    }, (err: any) => {
      console.log(err);
    });
}
