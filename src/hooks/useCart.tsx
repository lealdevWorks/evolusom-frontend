import { createContext, useContext, useState, ReactNode } from 'react';

// Tipo para itens do carrinho
type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

// Contexto do carrinho
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

// Provider do carrinho
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => useContext(CartContext);
