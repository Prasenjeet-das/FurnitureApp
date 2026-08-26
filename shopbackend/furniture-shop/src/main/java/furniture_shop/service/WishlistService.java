package furniture_shop.service;

import java.util.List;

import furniture_shop.entity.Wishlist;

public interface WishlistService {

    Wishlist saveWishlist(Wishlist wishlist);

    List<Wishlist> getAllWishlist();

    Wishlist getWishlistById(Long id);

    Wishlist updateWishlist(Long id, Wishlist wishlist);

    void deleteWishlist(Long id);
}