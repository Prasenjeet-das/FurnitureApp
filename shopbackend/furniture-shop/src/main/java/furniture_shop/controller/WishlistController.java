package furniture_shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import furniture_shop.entity.Wishlist;
import furniture_shop.service.WishlistService;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService service;

    @PostMapping
    public Wishlist saveWishlist(@RequestBody Wishlist wishlist) {
        return service.saveWishlist(wishlist);
    }

    @GetMapping
    public List<Wishlist> getAllWishlist() {
        return service.getAllWishlist();
    }

    @GetMapping("/{id}")
    public Wishlist getWishlistById(@PathVariable Long id) {
        return service.getWishlistById(id);
    }

    @PutMapping("/{id}")
    public Wishlist updateWishlist(@PathVariable Long id,
                                   @RequestBody Wishlist wishlist) {
        return service.updateWishlist(id, wishlist);
    }

    @DeleteMapping("/{id}")
    public String deleteWishlist(@PathVariable Long id) {
        service.deleteWishlist(id);
        return "Wishlist Deleted Successfully";
    }
}