import { PlaceCard } from "./PlaceCard";

interface ThemeSectionProps { category: string; places: any[]; onPlaceClick: (id: number) => void; onPlaceHover?: (id: number | null) => void; }

export function ThemeSection({ category, places, onPlaceClick, onPlaceHover }: ThemeSectionProps) {
  // 카테고리 매칭 로직 (백엔드 Enum과 한글 매칭 등 필요시 수정)
  // 현재 백엔드는 영어(CAFE)로 오므로 필터링이 잘 될 것입니다.
  const categoryPlaces = places.filter((place) => place.category === category);
  
  if (categoryPlaces.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl mb-6 font-bold">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {categoryPlaces.map((place) => (
          <PlaceCard 
            key={place.id} 
            {...place} 
            // [확인] 여기서 onPlaceClick이 실행되어야 합니다.
            onClick={() => onPlaceClick(place.id)} 
            onHover={() => onPlaceHover?.(place.id)} 
            onLeave={() => onPlaceHover?.(null)} 
          />
        ))}
      </div>
    </div>
  );
}