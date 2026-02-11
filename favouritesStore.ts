let favouritesIds: string[] = [];

export function getFavourites() {
  return favouritesIds;
}

export function toggleFavourite(id: string) {
  // toggle the presence of an item ID in the favourites list
  if (favouritesIds.includes(id)) {
    favouritesIds = favouritesIds.filter((x) => x !== id);
  } else {
    favouritesIds = [...favouritesIds, id];
  }
}
