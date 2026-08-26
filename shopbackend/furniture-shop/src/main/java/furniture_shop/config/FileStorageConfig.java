package furniture_shop.config;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

import java.io.File;

@Configuration
public class FileStorageConfig {

    public static final String UPLOAD_DIR = "uploads";

    @PostConstruct
    public void init() {

        File uploadFolder = new File(UPLOAD_DIR);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
            System.out.println("Uploads folder created successfully.");
        }
    }
}