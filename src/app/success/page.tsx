'use client'

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)
  const [loading, setLoading] = useState(true)


useEffect(() => {
  const fetchOrder = async () => {
      try {
        const res = await fetch("/api/check-order")
        if (res.ok) {
          const data = await res.json()
          console.log("🧾 Order:", data.order)
          clearCart()
          toast.success("تم حفظ الطلب بنجاح 🎉")
        }
      } catch (error) {
        console.error("❌ Error fetching order:", error)
        toast.error("حدث خطأ أثناء حفظ الطلب")
      } finally {
         setLoading(false)
      }
    }
  fetchOrder()
}, [clearCart])

  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold">شكرًا لطلبك!</h1>
      <p className="mt-2">
        {loading
          ? "جاري التحقق من الطلب..."
          : "تم الدفع بنجاح، وستصلك رسالة تأكيد قريبًا."}
      </p>
    </div>
  )
}
