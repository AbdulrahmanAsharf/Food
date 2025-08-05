'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { deliveryFee, getSubTotal, getTotalAmount } from '@/lib/cart';
import { formatCurrency } from '@/lib/formatters';
import { useCartStore } from '@/store/cart-store';

type UserProps = {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    country: string;
  };
};




function CheckoutForm({ user }: UserProps) {
  const cart = useCartStore((s) => s.items);
  const totalAmount = getTotalAmount(cart);
  console.log( user); // ✅ دي مهمة جداً
  const subTotal = getSubTotal(cart);
   // ✅ تحقق من تسجيل الدخول
  if (!user.id) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        يرجى تسجيل الدخول أولاً لإتمام عملية الدفع.
      </div>
    );
  }
   if (!cart || cart.length === 0) {
    return null;
  }
  return (
    cart &&
    cart.length > 0 && (
      <div className='grid gap-6 bg-gray-100 rounded-md p-4'>
        <h2 className='text-2xl text-black font-semibold'>Checkout</h2>
        <form>
          <div className='grid gap-4'>

            <div className='grid gap-4'>
              <Input
                id='name'
                placeholder='Enter your name'
                name='name'
                value={user.username ?? ""}
                readOnly
              />

              <Input
                id='email'
                placeholder='Enter your email'
                name='email'
                value={user.email ?? ""}
                readOnly
              />

              <Label htmlFor='phone' className='text-accent'>
                Phone
              </Label>
              <Input
                id='phone'
                placeholder='Enter your phone'
                type='text'
                name='phone'
                value={user.phone ?? ""}
                readOnly
              />
            </div>

            <div className='grid gap-1'>
              <Label htmlFor='address' className='text-accent'>
                Street address
              </Label>
              <Textarea
                id='address'
                placeholder='Enter your address'
                name='address'
                className='resize-none'
                value={user.streetAddress ?? ""}
                readOnly

              />
            </div>

            <div className='grid grid-cols-2 gap-2'>

              <div className='grid gap-1'>
                <Label htmlFor='postalCode' className='text-accent'>
                  Postal code
                </Label>
                <Input
                  type='text'
                  id='postalCode'
                  placeholder='Enter postal code'
                  name='postalCode'
                  value={user.postalCode ?? ""}
                  readOnly
                />
              </div>

              <div className='grid gap-1'>
                <Label htmlFor='city' className='text-accent'>
                  City
                </Label>
                <Input
                  type='text'
                  id='city'
                  placeholder='Enter your city'
                  name='city'
                  value={user.city ?? ""}
                  readOnly
                />
              </div>

              <div className='grid gap-1'>
                <Label htmlFor='country' className='text-accent'>
                  Country
                </Label>
                <Input
                  type='text'
                  id='country'
                  placeholder='Enter your country'
                  name='country'
                  value={user.country ?? ""}
                  readOnly
                />
              </div>

            </div>

           <Button
  type="button"
  className="h-10"
  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cartItems: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.basePrice,
      quantity: item.quantity,
    })),
    user: user, // ✅ أضف user هنا
    subTotal,
    deliveryFee,
    totalPrice: subTotal + deliveryFee,
  }),
});


    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }}
>
  Pay {formatCurrency(totalAmount)}
</Button>

          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
