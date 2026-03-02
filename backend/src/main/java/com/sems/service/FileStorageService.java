package com.sems.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "webp");
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/webp");

    public String storeFile(MultipartFile file) throws IOException {
        return storeAndCompressFile(file, 1024, 1024, 0.8f);
    }

    public String storeAndCompressFile(MultipartFile file, int maxWidth, int maxHeight, float quality)
            throws IOException {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("Could not get original filename");
        }
        originalFilename = StringUtils.cleanPath(originalFilename);
        String extension = getFileExtension(originalFilename).toLowerCase();

        // Always save as jpg or png for better compatibility after compression
        String targetExtension = extension.equals("png") ? "png" : "jpg";
        String filename = UUID.randomUUID().toString() + "." + targetExtension;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);

        // Use Thumbnailator for compression and resizing
        net.coobird.thumbnailator.Thumbnails.of(file.getInputStream())
                .size(maxWidth, maxHeight)
                .outputQuality(quality)
                .toFile(filePath.toFile());

        return "/uploads/" + filename;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null
                || !ALLOWED_EXTENSIONS.contains(getFileExtension(originalFilename).toLowerCase())) {
            throw new RuntimeException("Invalid file extension.");
        }
    }

    private String getFileExtension(String filename) {
        int lastIndex = filename.lastIndexOf('.');
        if (lastIndex == -1) {
            return "";
        }
        return filename.substring(lastIndex + 1);
    }
}
