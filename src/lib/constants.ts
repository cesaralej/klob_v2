
export const PRODUCT_IMAGE_URL_PATTERN = "https://example.com/images/{sku}.jpg"; // Configurable

export const getProductImageUrl = (sku: string) => {
  if (!sku) return '';
  return PRODUCT_IMAGE_URL_PATTERN.replace("{sku}", sku);
};
