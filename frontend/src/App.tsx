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
import { SplashScreen } from "./components/SplashScreen";
import { API_BASE_URL } from "./lib/constants";

type Page = "splash" | "main" | "login" | "signup" | "findId" | "findPassword" | "mypage" | "addPet" | "editPet" | "search" | "placeDetail";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("splash");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filters, setFilters] = useState<FilterState>({ amenities: [], petSizes: [], placeTypes: [] });
  
  const [highlightedPlaceId, setHighlightedPlaceId] = useState<number | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 백엔드 데이터 상태
  const [places, setPlaces] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    // 토큰과 유저ID가 모두 정상적으로 있을 때만 로그인 처리
    if (token && userId && userId !== "undefined") {
        setIsLoggedIn(true);
    } else {
        // 정보가 이상하면 강제 로그아웃 처리
        localStorage.clear();
        setIsLoggedIn(false);
    }

    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/places`);
        const result = await response.json();
        if (result.success) {
          const mappedPlaces = result.data.map((p: any) => ({
            id: p.placeId,
            name: p.name,
            image: p.photos && p.photos.length > 0 ? p.photos[0] : "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1000",
            description: p.address,
            rating: p.avgRating,
            reviewCount: p.reviewCount,
            category: p.category,
            lat: p.latitude || 35.8364,
            lng: p.longitude || 128.7544,
            address: p.address,
            phone: p.phone || "",
            hours: p.operationHours || "",
            details: p.petPolicy || ""
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

  // [수정됨] 로그인 성공 핸들러 (안전장치 추가)
  const handleLoginSuccess = (token: string, userOrId: any) => {
    // 1. 토큰 저장
    localStorage.setItem("accessToken", token);
    
    // 2. ID 추출 및 검증
    let idToSave;
    if (typeof userOrId === 'object' && userOrId !== null) {
        idToSave = userOrId.userId; // 객체라면 userId 필드 사용
    } else {
        idToSave = userOrId; // 숫자라면 그대로 사용
    }

    // 3. ID가 유효한지 확인 후 저장
    if (idToSave !== undefined && idToSave !== null) {
        localStorage.setItem("userId", idToSave.toString());
        setIsLoggedIn(true);
        setCurrentPage("main");
        toast.success("로그인되었습니다!");
    } else {
        console.error("로그인 오류: 유저 ID를 찾을 수 없습니다.", userOrId);
        alert("로그인 처리 중 오류가 발생했습니다. (ID 누락)");
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // 싹 지우기
    setIsLoggedIn(false);
    setCurrentPage("main");
    toast.success("로그아웃되었습니다!");
  };

  const handlePlaceClick = (placeId: number) => {
    setSelectedPlaceId(placeId);
    setCurrentPage("placeDetail");
  };

  const handleSearchClick = () => {
    setSearchQuery("");
    setCurrentPage("search");
  };

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    toast.success("필터가 적용되었습니다! (서버 연동 필요)");
  };

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  const renderPage = () => {
    switch (currentPage) {
      case "splash":
        return <SplashScreen onComplete={() => setCurrentPage("main")} />;
      case "login":
        return <Login onLogin={handleLoginSuccess} onSignup={() => setCurrentPage("signup")} onFindAccount={() => {}} onBack={() => setCurrentPage("main")} />;
      case "signup":
        return <Signup onSignup={() => setCurrentPage("login")} onBack={() => setCurrentPage("main")} />;
      case "mypage":
        return <MyPage onBack={() => setCurrentPage("main")} onLogout={handleLogout} />;
      case "placeDetail":
        if (!selectedPlace) return <div className="p-8">장소를 찾을 수 없습니다.</div>;
        return <PlaceDetail place={selectedPlace} isLoggedIn={isLoggedIn} onBack={() => setCurrentPage("main")} />;
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
                    {["CAFE", "OUTDOOR", "RESTAURANT", "SWIMMING"].map((category) => (
                      <ThemeSection key={category} category={category} places={places} onPlaceClick={handlePlaceClick} onPlaceHover={setHighlightedPlaceId} />
                    ))}
                  </div>
                  <div className="hidden lg:block lg:col-span-1"><div className="sticky top-24"><MapView places={places} highlightedPlaceId={highlightedPlaceId} onPlaceClick={handlePlaceClick} /></div></div>
                </div>
              )}
            </main>
            <WizardDialog open={showWizard} onClose={() => setShowWizard(false)} places={places} onPlaceClick={handlePlaceClick} />
            <FilterDialog open={showFilter} onClose={() => setShowFilter(false)} onApply={handleFilterApply} />
          </div>
        );
    }
  };

  return <>{renderPage()}<Toaster /></>;
}