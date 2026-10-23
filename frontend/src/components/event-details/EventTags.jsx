
export default function EventTags({ tags = [] }) {
  if (!tags.length) return null;

  return (
    <div className="mb-10 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-white/50"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
