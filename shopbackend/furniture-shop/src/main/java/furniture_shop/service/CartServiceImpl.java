package furniture_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import furniture_shop.entity.Cart;
import furniture_shop.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository repository;

    @Override
    public Cart saveCart(Cart cart) {
        return repository.save(cart);
    }

    @Override
    public List<Cart> getAllCarts() {
        return repository.findAll();
    }

    @Override
    public Cart getCartById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Cart updateCart(Long id, Cart cart) {

        Cart existingCart = repository.findById(id).orElse(null);

        if (existingCart != null) {

            existingCart.setUserName(cart.getUserName());
            existingCart.setProductName(cart.getProductName());
            existingCart.setPrice(cart.getPrice());
            existingCart.setQuantity(cart.getQuantity());
            existingCart.setTotalPrice(cart.getTotalPrice());

            return repository.save(existingCart);
        }

        return null;
    }

    @Override
    public void deleteCart(Long id) {
        repository.deleteById(id);
    }
}