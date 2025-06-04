export function resolveImageUrl(imageUrl: string, baseUrl: string): string {
  if (imageUrl.includes('cloudfront.net')) return imageUrl;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  return `${baseUrl}${imageUrl}`;
}