import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { FindAccount } from "./components/FindAccount";
import { MyPage } from "./components/MyPage";
import { PetForm } from "./components/PetForm";
import { WizardDialog } from "./components/WizardDialog";
import { FilterDialog, FilterState } from "./components/FilterDialog";
import { SearchPage } from "./components/SearchPage";
import { PlaceDetail } from "./components/PlaceDetail";
import { ThemeSection } from "./components/ThemeSection";
import { MapView } from "./components/MapView";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { API_BASE_URL } from "./lib/constants";

type Page = "main" | "login" | "signup" | "findId" | "findPassword" | "mypage" | "addPet" | "editPet" | "search" | "placeDetail";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("main");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [showWizard, setShowWizard] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filters, setFilters] = useState<FilterState>({ amenities: [], petSizes: [], placeTypes: [] });
  
  const [highlightedPlaceId, setHighlightedPlaceId] = useState<number | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [places, setPlaces] = useState<any[]>([]); 
  const [reviews, setReviews] = useState<any[]>([]); // 리뷰 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    
    if (token && userId && userId !== "undefined") {
        setIsLoggedIn(true);
    } else {
        localStorage.clear();
        setIsLoggedIn(false);
    }

    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/places`);
        const result = await response.json();
        if (result.success) {
          // [수정] PlaceDetail에서 필요한 모든 필드를 매핑합니다.
          const mappedPlaces = result.data.map((p: any) => ({
            id: p.placeId,
            name: p.name,
            // 이미지가 없으면 기본 이미지 사용
            image: p.photos && p.photos.length > 0 ? p.photos[0] : "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1000",
            description: p.address, // 리스트용 간단 설명
            rating: p.avgRating,
            reviewCount: p.reviewCount,
            category: p.category,
            lat: p.latitude || 35.8364,
            lng: p.longitude || 128.7544,
            address: p.address,
            phone: p.phone || "전화번호 없음",
            hours: p.operationHours || "운영시간 정보 없음",
            
            // [중요] 상세 페이지용 추가 필드 매핑
            parking: p.hasParking,
            leadOff: p.isOffLeash,
            maxDogs: 0, // 백엔드에 데이터가 없으면 기본값 0
            allowedSizes: p.allowedSizes || [], // 견종 크기 배열
            details: p.petPolicy || "상세 정보가 없습니다." // 상세 설명
          }));
          setPlaces(mappedPlaces);
        }
      } catch (error) {
        console.error("장소 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // [추가] 장소 클릭 시 리뷰 데이터도 가져오는 로직 (선택 사항)
  const handlePlaceClick = async (placeId: number) => {
    setSelectedPlaceId(placeId);
    
    // 리뷰 데이터 가져오기 (백엔드 API 호출)
    try {
        const res = await fetch(`${API_BASE_URL}/api/places/${placeId}/reviews`);
        const data = await res.json();
        if (data.success) {
            // 리뷰 데이터 매핑
            const mappedReviews = data.data.map((r: any) => ({
                id: r.reviewId,
                placeId: r.placeId,
                userId: r.userId,
                userName: r.userNickname,
                userPhoto: "", // 프로필 사진이 없다면 빈 값
                rating: r.rating,
                content: r.content,
                photos: r.photos,
                date: new Date(r.createdAt).toLocaleDateString()
            }));
            setReviews(mappedReviews);
        }
    } catch (e) {
        console.error("리뷰 로딩 실패", e);
        setReviews([]); // 실패 시 빈 리뷰
    }

    setCurrentPage("placeDetail");
  };

  // ... (handleLoginSuccess, handleLogout 등 기존 함수 유지) ...
  const handleLoginSuccess = (token: string, userOrId: any) => {
    localStorage.setItem("accessToken", token);
    let idToSave = (typeof userOrId === 'object' && userOrId !== null) ? userOrId.userId : userOrId;

    if (idToSave !== undefined && idToSave !== null) {
        localStorage.setItem("userId", idToSave.toString());
        setIsLoggedIn(true);
        setCurrentPage("main");
        toast.success("로그인되었습니다!");
    } else {
        alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false);
    setCurrentPage("main");
    toast.success("로그아웃되었습니다!");
  };

  const handleSearchClick = () => {
    // setSearchQuery("");  // 검색어 유지
    setCurrentPage("search");
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    toast.success("필터가 적용되었습니다!");
  };

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onLogin={handleLoginSuccess} onSignup={() => setCurrentPage("signup")} onFindAccount={(type) => setCurrentPage(type === "id" ? "findId" : "findPassword")} onBack={() => setCurrentPage("main")} />;
      case "signup":
        return <Signup onSignup={() => setCurrentPage("login")} onBack={() => setCurrentPage("main")} />;
      case "findId":
        return <FindAccount type="id" onBack={() => setCurrentPage("login")} />;
      case "findPassword":
        return <FindAccount type="password" onBack={() => setCurrentPage("login")} />;
      case "mypage":
        return <MyPage onBack={() => setCurrentPage("main")} onLogout={handleLogout} />;
      case "placeDetail":
        if (!selectedPlace) return <div className="p-8 text-center">장소 정보를 찾을 수 없습니다.</div>;
        return (
            <PlaceDetail 
                place={selectedPlace} 
                reviews={reviews} // [수정] 가져온 리뷰 전달
                isLoggedIn={isLoggedIn} 
                onBack={() => setCurrentPage("main")} 
                onAddReview={() => { alert("리뷰 작성 기능 준비중"); }}
                onEditReview={() => {}}
                onDeleteReview={() => {}}
            />
        );
      case "search":
        return <SearchPage places={places} initialQuery={searchQuery} onBack={() => setCurrentPage("main")} onPlaceClick={handlePlaceClick} onWizardClick={() => setShowWizard(true)} onFilterClick={() => setShowFilter(true)} isLoggedIn={isLoggedIn} onLoginClick={() => setCurrentPage("login")} onSignupClick={() => setCurrentPage("signup")} onLogoutClick={handleLogout} onMyPageClick={() => setCurrentPage("mypage")} />;
      case "addPet":
        return <PetForm onSubmit={() => {}} onBack={() => setCurrentPage("mypage")} />;
      case "main":
      default:
        return (
          <div className="min-h-screen bg-white">
            <Header isLoggedIn={isLoggedIn} onLoginClick={() => setCurrentPage("login")} onSignupClick={() => setCurrentPage("signup")} onLogoutClick={handleLogout} onMyPageClick={() => setCurrentPage("mypage")} onLogoClick={() => setCurrentPage("main")} onSearchClick={handleSearchClick} onWizardClick={() => setShowWizard(true)} onFilterClick={() => setShowFilter(true)} />
            <main className="max-w-[2520px] mx-auto px-6 lg:px-20 py-12">
              {loading ? <div className="text-center py-20">데이터를 불러오는 중입니다...</div> : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-12">
                    {/* [수정] 각 테마 섹션에 handlePlaceClick 전달 확인 */}
                    {["CAFE", "OUTDOOR", "RESTAURANT", "SWIMMING"].map((category) => (
                      <ThemeSection key={category} category={category} places={places} onPlaceClick={handlePlaceClick} onPlaceHover={setHighlightedPlaceId} />
                    ))}
                  </div>
                  <div className="hidden lg:block lg:col-span-1"><div className="sticky top-24"><MapView places={places} highlightedPlaceId={highlightedPlaceId} onPlaceClick={handlePlaceClick} /></div></div>
                </div>
              )}
            </main>
            <FilterDialog open={showFilter} onClose={() => setShowFilter(false)} onApply={handleFilterApply} />
          </div>
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
      <WizardDialog 
        open={showWizard} 
        onClose={() => setShowWizard(false)} 
        places={places} 
        onPlaceClick={handlePlaceClick} 
      />
    </>
  );
}