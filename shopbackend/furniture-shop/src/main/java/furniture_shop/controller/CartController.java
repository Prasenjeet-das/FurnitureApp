package furniture_shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import furniture_shop.entity.Cart;
import furniture_shop.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService service;

    @PostMapping
    public Cart saveCart(@RequestBody Cart cart) {
        return service.saveCart(cart);
    }

    @GetMapping
    public List<Cart> getAllCarts() {
        return service.getAllCarts();
    }

    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Long id) {
        return service.getCartById(id);
    }

    @PutMapping("/{id}")
    public Cart updateCart(@PathVariable Long id,
                           @RequestBody Cart cart) {
        return service.updateCart(id, cart);
    }

    @DeleteMapping("/{id}")
    public String deleteCart(@PathVariable Long id) {
        service.deleteCart(id);
        return "Cart Deleted Successfully";
    }
}