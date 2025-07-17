import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Extra, Size } from '@prisma/client'

export type CartItem = {
    name: string
    id: string
    image: string
    basePrice: number
    quantity?: number
    size?: Size
    extras?: Extra[]
}

type CartState = {
    items: CartItem[]
    addCartItem: (item: CartItem) => void
    removeCartItem: (id: string) => void
    removeItemFromCart: (id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
    (set, get) => ({
        items: [],
    addCartItem: (item: CartItem) => {
    const items = [...get().items]
    const index = items.findIndex((i) => i.id === item.id)
    if (index !== -1) {
        items[index].quantity = (items[index].quantity || 0) + 1
        items[index].size = item.size
        items[index].extras = item.extras
    } else {
        items.push({ ...item, quantity: 1 })
    }
        set({ items })
    },

    removeCartItem: (id: string) => {
    const items = [...get().items]
    const index = items.findIndex((i) => i.id === id)
    if (index !== -1) {
        if ((items[index].quantity || 1) === 1) {
            items.splice(index, 1)
        } else {
            items[index].quantity!--
        }
    }
        set({ items })
},
    removeItemFromCart: (id: string) => {
    const filtered = get().items.filter((i) => i.id !== id)
    set({ items: filtered })
},
    clearCart: () => set({ items: [] }),
}),
    {
      name: 'cart-storage', 
    }
)
)
