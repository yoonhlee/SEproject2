import { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Plus, Minus } from "lucide-react"; // [수정] Locate 제거됨
import { Button } from "./ui/button";

interface Place { id: number; name: string; lat: number; lng: number; category: string; rating: number; }
interface MapViewProps { places: Place[]; highlightedPlaceId?: number | null; onPlaceClick: (placeId: number) => void; }

export function MapView({ places, highlightedPlaceId, onPlaceClick }: MapViewProps) {
  const [center, setCenter] = useState({ lat: 35.8364, lng: 128.7544 });
  const [level, setLevel] = useState(5);

  useEffect(() => {
    if (highlightedPlaceId) {
      const target = places.find((p) => p.id === highlightedPlaceId);
      if (target) { setCenter({ lat: target.lat, lng: target.lng }); setLevel(4); }
    }
  }, [highlightedPlaceId, places]);

  // [삭제] handleLocateMe 함수 제거됨

  return (
    <div className="relative w-full h-[calc(100vh-120px)] bg-gray-100 rounded-2xl overflow-hidden">
      <Map center={center} level={level} style={{ width: "100%", height: "100%" }} onZoomChanged={(map) => setLevel(map.getLevel())}>
        {places.map((place) => (
          <MapMarker 
            key={place.id} 
            position={{ lat: place.lat, lng: place.lng }} 
            onClick={() => onPlaceClick(place.id)} 
            image={{ 
                src: highlightedPlaceId === place.id ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" : "https://t1.daumcdn.net/mapjsapi/images/marker.png", 
                size: highlightedPlaceId === place.id ? { width: 29, height: 42 } : { width: 24, height: 35 } 
            }} 
            title={place.name} 
          />
        ))}
      </Map>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button variant="secondary" size="icon" onClick={() => setLevel(Math.max(level - 1, 1))}><Plus className="w-5 h-5" /></Button>
        <Button variant="secondary" size="icon" onClick={() => setLevel(Math.min(level + 1, 14))}><Minus className="w-5 h-5" /></Button>
        {/* [삭제] 내 위치 찾기 버튼 제거됨 */}
      </div>
    </div>
  );
}