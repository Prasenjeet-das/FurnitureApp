package furniture_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import furniture_shop.entity.Wishlist;
import furniture_shop.repository.WishlistRepository;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository repository;

    @Override
    public Wishlist saveWishlist(Wishlist wishlist) {
        return repository.save(wishlist);
    }

    @Override
    public List<Wishlist> getAllWishlist() {
        return repository.findAll();
    }

    @Override
    public Wishlist getWishlistById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Wishlist updateWishlist(Long id, Wishlist wishlist) {

        Wishlist existing = repository.findById(id).orElse(null);

        if(existing != null) {

            existing.setUserName(wishlist.getUserName());
            existing.setProductName(wishlist.getProductName());
            existing.setPrice(wishlist.getPrice());

            return repository.save(existing);
        }

        return null;
    }

    @Override
    public void deleteWishlist(Long id) {
        repository.deleteById(id);
    }

}