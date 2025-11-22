import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  productId: number | string;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number | string) => void;
  clear: () => void;
  checkout: () => Promise<{ success: boolean; error?: string }>
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error('useCart must be used within CartProvider');
  return c;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: CartItem) => {
    setItems(prev => {
      const found = prev.find(p => String(p.productId) === String(item.productId));
      if (found) return prev.map(p => p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p);
      return [...prev, item];
    });
  };

  const remove = (productId: number | string) => {
    setItems(prev => prev.filter(p => String(p.productId) !== String(productId)));
  };

  const clear = () => setItems([]);

  const checkout = async () => {
    try {
      const body = { items: items.map(i => ({ productId: Number(i.productId), quantity: i.quantity })) };
      const base = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.52:3000';
      // Note: On Android emulator use 10.0.2.2, on real device use server IP or tunnel
      const res = await fetch(`${base}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'checkout failed');
      // on success clear cart
      clear();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider value={{ items, add, remove, clear, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export type { CartItem };
