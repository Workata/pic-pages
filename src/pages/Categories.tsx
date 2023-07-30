import React, {useState, useEffect, useContext} from "react";
import {
  Box,
    Typography

} from "@mui/material";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categories";
import { Category } from "../models/Category";

// * components
import ClickableFolder from "../components/ClickableFolder";


export default function Categories() {

  const [categories, setCategories] = useState<Category[]>();

  const fetchCategories = () => {
    getCategories((res: any) => {
      let categories = res.data.categories.map(
        (o: any) => new Category({name: o})
      )
      setCategories(categories);
    }, (err: any) => {
      console.log(err);
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Box sx={{display: 'flex', columnGap: '20px'}}> 
        {categories && categories.map(
          (category) => <ClickableFolder key={category.name} link={`/categories/${category.name}`} name={category.name}/>
        )}
      </Box>
    </>
  );
}
