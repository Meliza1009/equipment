/**
 * Equipment Image Mapper - Frontend Utility
 * Automatically assigns appropriate images to equipment based on category or name
 */

export interface CategoryImage {
  category: string;
  imageUrl: string;
  description: string;
}

// Image URLs mapped by category
const categoryImageMap: Record<string, string> = {
  'Tractor': 'https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp',
  'Harvester': 'https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg',
  'Combine Harvester': 'https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg',
  'Plow': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop',
  'Irrigation': 'https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop',
  'Seeder': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop',
  'Sprayer': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop',
  'Cultivator': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop',
  'Rotavator': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop',
  'Thresher': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop',
  'Loader': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
  'Other': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop',
};

// Image URLs mapped by keywords in equipment name
const nameKeywordImageMap: Record<string, string> = {
  'john deere': 'https://www.deere.co.in/assets/images/region-1/products/tractors/d-series-tractors/john-deere-india-d-series-tractors.jpg',
  'mahindra': 'https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp',
  'pump': 'https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop',
  'water pump': 'https://images.unsplash.com/photo-1624948725165-9a8501bfa5bf?w=800&auto=format&fit=crop',
  'sprayer': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop',
  'power sprayer': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop',
  'combine': 'https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg',
  'harvester': 'https://db58mjtjr0n9n.cloudfront.net/wp-content/uploads/2019/03/27161607/S690-combine-harvester.jpg',
  'rotavator': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop',
  'mini tractor': 'https://image.made-in-china.com/2f0j00gvuWcpjonBYn/Tractor-4X4-Mini-Farm-4WD-Compact-Tractor-Compact-Mini-Garden-Tractors-for-Agriculture.jpg',
};

// Default fallback image
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop';

/**
 * Get appropriate image URL for equipment based on category and name.
 * Priority: 1) Name keywords, 2) Category, 3) Default image
 */
export const getImageForEquipment = (equipmentName?: string, category?: string): string => {
  // If equipment name or category is null, return default
  if (!equipmentName && !category) {
    return DEFAULT_IMAGE;
  }

  // First, try to match by name keywords (more specific)
  if (equipmentName) {
    const lowerName = equipmentName.toLowerCase();
    for (const [keyword, imageUrl] of Object.entries(nameKeywordImageMap)) {
      if (lowerName.includes(keyword)) {
        return imageUrl;
      }
    }
  }

  // Second, try to match by category
  if (category) {
    const categoryImage = categoryImageMap[category];
    if (categoryImage) {
      return categoryImage;
    }

    // Try case-insensitive category match
    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(categoryImageMap)) {
      if (key.toLowerCase() === lowerCategory) {
        return value;
      }
    }
  }

  // Fall back to default image
  return DEFAULT_IMAGE;
};

/**
 * Get image URL for a specific category.
 */
export const getImageForCategory = (category: string): string => {
  if (!category) {
    return DEFAULT_IMAGE;
  }
  return categoryImageMap[category] || DEFAULT_IMAGE;
};

/**
 * Check if an equipment already has a custom image set.
 */
export const hasCustomImage = (imageUrl?: string): boolean => {
  return !!imageUrl && imageUrl.trim() !== '';
};

/**
 * Get all available category images
 */
export const getAllCategoryImages = (): CategoryImage[] => {
  return Object.entries(categoryImageMap).map(([category, imageUrl]) => ({
    category,
    imageUrl,
    description: `Default image for ${category} equipment`,
  }));
};

/**
 * Get equipment image with fallback handling
 */
export const getEquipmentImageWithFallback = (
  customImage?: string,
  equipmentName?: string,
  category?: string
): string => {
  // If custom image exists, use it
  if (hasCustomImage(customImage)) {
    return customImage!;
  }

  // Otherwise, auto-assign based on name/category
  return getImageForEquipment(equipmentName, category);
};
