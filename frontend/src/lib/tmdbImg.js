// OMDB returns full image URLs (or null). Pass them through untouched.
export function imageUrl(path) {
  if (!path || path === "N/A") return null;
  return path;
}
export const posterUrl = (path) => imageUrl(path);
export const backdropUrl = (path) => imageUrl(path);
