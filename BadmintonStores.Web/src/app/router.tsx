import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { PublicLayout } from "@/features/admin/layouts/PublicLayout";
import { HomePage } from "@/features/admin/pages/HomePage";
import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import { AdminHomePage } from "@/features/admin/pages/AdminHomePage";
import { ProtectedRoute } from "@/app/ProtectRoute";
import { RoleRoute } from "@/app/RoleRoute";
import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { AdminProductVariantPage } from "@/features/admin/pages/AdminProductVariantsPage";
import { AdminWarehousesPage } from "@/features/admin/pages/AdminWarehousesPage";
import { AdminWarehouseStocksPage } from "@/features/admin/pages/AdminStocksPage";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { AdminInventoryTransactionsPage } from "@/features/admin/pages/AdminInventoryTransactionsPage";
import { AdminCustomersPage } from "@/features/admin/pages/AdminCustomersPage";
import { AdminBrandsPage } from "@/features/admin/pages/AdminBrandsPage";
import { AdminCategoriesPage } from "@/features/admin/pages/AdminCategoriesPage";
import { ProductsPage } from "@/features/client/pages/ProductsPage";
import { ProductDetailPage } from "@/features/client/pages/ProductDetailPage";
import { CartPage } from "@/features/client/pages/CartPage";
import { CheckoutPage } from "@/features/client/pages/CheckoutPage";
import { OrderSuccessPage } from "@/features/client/pages/OrderSuccessPage";
import { StoresPage } from "@/features/client/pages/StoresPage";
import { AboutPage } from "@/features/client/pages/AboutPage";
import { NewsPage } from "@/features/client/pages/NewsPage";
import { RecruitmentPage } from "@/features/client/pages/RecruitmentPage";
import { ProfilePage } from "@/features/client/pages/ProfilePage";
import { MyOrdersPage } from "@/features/client/pages/MyOrdersPage";
import { MyWishlistPage } from "@/features/client/pages/MyWishlistPage";
import { AccountLayout } from "@/features/client/components/AccountLayout";
import { ChangePasswordForm } from "@/features/client/components/ChangePasswordForm";
import { AdminCouponsPage } from "@/features/admin/pages/AdminCouponsPage";
import { AdminReviewsPage } from "@/features/admin/pages/AdminReviewsPage";


export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/products",
                element: <ProductsPage />,
            },
            {
                path: "/products/:productId",
                element: <ProductDetailPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/checkout",
                element: <CheckoutPage />,
            },
            {
                path: "/order-success",
                element: <OrderSuccessPage />,
            },
            {
                path: "/stores",
                element: <StoresPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/news",
                element: <NewsPage />,
            },
            {
                path: "/recruitment",
                element: <RecruitmentPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <AccountLayout />,
                        children: [
                            {
                                path: "/profile",
                                element: <ProfilePage />,
                            },
                            {
                                path: "/account/orders",
                                element: <MyOrdersPage />,
                            },
                            {
                                path: "/account/wishlist",
                                element: <MyWishlistPage />,
                            },
                            {
                                path: "/account/security",
                                element: <ChangePasswordForm />,
                            },
                        ]
                    },
                ]
            },
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        element: <RoleRoute allowedRoles={["Admin", "Staff"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminHomePage />,
                    },
                    {
                        path: "products",
                        element: <AdminProductsPage />,
                    },
                    {
                        path: "brands",
                        element: <AdminBrandsPage />,
                    },
                    {
                        path: "categories",
                        element: <AdminCategoriesPage />,
                    },
                    {
                        path: "products/:productId/variants",
                        element: <AdminProductVariantPage />,
                    },
                    {
                        path: "warehouses",
                        element: <AdminWarehousesPage />
                    },
                    {
                        path: "warehouses/:warehouseId/stocks",
                        element: <AdminWarehouseStocksPage />
                    },
                    {
                        path: "orders",
                        element: <AdminOrdersPage />
                    },
                    {
                        path: "inventory-transactions",
                        element: <AdminInventoryTransactionsPage />
                    },
                    {
                        path: "customers",
                        element: <AdminCustomersPage />
                    },
                    {
                        path: "coupons",
                        element: <AdminCouponsPage />
                    },
                    {
                        path: "reviews",
                        element: <AdminReviewsPage />
                    }
                ],
            },
        ],
    },
]);