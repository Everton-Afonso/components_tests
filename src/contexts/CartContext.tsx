import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  id: number
  name: string
  img: string
  price: number
  quantity: number
}

interface CartContextType {
  products: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  incrementQuantity: (id: number) => void
  decrementQuantity: (id: number) => void
}

const CartContext = createContext<CartContextType>({
  products: [],
  addToCart: () => {},
  removeFromCart: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {}
})

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const initialCart: CartItem[] = JSON.parse(
    localStorage.getItem('cart') || '[]'
  )
  const [products, setProducts] = useState<CartItem[]>(initialCart)

  const addToCart = (item: CartItem) => {
    const existingItem = products.find((product) => product.id === item.id)

    if (existingItem) {
      incrementQuantity(existingItem.id)
    } else {
      setProducts((prevItems) => [...prevItems, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id: number) => {
    setProducts((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const incrementQuantity = (id: number) => {
    setProducts((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrementQuantity = (id: number) => {
    setProducts((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }

          return item
        })
        .filter((cartProduct) => cartProduct.quantity > 0)
    )
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(products))
  }, [products])

  return (
    <CartContext.Provider
      value={{
        products,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

const useCart = (): CartContextType => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}

export { CartProvider, useCart }
