package furniture_shop.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import furniture_shop.entity.Product;
import furniture_shop.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository repository;

    // =========================================================
    // UPLOAD DIRECTORY
    // =========================================================

    private static final String UPLOAD_DIR =
            "uploads/products/";

    // =========================================================
    // MAXIMUM FILE SIZE
    // =========================================================

    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024; // 5 MB

    // =========================================================
    // ALLOWED CONTENT TYPES
    // =========================================================

    private static final List<String> ALLOWED_CONTENT_TYPES =
            List.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );

    // =========================================================
    // ALLOWED EXTENSIONS
    // =========================================================

    private static final List<String> ALLOWED_EXTENSIONS =
            List.of(
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
            );

    // =========================================================
    // SAVE PRODUCT
    // =========================================================

    @Override
    public Product saveProduct(Product product) {

        return repository.save(product);
    }

    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    @Override
    public List<Product> getAllProducts() {

        return repository.findAll();
    }

    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @Override
    public Product getProductById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @Override
    public Product updateProduct(
            Long id,
            Product product) {

        Product existingProduct =
                repository.findById(id)
                        .orElse(null);

        if (existingProduct != null) {

            existingProduct.setProductName(
                    product.getProductName()
            );

            existingProduct.setDescription(
                    product.getDescription()
            );

            existingProduct.setPrice(
                    product.getPrice()
            );

            existingProduct.setQuantity(
                    product.getQuantity()
            );

            existingProduct.setCategory(
                    product.getCategory()
            );

            existingProduct.setImageUrl(
                    product.getImageUrl()
            );

            return repository.save(existingProduct);
        }

        return null;
    }

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @Override
    public void deleteProduct(Long id) {

        repository.deleteById(id);
    }

    // =========================================================
    // UPLOAD IMAGE FOR PRODUCT
    // =========================================================

    @Override
    public String uploadProductImage(
            Long productId,
            MultipartFile file) {

        // -----------------------------------------------------
        // STEP 1: CHECK PRODUCT
        // -----------------------------------------------------

        Product product =
                repository.findById(productId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Product not found with ID: "
                                                + productId
                                )
                        );

        // -----------------------------------------------------
        // STEP 2: VALIDATE IMAGE
        // -----------------------------------------------------

        validateImage(file);

        Path targetLocation = null;

        try {

            // -------------------------------------------------
            // STEP 3: CREATE UPLOAD DIRECTORY
            // -------------------------------------------------

            Path uploadPath =
                    Paths.get(UPLOAD_DIR)
                            .toAbsolutePath()
                            .normalize();

            Files.createDirectories(uploadPath);

            // -------------------------------------------------
            // STEP 4: GET ORIGINAL FILE EXTENSION
            // -------------------------------------------------

            String originalFilename =
                    file.getOriginalFilename();

            String extension =
                    getFileExtension(originalFilename)
                            .toLowerCase();

            // -------------------------------------------------
            // STEP 5: GENERATE SECURE SERVER FILENAME
            // -------------------------------------------------

            String newFilename =
                    UUID.randomUUID().toString()
                            + extension;

            // -------------------------------------------------
            // STEP 6: CREATE TARGET LOCATION
            // -------------------------------------------------

            targetLocation =
                    uploadPath
                            .resolve(newFilename)
                            .normalize();

            // -------------------------------------------------
            // STEP 7: PATH TRAVERSAL PROTECTION
            // -------------------------------------------------

            if (!targetLocation.startsWith(uploadPath)) {

                throw new IllegalArgumentException(
                        "Invalid file path."
                );
            }

            // -------------------------------------------------
            // STEP 8: SAVE IMAGE
            // -------------------------------------------------

            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // -------------------------------------------------
            // STEP 9: CREATE IMAGE URL
            // -------------------------------------------------

            String imageUrl =
                    "/uploads/products/"
                            + newFilename;

            // -------------------------------------------------
            // STEP 10: UPDATE PRODUCT
            // -------------------------------------------------

            product.setImageUrl(imageUrl);

            repository.save(product);

            // -------------------------------------------------
            // STEP 11: RETURN IMAGE URL
            // -------------------------------------------------

            return imageUrl;

        } catch (IOException e) {

            // -------------------------------------------------
            // CLEANUP IF FILE WAS CREATED BUT DB UPDATE FAILED
            // -------------------------------------------------

            if (targetLocation != null) {

                try {

                    Files.deleteIfExists(
                            targetLocation
                    );

                } catch (IOException ignored) {
                    // Ignore cleanup exception
                }
            }

            throw new RuntimeException(
                    "Failed to upload product image.",
                    e
            );
        }
    }

    // =========================================================
    // IMAGE VALIDATION
    // =========================================================

    private void validateImage(
            MultipartFile file) {

        // -----------------------------------------------------
        // FILE REQUIRED
        // -----------------------------------------------------

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Image file is required."
            );
        }

        // -----------------------------------------------------
        // MAXIMUM FILE SIZE
        // -----------------------------------------------------

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new IllegalArgumentException(
                    "Maximum file size is 5 MB."
            );
        }

        // -----------------------------------------------------
        // CONTENT TYPE VALIDATION
        // -----------------------------------------------------

        String contentType =
                file.getContentType();

        if (contentType == null ||
                !ALLOWED_CONTENT_TYPES.contains(
                        contentType.toLowerCase())) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
        }

        // -----------------------------------------------------
        // ORIGINAL FILENAME VALIDATION
        // -----------------------------------------------------

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null ||
                originalFilename.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid image filename."
            );
        }

        // -----------------------------------------------------
        // EXTENSION VALIDATION
        // -----------------------------------------------------

        String extension =
                getFileExtension(originalFilename)
                        .toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {

            throw new IllegalArgumentException(
                    "Invalid image extension."
            );
        }

        // -----------------------------------------------------
        // ACTUAL IMAGE SIGNATURE VALIDATION
        // -----------------------------------------------------

        try (InputStream inputStream =
                     file.getInputStream()) {

            byte[] header =
                    new byte[12];

            int bytesRead =
                    inputStream.read(header);

            if (!isValidImageSignature(
                    header,
                    bytesRead,
                    extension)) {

                throw new IllegalArgumentException(
                        "The uploaded file is not a valid image."
                );
            }

        } catch (IOException e) {

            throw new IllegalArgumentException(
                    "Unable to validate image file.",
                    e
            );
        }
    }

    // =========================================================
    // IMAGE SIGNATURE VALIDATION
    // =========================================================

    private boolean isValidImageSignature(
            byte[] header,
            int bytesRead,
            String extension) {

        if (bytesRead < 4) {
            return false;
        }

        // -----------------------------------------------------
        // JPG / JPEG
        // -----------------------------------------------------

        if (extension.equals(".jpg") ||
                extension.equals(".jpeg")) {

            return (header[0] & 0xFF) == 0xFF &&
                    (header[1] & 0xFF) == 0xD8 &&
                    (header[2] & 0xFF) == 0xFF;
        }

        // -----------------------------------------------------
        // PNG
        // -----------------------------------------------------

        if (extension.equals(".png")) {

            return bytesRead >= 8 &&
                    (header[0] & 0xFF) == 0x89 &&
                    (header[1] & 0xFF) == 0x50 &&
                    (header[2] & 0xFF) == 0x4E &&
                    (header[3] & 0xFF) == 0x47 &&
                    (header[4] & 0xFF) == 0x0D &&
                    (header[5] & 0xFF) == 0x0A &&
                    (header[6] & 0xFF) == 0x1A &&
                    (header[7] & 0xFF) == 0x0A;
        }

        // -----------------------------------------------------
        // WEBP
        // -----------------------------------------------------

        if (extension.equals(".webp")) {

            return bytesRead >= 12 &&
                    header[0] == 'R' &&
                    header[1] == 'I' &&
                    header[2] == 'F' &&
                    header[3] == 'F' &&
                    header[8] == 'W' &&
                    header[9] == 'E' &&
                    header[10] == 'B' &&
                    header[11] == 'P';
        }

        return false;
    }

    // =========================================================
    // GET FILE EXTENSION
    // =========================================================

    private String getFileExtension(
            String filename) {

        int lastDotIndex =
                filename.lastIndexOf(".");

        if (lastDotIndex == -1) {

            return "";
        }

        return filename.substring(
                lastDotIndex
        );
    }
}