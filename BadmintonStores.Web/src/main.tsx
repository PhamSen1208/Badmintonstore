import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./features/auth/context/AuthContext"
import { CartProvider } from "@/features/client/cart/context/CartContext"
import { WishlistProvider } from "@/features/client/context/WishlistContext"
import { router } from "@/app/router"
import "./index.css"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "39019305844-99htt14gaath5gpp8u37ar7viuildg0g.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
