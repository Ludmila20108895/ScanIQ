let favouritesIds: string[] = [];

export function getFavourites() {
  return favouritesIds;
}

export function toggleFavourite(id: string) {
  if (favouritesIds.includes(id)) {
    favouritesIds = favouritesIds.filter((x) => x !== id);
  } else {
    favouritesIds = [...favouritesIds, id];
  }
}
