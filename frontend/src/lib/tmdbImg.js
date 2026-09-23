const IMAGE = "https://image.tmdb.org/t/p";

export function imageUrl(path, size = "w500") {
  return path ? `${IMAGE}/${size}${path}` : null;
}
export const posterUrl = (path) => imageUrl(path, "w500");
export const backdropUrl = (path) => imageUrl(path, "original");
