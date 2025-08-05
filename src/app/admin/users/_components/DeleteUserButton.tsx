/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "../_actions/user";
import { toast } from "sonner";

function DeleteUserButton({ userId }: { userId: string }) {
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const res = await deleteUser(userId);

      toast.success(res.message, {
        className: res.status === 200 ? "text-green-400" : "text-destructive",
      });
    } catch (error) {
      toast("Something went wrong", {
        className: "text-destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={handleDelete}
    >
      <Trash2 />
    </Button>
  );
}

export default DeleteUserButton;
