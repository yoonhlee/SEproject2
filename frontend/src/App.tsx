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
  // [수정] reviews 상태 삭제 (PlaceDetail에서 직접 관리함)
  const [loading, setLoading] = useState(true);

  // 장소 데이터 매핑 헬퍼
  const mapPlaceData = (data: any[]) => {
    return data.map((p: any) => ({
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
      phone: p.phone || "전화번호 없음",
      hours: p.operationHours || "운영시간 정보 없음",
      parking: p.hasParking,
      leadOff: p.isOffLeash,
      maxDogs: 0,
      allowedSizes: p.allowedSizes || [], 
      details: p.petPolicy || "상세 정보가 없습니다." 
    }));
  };

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
          setPlaces(mapPlaceData(result.data));
        }
      } catch (error) {
        console.error("장소 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handlePlaceClick = (placeId: number) => {
    setSelectedPlaceId(placeId);
    // [수정] 리뷰 로딩 로직 삭제 (PlaceDetail 컴포넌트 내부에서 처리)
    setCurrentPage("placeDetail");
  };

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
    setCurrentPage("search");
  };

  const handleFilterApply = async (newFilters: FilterState) => {
    setFilters(newFilters);
    setLoading(true);

    try {
        const requestBody = {
            hasParking: newFilters.amenities.includes("parking") ? true : null,
            isOutdoor: newFilters.amenities.includes("outdoor") ? true : null,
            dogSizes: newFilters.petSizes.length > 0 ? newFilters.petSizes : null,
            categories: newFilters.placeTypes.length > 0 ? newFilters.placeTypes.map(t => t.toUpperCase()) : null
        };

        const response = await fetch(`${API_BASE_URL}/api/places/filter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        if (result.success) {
            setPlaces(mapPlaceData(result.data));
            toast.success(`총 ${result.data.length}개의 장소를 찾았습니다.`);
            setCurrentPage("search");
        } else {
            toast.error("검색 결과를 가져오지 못했습니다.");
        }
    } catch (error) {
        toast.error("서버 연결 실패");
    } finally {
        setLoading(false);
    }
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
            // [수정] PlaceDetail에 필요한 props만 전달 (불필요한 reviews, 핸들러 제거)
            <PlaceDetail 
                place={selectedPlace} 
                isLoggedIn={isLoggedIn} 
                onBack={() => setCurrentPage("main")} 
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
            <Header 
                isLoggedIn={isLoggedIn} 
                onLoginClick={() => setCurrentPage("login")} 
                onSignupClick={() => setCurrentPage("signup")} 
                onLogoutClick={handleLogout} 
                onMyPageClick={() => setCurrentPage("mypage")} 
                onLogoClick={() => setCurrentPage("main")} 
                onSearchClick={handleSearchClick}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearchClick}
                onWizardClick={() => setShowWizard(true)} 
                onFilterClick={() => setShowFilter(true)} 
            />
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