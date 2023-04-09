import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { Product } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<Product[], AxiosError>("available-products", async () => {
    const res = await axios.get<Product[]>(`${API_PATHS.product}/products`);
    return res.data;
  });
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<Product, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<Product>(`${API_PATHS.bff}/products/${id}`);
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: Product) =>
    axios.put<Product>(`${API_PATHS.bff}/product`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
