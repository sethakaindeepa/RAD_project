
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("toyland-cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  // Save cart items in localStorage
  useEffect(() => {
    localStorage.setItem("toyland-cart", JSON.stringify(items));
  }, [items]);

  // ADD PRODUCT
  function addToCart(product: CartProduct) {
    setItems((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }

  // REMOVE PRODUCT
  function removeFromCart(id: string) {
    setItems((current) =>
      current.filter((item) => item.product.id !== id)
    );
  }

  // UPDATE QUANTITY
  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.product.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  // CLEAR CART
  function clearCart() {
    setItems([]);
  }

  // TOTAL ITEMS
  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // TOTAL PRICE
  const subtotal = items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
