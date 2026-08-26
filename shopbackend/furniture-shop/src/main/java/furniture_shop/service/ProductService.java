package furniture_shop.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import furniture_shop.entity.Product;

public interface ProductService {

    // Save Product
    Product saveProduct(Product product);

    // Get All Products
    List<Product> getAllProducts();

    // Get Product By ID
    Product getProductById(Long id);

    // Update Product
    Product updateProduct(Long id, Product product);

    // Delete Product
    void deleteProduct(Long id);

    // Upload image for a specific product
    String uploadProductImage(Long productId, MultipartFile file);
}