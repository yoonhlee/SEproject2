import { useState } from "react";
import { ThemeSection } from "./ThemeSection";
import { PlaceCard } from "./PlaceCard";
import { MapView } from "./MapView";
import { Header } from "./Header";
import { FilterDialog, FilterState } from "./FilterDialog";

interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  category: string;
  lat: number;
  lng: number;
  parking: boolean;
  leadOff: boolean;
  maxDogs: number;
  allowedSizes: string[];
}

interface SearchPageProps {
  places: Place[];
  onBack: () => void;
  onPlaceClick: (placeId: number) => void;
  initialQuery?: string;
  onWizardClick?: () => void;
  onFilterClick?: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onMyPageClick: () => void;
  onHome: () => void; // [추가]
}

export function SearchPage({
  places,
  onBack,
  onPlaceClick,
  initialQuery = "",
  onWizardClick,
  onFilterClick,
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onMyPageClick,
  onHome, // [추가]
}: SearchPageProps) {
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<FilterState>({ amenities: [], petSizes: [], placeTypes: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [highlightedPlaceId, setHighlightedPlaceId] = useState<number | null>(null);

  const filteredPlaces = places.filter((place) => {
    const matchesQuery = place.name.includes(inputQuery) || place.description.includes(inputQuery);
    return matchesQuery;
  });

  const handleSearch = () => {
    // 검색 로직
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogoutClick={onLogoutClick}
        onMyPageClick={onMyPageClick}
        onLogoClick={onHome} // [수정] onBack 대신 onHome 연결
        onSearchClick={() => {}}
        onWizardClick={onWizardClick}
        onFilterClick={() => setShowFilters(true)}
        showSearch={true}
        searchMode={true}
        searchQuery={inputQuery}
        onSearchChange={setInputQuery}
        onSearch={handleSearch}
      />

      <FilterDialog open={showFilters} onClose={() => setShowFilters(false)} onApply={setActiveFilters} />

      <div className="max-w-[2520px] mx-auto px-6 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl">검색 결과 {filteredPlaces.length}개</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  {...place}
                  onClick={() => onPlaceClick(place.id)}
                  onHover={() => setHighlightedPlaceId(place.id)}
                  onLeave={() => setHighlightedPlaceId(null)}
                />
              ))}
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <MapView
                places={filteredPlaces}
                highlightedPlaceId={highlightedPlaceId}
                onPlaceClick={onPlaceClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}