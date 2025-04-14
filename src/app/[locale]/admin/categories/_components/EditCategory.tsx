"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Category } from "@prisma/client"
import { EditIcon } from "lucide-react"
import { useTranslations } from "next-intl";
import { useState } from "react"
import Loader from "@/components/ui/loader";
import { Languages } from "@/constants/enums"
import { useParams } from "next/navigation"
import { updateCategory } from "../_actions/category"
import { toast } from "sonner"

function EditCategory({category} : {category: Category}) {
    const [isLoading, setIsLoading] = useState(false);
    const categories = useTranslations("admin.categories.form");
    const save = useTranslations();
    const { locale } = useParams();
    const [name, setName] = useState(category.name); 
    
    const handleSubmit = async ()=>{
      setIsLoading(true);
      const formDate = new FormData
      formDate.append("categoryName", name);
      const res = await updateCategory(category.id,formDate)
      setIsLoading(false);
      if(res.status === 201){
        toast.success(res.message)
      }else{
        toast.error(!res.error)
      }
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><EditIcon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className={
              locale === Languages.ARABIC ? "!text-right" : "!text-left"
            }
          >{categories('editName')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              {categories('name.label')}
            </Label>
            <Input 
                id="categoryName"  
                name="categoryName" 
                defaultValue={name} 
                onChange={(e)=>setName(e.target.value)}
                className="col-span-3"
                placeholder = {categories("name.placeholder")}
            />
          </div>
        </div>
        <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
              onClick={handleSubmit}
            >
                {isLoading ? <Loader /> : save("save")}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default EditCategory