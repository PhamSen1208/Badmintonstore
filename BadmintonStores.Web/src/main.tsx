import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./features/auth/context/AuthContext"
import { CartProvider } from "@/features/client/cart/context/CartContext"
import { router } from "@/app/router"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
