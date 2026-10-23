
export default function EventDescription({ description }) {
  if (!description) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-['Playfair_Display',Georgia,serif] text-2xl text-[#f5f2ec]">
        About This Event
      </h2>

      <p className="text-sm leading-8 text-[#aaa8a2]">
        {description}
      </p>
    </section>
  );
}
