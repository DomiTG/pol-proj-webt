import { useState, useCallback } from "react";
import type { Category } from "../types";
import { getItem, setItem } from "../utils/storage";
import { DEFAULT_CATEGORIES } from "../utils/categories";

const STORAGE_KEY = "fintrak_categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    getItem<Category[]>(STORAGE_KEY, DEFAULT_CATEGORIES)
  );

  const save = useCallback((updated: Category[]) => {
    setCategories(updated);
    setItem(STORAGE_KEY, updated);
  }, []);

  const addCategory = useCallback(
    (cat: Omit<Category, "id">) => {
      const newCat: Category = {
        ...cat,
        id: `cat_${Date.now()}`,
      };
      save([...categories, newCat]);
    },
    [categories, save]
  );

  const updateCategory = useCallback(
    (id: string, data: Partial<Omit<Category, "id">>) => {
      save(categories.map((c) => (c.id === id ? { ...c, ...data } : c)));
    },
    [categories, save]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      save(categories.filter((c) => c.id !== id));
    },
    [categories, save]
  );

  const findById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  return { categories, addCategory, updateCategory, deleteCategory, findById };
}
