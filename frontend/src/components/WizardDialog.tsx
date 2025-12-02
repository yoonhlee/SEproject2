import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { PlaceCard } from "./PlaceCard";
import { API_BASE_URL } from "../lib/constants";
import { toast } from "sonner";

interface WizardDialogProps {
  open: boolean;
  onClose: () => void;
  places: any[];
  onPlaceClick: (placeId: number) => void;
}

export function WizardDialog({ open, onClose, onPlaceClick }: WizardDialogProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const handleAnswer = (tag: string) => {
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      fetchRecommendations(newTags);
    }
  };

  // [수정] 추천 API 호출 및 응답 처리 로직 개선
  const fetchRecommendations = async (tags: string[]) => {
    setLoading(true);
    try {
      console.log("보내는 태그:", tags);

      const response = await fetch(`${API_BASE_URL}/api/wizard/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: tags }),
      });
      
      const result = await response.json();
      console.log("받은 데이터:", result); // 로그 확인용
      
      // [핵심 수정] 응답이 배열인지 확인하여 처리
      let placeData = [];
      
      if (Array.isArray(result)) {
          // Case 1: 백엔드가 리스트를 바로 반환한 경우 ([...])
          placeData = result;
      } else if (result.success && Array.isArray(result.data)) {
          // Case 2: 백엔드가 ApiResponse로 감싸서 반환한 경우 ({ success: true, data: [...] })
          placeData = result.data;
      } else {
          toast.error("추천 결과를 가져오지 못했습니다.");
          onClose();
          return;
      }

      // 데이터 매핑
      const mapped = placeData.map((p: any) => ({
          id: p.placeId,
          name: p.name,
          image: p.photos && p.photos.length > 0 
                 ? (p.photos[0].startsWith('http') ? p.photos[0] : `${API_BASE_URL}${p.photos[0]}`)
                 : "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1000",
          description: p.address,
          rating: p.avgRating,
          reviewCount: p.reviewCount,
          category: p.category,
      }));

      setRecommendedPlaces(mapped);
      // 결과 화면으로 강제 이동 (질문 수만큼 스텝을 올림)
      setStep(questions.length);

    } catch (error) {
      console.error("마법사 오류:", error);
      toast.error("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
      <DialogContent className="max-w-4xl min-h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-yellow-400 w-6 h-6" /> 
            {step < questions.length ? "AI 마법사 질문" : "추천 결과"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            반려동물 맞춤 장소 추천 마법사입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center flex-1 py-6">
          {loading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-spin" />
              <div className="text-lg text-gray-600 font-medium">
                댕댕이에게 딱 맞는 장소를 분석 중입니다... 🐶
              </div>
            </div>
          ) : step < questions.length ? (
            // 질문 화면
            <>
              <h3 className="text-2xl font-bold mb-12 text-center break-keep leading-relaxed text-gray-800">
                {questions[step].q}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl px-4">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.tag}
                    onClick={() => handleAnswer(opt.tag)}
                    className="py-6 px-4 border-2 border-gray-100 rounded-2xl hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 text-lg font-medium text-gray-600 hover:text-yellow-900 shadow-sm hover:shadow-md active:scale-95"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-12 flex gap-3">
                {/* 진행 표시 바 */}
                {questions.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${idx === step ? 'bg-yellow-400 scale-110' : 'bg-gray-200'}`} 
                    />
                ))}
              </div>
            </>
          ) : (
            // 결과 화면
            <div className="w-full h-full flex flex-col">
              {recommendedPlaces.length > 0 ? (
                <>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            🎉 이런 장소들은 어떠세요?
                        </h3>
                        <p className="text-gray-500">
                            선택하신 조건에 딱 맞는 장소를 찾았어요!
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full overflow-y-auto max-h-[60vh] px-2">
                        {recommendedPlaces.map((p: any) => (
                        <div key={p.id} className="transform transition-transform hover:-translate-y-1">
                            <PlaceCard 
                                id={p.id}
                                name={p.name}
                                image={p.image}
                                description={p.description}
                                rating={p.rating}
                                reviewCount={p.reviewCount}
                                category={p.category}
                                onClick={() => { 
                                    onPlaceClick(p.id); 
                                    handleClose(); 
                                }} 
                            />
                        </div>
                        ))}
                    </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-4xl">😢</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        조건에 맞는 장소를 찾지 못했어요.
                    </h3>
                    <p className="text-gray-500">
                        조금 더 넓은 범위로 다시 검색해보시겠어요?
                    </p>
                </div>
              )}
              
              <div className="mt-8 flex justify-center pt-4 border-t border-gray-100">
                <Button 
                    onClick={handleReset} 
                    variant="outline"
                    className="gap-2 px-6 border-gray-300 hover:bg-gray-50"
                >
                    <RefreshCw className="w-4 h-4" />
                    처음부터 다시 하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}