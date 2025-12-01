import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { PlaceCard } from "./PlaceCard";
import { API_BASE_URL } from "../lib/constants";
import { toast } from "sonner";

interface WizardDialogProps {
  open: boolean;
  onClose: () => void;
  places: any[]; // 메인에서 넘겨받은 전체 데이터는 사용하지 않고, 추천 API 결과를 씁니다.
  onPlaceClick: (placeId: number) => void;
}

export function WizardDialog({ open, onClose, onPlaceClick }: WizardDialogProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState<any[]>([]);
  
  // 선택한 태그들을 저장할 배열
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // [질문 정의] 요청하신 3가지 질문과 매핑될 백엔드 태그
  const questions = [
    { 
      id: 1, 
      q: "Q1. 댕댕이의 크기는 어떤가요?", 
      options: [
        { label: "소형견", tag: "SMALL" },
        { label: "중형견", tag: "MEDIUM" },
        { label: "대형견", tag: "LARGE" }
      ]
    },
    { 
      id: 2, 
      q: "Q2. 오늘 댕댕이의 컨디션은 어떤가요?", 
      options: [
        { label: "활발함 (뛰어놀고 싶어요!)", tag: "ENERGY_HIGH" },
        { label: "조용함 (쉬고 싶어요)", tag: "ENERGY_LOW" }
      ]
    },
    { 
      id: 3, 
      q: "Q3. 어떤 종류의 장소를 선호하시나요?", 
      options: [
        { label: "자연친화적", tag: "TYPE_NATURE" },
        { label: "도시적", tag: "TYPE_CITY" },
        { label: "프라이빗", tag: "TYPE_PRIVATE" }
      ]
    }
  ];

  // 답변 선택 핸들러
  const handleAnswer = (tag: string) => {
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);

    if (step < questions.length - 1) {
      // 다음 질문으로 이동
      setStep(step + 1);
    } else {
      // 마지막 질문이면 추천 API 호출
      fetchRecommendations(newTags);
    }
  };

  // 추천 API 호출
  const fetchRecommendations = async (tags: string[]) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/wizard/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            tags: tags,
            // 위치 정보가 있다면 추가 가능
            // userLatitude: ..., 
            // userLongitude: ...
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 데이터 매핑 (App.tsx와 동일한 구조로)
        const mapped = result.data.map((p: any) => ({
            id: p.placeId,
            name: p.name,
            image: p.photos && p.photos.length > 0 ? p.photos[0] : "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1000",
            description: p.address,
            rating: p.avgRating,
            reviewCount: p.reviewCount,
            category: p.category,
        }));
        setRecommendedPlaces(mapped);
        setStep(step + 1); // 결과 화면으로 이동
      } else {
        toast.error("추천 결과를 가져오지 못했습니다.");
        onClose(); // 실패 시 닫기
      }
    } catch (error) {
      console.error(error);
      toast.error("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기화 핸들러
  const handleReset = () => {
    setStep(0);
    setSelectedTags([]);
    setRecommendedPlaces([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl min-h-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-yellow-400 w-6 h-6" /> 
            {step < questions.length ? "마법사 질문" : "추천 결과"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            반려동물 맞춤 장소 추천 마법사입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 flex-1">
          {loading ? (
            <div className="text-lg text-gray-600 animate-pulse">
              댕댕이에게 딱 맞는 장소를 찾는 중... 🐶
            </div>
          ) : step < questions.length ? (
            <>
              <h3 className="text-2xl font-bold mb-10 text-center break-keep">
                {questions[step].q}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.tag}
                    onClick={() => handleAnswer(opt.tag)}
                    className="p-6 border-2 border-gray-100 rounded-2xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-lg font-medium text-gray-700 hover:text-yellow-800 shadow-sm hover:shadow-md"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex gap-2">
                {/* 진행 표시 바 (Dots) */}
                {questions.map((_, idx) => (
                    <div key={idx} className={`h-2 w-2 rounded-full ${idx === step ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full">
              {recommendedPlaces.length > 0 ? (
                <>
                    <h3 className="text-xl mb-6 text-center">
                        이런 장소들은 어떠세요?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {recommendedPlaces.map((p: any) => (
                        <PlaceCard 
                            key={p.id} 
                            {...p} 
                            onClick={() => { onPlaceClick(p.id); handleClose(); }} 
                        />
                        ))}
                    </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                    <p className="text-xl mb-2">앗, 조건에 맞는 장소가 없어요. 😢</p>
                    <p className="text-sm">다른 조건으로 다시 찾아볼까요?</p>
                </div>
              )}
              
              <div className="mt-8 flex justify-center">
                <Button onClick={handleReset} className="bg-yellow-300 text-gray-900 hover:bg-yellow-400 px-8">
                    다시 하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}