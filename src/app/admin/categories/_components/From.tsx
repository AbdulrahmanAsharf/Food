"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useActionState, useEffect } from "react";
import { addCategory } from "../_actions/category";

type InitialStateType = {
  message?: string;
  error?: ValidationError;
  status?: number | null;
};

const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};

function Form() {
  const [state, action, pending] = useActionState(addCategory, initialState);

  useEffect(() => {
  if (!pending && state.message) {
    if (state.status === 201) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }
}, [state.message, state.status, pending]);

  return (
    <form action={action} className="mb-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم القسم</Label>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="ادخل اسم القسم"
          />
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "جاري الإضافة..." : "إضافة"}
          </Button>
        </div>
        {state.error?.name && (
          <p className="text-sm text-destructive">{state.error.name}</p>
        )}
      </div>
    </form>
  );
}

export default Form;
