package com.example.backend.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Utility class to automatically assign appropriate images to equipment
 * based on their category or name.
 */
public class EquipmentImageMapper {

    // Image URLs mapped by category
    private static final Map<String, String> CATEGORY_IMAGE_MAP = new HashMap<>();
    
    // Image URLs mapped by keywords in equipment name
    private static final Map<String, String> NAME_KEYWORD_IMAGE_MAP = new HashMap<>();
    
    // Default fallback image
    private static final String DEFAULT_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop";
    
    static {
        // Initialize category-based image mapping
        CATEGORY_IMAGE_MAP.put("Tractor", "https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp");
        CATEGORY_IMAGE_MAP.put("Harvester", "https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg");
        CATEGORY_IMAGE_MAP.put("Combine Harvester", "https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg");
        CATEGORY_IMAGE_MAP.put("Plow", "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Irrigation", "https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Seeder", "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Sprayer", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Cultivator", "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Rotavator", "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Thresher", "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Loader", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop");
        CATEGORY_IMAGE_MAP.put("Other", "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop");
        
        // Initialize name keyword-based image mapping (for more specific matching)
        NAME_KEYWORD_IMAGE_MAP.put("john deere", "https://www.deere.co.in/assets/images/region-1/products/tractors/d-series-tractors/john-deere-india-d-series-tractors.jpg");
        NAME_KEYWORD_IMAGE_MAP.put("mahindra", "https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp");
        NAME_KEYWORD_IMAGE_MAP.put("pump", "https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop");
        NAME_KEYWORD_IMAGE_MAP.put("water pump", "https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop");
        NAME_KEYWORD_IMAGE_MAP.put("sprayer", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop");
        NAME_KEYWORD_IMAGE_MAP.put("power sprayer", "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop");
        NAME_KEYWORD_IMAGE_MAP.put("combine", "https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg");
        NAME_KEYWORD_IMAGE_MAP.put("harvester", "https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg");
        NAME_KEYWORD_IMAGE_MAP.put("rotavator", "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop");
        NAME_KEYWORD_IMAGE_MAP.put("mini tractor", "https://image.made-in-china.com/2f0j00gvuWcpjonBYn/Tractor-4X4-Mini-Farm-4WD-Compact-Tractor-Compact-Mini-Garden-Tractors-for-Agriculture.jpg");
    }
    
    /**
     * Get appropriate image URL for equipment based on category and name.
     * Priority: 1) Name keywords, 2) Category, 3) Default image
     * 
     * @param equipmentName The name of the equipment
     * @param category The category of the equipment
     * @return URL of the appropriate image
     */
    public static String getImageForEquipment(String equipmentName, String category) {
        // If equipment name or category is null, return default
        if (equipmentName == null && category == null) {
            return DEFAULT_IMAGE;
        }
        
        // First, try to match by name keywords (more specific)
        if (equipmentName != null) {
            String lowerName = equipmentName.toLowerCase();
            for (Map.Entry<String, String> entry : NAME_KEYWORD_IMAGE_MAP.entrySet()) {
                if (lowerName.contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }
        
        // Second, try to match by category
        if (category != null) {
            String categoryImage = CATEGORY_IMAGE_MAP.get(category);
            if (categoryImage != null) {
                return categoryImage;
            }
            
            // Try case-insensitive category match
            for (Map.Entry<String, String> entry : CATEGORY_IMAGE_MAP.entrySet()) {
                if (entry.getKey().equalsIgnoreCase(category)) {
                    return entry.getValue();
                }
            }
        }
        
        // Fall back to default image
        return DEFAULT_IMAGE;
    }
    
    /**
     * Get image URL for a specific category.
     * 
     * @param category The category
     * @return URL of the category image, or default if not found
     */
    public static String getImageForCategory(String category) {
        if (category == null) {
            return DEFAULT_IMAGE;
        }
        return CATEGORY_IMAGE_MAP.getOrDefault(category, DEFAULT_IMAGE);
    }
    
    /**
     * Check if an equipment already has a custom image set.
     * 
     * @param imageUrl The current image URL
     * @return true if custom image exists and is not empty
     */
    public static boolean hasCustomImage(String imageUrl) {
        return imageUrl != null && !imageUrl.trim().isEmpty();
    }
}
