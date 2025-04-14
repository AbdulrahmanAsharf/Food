"use client"
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { deletecategory } from '../_actions/category';
import { toast } from 'sonner';


type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

function DeleteCategory({ id }: { id: string }) {
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
  
      const res = await deletecategory(id);
      if (res.status === 201) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
  
      setState((prev) => ({
        ...prev,
        message: res.message ?? '', // fallback to empty string
        status: res.status
      }));
      
    } catch (error) {
      console.error(error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  
  

  return (
    <Button 
      variant="secondary"
      disabled={state.isLoading}
      onClick={handleDelete}
    > 
      <Trash2 /> 
    </Button>
  )
}

export default DeleteCategory 