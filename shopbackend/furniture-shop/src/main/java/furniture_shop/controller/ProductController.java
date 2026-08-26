package furniture_shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import furniture_shop.entity.Product;
import furniture_shop.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService service;

    // =========================================================
    // SAVE PRODUCT - ADMIN
    // =========================================================

    @PostMapping
    public Product saveProduct(
            @RequestBody Product product) {

        return service.saveProduct(product);
    }

    // =========================================================
    // GET ALL PRODUCTS - PUBLIC
    // =========================================================

    @GetMapping
    public List<Product> getAllProducts() {

        return service.getAllProducts();
    }

    // =========================================================
    // GET PRODUCT BY ID - PUBLIC
    // =========================================================

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id) {

        return service.getProductById(id);
    }

    // =========================================================
    // UPDATE PRODUCT - ADMIN
    // =========================================================

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return service.updateProduct(id, product);
    }

    // =========================================================
    // DELETE PRODUCT - ADMIN
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id) {

        service.deleteProduct(id);

        return ResponseEntity.ok(
                "Product Deleted Successfully"
        );
    }

    // =========================================================
    // UPLOAD PRODUCT IMAGE - ADMIN
    // =========================================================
    //
    // Example:
    // POST /products/5/image
    //
    // Body:
    // Multipart Form
    // file = sofa.jpg
    //
    // =========================================================

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        String imageUrl =
                service.uploadProductImage(id, file);

        return ResponseEntity.ok(imageUrl);
    }
}