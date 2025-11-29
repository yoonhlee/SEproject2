import { PlaceCard } from "./PlaceCard";

interface ThemeSectionProps { category: string; places: any[]; onPlaceClick: (id: number) => void; onPlaceHover?: (id: number | null) => void; }

export function ThemeSection({ category, places, onPlaceClick, onPlaceHover }: ThemeSectionProps) {
  const categoryPlaces = places.filter((place) => place.category === category);
  if (categoryPlaces.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl mb-6">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {categoryPlaces.map((place) => (
          <PlaceCard key={place.id} {...place} onClick={() => onPlaceClick(place.id)} onHover={() => onPlaceHover?.(place.id)} onLeave={() => onPlaceHover?.(null)} />
        ))}
      </div>
    </div>
  );
}