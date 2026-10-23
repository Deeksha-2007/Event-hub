
export default function EventLoading() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#d5b68a]" />

        <p className="text-sm text-white/40">
          Loading event…
        </p>
      </div>
    </div>
  );
}
