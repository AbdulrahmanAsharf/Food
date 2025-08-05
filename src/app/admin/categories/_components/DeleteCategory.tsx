"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "../_actions/category";
import { toast } from "sonner";

function DeleteCategory({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteCategory(id);

      if (res.status === 200) {
        toast.success(res.message || "تم حذف القسم بنجاح");
      } else {
        toast.error(res.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" disabled={isLoading} onClick={handleDelete}>
      <Trash2 />
    </Button>
  );
}

export default DeleteCategory;
