import { useState } from "react";
// [수정] DialogDescription, DialogHeader, DialogTitle 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { X, Car, Wifi, Coffee, UtensilsCrossed, Trees, Waves, Dumbbell, Scissors } from "lucide-react";

export interface FilterState { amenities: string[]; petSizes: string[]; placeTypes: string[]; }
interface FilterDialogProps { open: boolean; onClose: () => void; onApply: (filters: FilterState) => void; }

export function FilterDialog({ open, onClose, onApply }: FilterDialogProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPetSizes, setSelectedPetSizes] = useState<string[]>([]);
  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState<string[]>([]);

  const amenities = [
    { id: "parking", label: "주차", icon: Car }, { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "cafe", label: "카페", icon: Coffee }, { id: "restaurant", label: "음식점", icon: UtensilsCrossed },
    { id: "outdoor", label: "야외", icon: Trees }, { id: "water", label: "물놀이", icon: Waves },
    { id: "exercise", label: "운동", icon: Dumbbell }, { id: "grooming", label: "미용", icon: Scissors },
  ];

  const toggle = (id: string, list: string[], setList: any) => setList(list.includes(id) ? list.filter(item => item !== id) : [...list, id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10 flex justify-between items-center">
          {/* [수정] DialogHeader, Title, Description 추가 */}
          <DialogHeader className="w-full text-left">
             <div className="flex justify-between items-center">
                <DialogTitle className="text-lg">필터</DialogTitle>
                <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
             </div>
             <DialogDescription className="sr-only">
               원하는 조건으로 장소를 검색해보세요.
             </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-6">
          <div className="mb-8"><h3 className="mb-4">편의시설</h3><div className="grid grid-cols-4 gap-3">{amenities.map(a => (
            <button key={a.id} onClick={() => toggle(a.id, selectedAmenities, setSelectedAmenities)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${selectedAmenities.includes(a.id) ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}><a.icon className="w-6 h-6" /><span className="text-xs">{a.label}</span></button>
          ))}</div></div>
          <div className="flex gap-3 pt-4 border-t"><Button onClick={() => {setSelectedAmenities([]); setSelectedPetSizes([]); setSelectedPlaceTypes([]);}} variant="outline" className="flex-1">초기화</Button><Button onClick={() => {onApply({amenities: selectedAmenities, petSizes: selectedPetSizes, placeTypes: selectedPlaceTypes}); onClose();}} className="flex-1 bg-yellow-300 text-gray-900">적용</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}