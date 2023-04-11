import * as Yup from "yup";

export const ProductSchema = Yup.object({
  id: Yup.string(),
  title: Yup.string().required().default(""),
  description: Yup.string().default(""),
  image: Yup.string().default(""),
  price: Yup.number().positive().required().defined().default(0),
  count: Yup.number().positive().integer().required().defined().default(0),
});

export type Product = Yup.InferType<typeof ProductSchema>;
