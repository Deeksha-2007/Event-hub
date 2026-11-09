
/** Converts a category name to a URL slug. */
export function categoryToSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Converts a URL slug back to a human-readable label. */
export function slugToLabel(slug) {
  const map = {
    music: "Music",
    technology: "Technology",
    business: "Business",
    workshops: "Workshops",
    "food-drinks": "Food & Drinks",
    entertainment: "Entertainment",
    wellness: "Wellness",
    social: "Social",
    adventure: "Adventure",
  };
  return map[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** All canonical categories derived from the dataset. */
export const CATEGORIES = [
  { slug: "music", label: "Music" },
  { slug: "technology", label: "Technology" },
  { slug: "business", label: "Business" },
  { slug: "workshops", label: "Workshops" },
  { slug: "food-drinks", label: "Food & Drinks" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "wellness", label: "Wellness" },
];
