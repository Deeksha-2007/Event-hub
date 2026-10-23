
import { Link } from "react-router-dom";
import { CATEGORY_META, DEFAULT_META, OTHER_CATEGORIES } from "./categoryConfig";

export default function OtherCategories({ currentSlug }) {
  return (
    <section className="mx-auto max-w-[1600px] border-t border-white/8 px-5 py-14 sm:px-10 lg:px-16">
      <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-white/35">
        EXPLORE OTHER CATEGORIES
      </p>

      <div className="flex flex-wrap gap-3">
        {OTHER_CATEGORIES.filter((category) => category.slug !== currentSlug).map(
          (category) => (
            <Link
              key={category.slug}
              to={`/events/category/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/55 transition hover:border-white/25 hover:text-white"
            >
              <span
                style={{
                  color: (CATEGORY_META[category.slug] || DEFAULT_META).accent,
                }}
              >
                {category.emoji}
              </span>
              {category.label}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
