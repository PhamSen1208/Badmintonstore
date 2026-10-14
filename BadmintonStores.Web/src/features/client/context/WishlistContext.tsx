import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyWishlistIds, toggleWishlist } from "../services/wishlist.service";
import { toast } from "sonner";

interface WishlistContextType {
    favoriteIds: number[];
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (productId: number) => Promise<boolean>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const { isAuthenticated } = useAuth();

    async function loadWishlistIds() {
        if (!isAuthenticated) {
            setFavoriteIds([]);
            return;
        }
        try {
            const ids = await getMyWishlistIds();
            setFavoriteIds(Array.isArray(ids) ? ids : []);
        } catch {
            setFavoriteIds([]);
        }
    }

    useEffect(() => {
        loadWishlistIds();
    }, [isAuthenticated]);

    function isFavorite(productId: number): boolean {
        return favoriteIds.includes(productId);
    }

    async function toggleFavorite(productId: number): Promise<boolean> {
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để lưu sản phẩm yêu thích!");
            return false;
        }

        try {
            const result = await toggleWishlist(productId);
            if (result.isFavorite) {
                setFavoriteIds(prev => [...prev, productId]);
                toast.success("❤️ Đã thêm vào danh sách yêu thích!");
            } else {
                setFavoriteIds(prev => prev.filter(id => id !== productId));
                toast.info("💔 Đã xóa khỏi danh sách yêu thích!");
            }
            return result.isFavorite;
        } catch {
            toast.error("Không thể cập nhật danh sách yêu thích!");
            return false;
        }
    }

    return (
        <WishlistContext.Provider
            value={{
                favoriteIds,
                isFavorite,
                toggleFavorite,
                refreshWishlist: loadWishlistIds,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
