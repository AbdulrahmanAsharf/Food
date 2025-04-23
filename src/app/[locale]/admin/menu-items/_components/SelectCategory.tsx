"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { Languages } from "@/constants/enums"

export default function SelectCategory({
  categories,
  field,
  translation,
}: {
  categories: Category[]
  field: {
    value: string
    onChange: (value: string) => void
  }
  translation: (key: string) => string
}) {
  const { locale } = useParams()
  const currentItem = categories.find((item) => item.id === field.value)

  return (
    <>
      <Label htmlFor="categoryId" className="capitalize text-black block mb-3">
        {translation("category")}
      </Label>
      <Select
        name="categoryId"
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger
          className={`w-48 h-10 bg-gray-100 border-none mb-4 focus:ring-0 ${
            locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <SelectValue>{currentItem?.name}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-transparent border-none z-50 bg-gray-100">
          <SelectGroup className="bg-background text-accent z-50">
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent"
              >
                <SelectLabel>{category.name}</SelectLabel>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
