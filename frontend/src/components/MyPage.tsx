import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  User,
  Dog,
  Settings,
  Edit2,
} from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { AccountManagement } from "./AccountManagement";
import { PetDetail } from "./PetDetail";
import { PetForm } from "./PetForm"; 
import { PetEditDialog } from "./PetEditDialog";
import { API_BASE_URL } from "../lib/constants"; 

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  size: string;
  gender?: string;
  birthday?: string;
  weight?: number;
  personality?: string;
}

interface Review {
  id: number;
  placeId: number;
  placeName: string;
  rating: number;
  content: string;
  date: string;
}

interface MyPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function MyPage({ onBack, onLogout }: MyPageProps) {
  // 1. 상태 선언 (State)
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [showPetEdit, setShowPetEdit] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);

  // 2. 변수 정의 (Computed Variables) - [중요] 위치가 여기여야 에러가 안 납니다!
  // selectedPetId가 있을 때 pets 배열에서 해당 펫을 찾습니다.
  const selectedPet = selectedPetId ? pets.find((p) => p.id === selectedPetId) : null;

  // 3. 데이터 불러오기 함수
  const fetchMyData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      onLogout();
      return;
    }

    try {
      setLoading(true);
      
      const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!userRes.ok) throw new Error("사용자 정보를 찾을 수 없습니다.");

      const userData = await userRes.json();
      
      if (userData.success) {
          setUser({
              name: userData.data.name || userData.data.nickname,
              nickname: userData.data.nickname,
              email: userData.data.email,
              phone: userData.data.phone || "010-0000-0000",
              birthdate: userData.data.birthdate || "",
              address: userData.data.address || "",
              profilePhoto: userData.data.profileImage
          });
      } else {
          throw new Error(userData.message);
      }

      const petRes = await fetch(`${API_BASE_URL}/api/users/${userId}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const petData = await petRes.json();

      if (petData.success) {
          const mappedPets = petData.data.map((p: any) => ({
              id: p.petId,
              name: p.name,
              breed: "품종 정보 없음", 
              age: p.age,
              size: p.size,
              gender: p.gender,
              birthday: p.birthDate ? p.birthDate.replace(/-/g, "") : "", 
              weight: p.weight,
              personality: p.specialNotes
          }));
          setPets(mappedPets);
      }

    } catch (error: any) {
      console.error("데이터 로딩 실패:", error);
      setError(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchMyData();
  }, [fetchMyData]);

  // 4. 핸들러 함수들
  const handleProfileUpdate = async (newNickname: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          nickname: newNickname,
          email: user.email, 
          name: user.name,
          birthdate: user.birthdate,
          phone: user.phone,
          address: user.address,
          profileImage: user.profilePhoto
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchMyData();
        setShowProfileEdit(false);
      } else {
        alert(result.message || "프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  const handlePetClick = (petId: number) => { setSelectedPetId(petId); };
  const handlePetEdit = () => { setShowPetEdit(true); };
  
  const handlePetDelete = async () => { 
    if (!selectedPetId) return;
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}/pets/${selectedPetId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            alert("반려동물이 삭제되었습니다.");
            setSelectedPetId(null);
            fetchMyData();
        } else {
            alert("삭제에 실패했습니다.");
        }
    } catch (e) {
        alert("오류가 발생했습니다.");
    }
  };

  const formatBirthDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return null;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  const handleAddPetSubmit = async (petData: any) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    
    const requestBody = {
        name: petData.name,
        gender: petData.gender,
        size: petData.size,
        birthDate: formatBirthDate(petData.birthday),
        age: petData.age, 
        weight: Number(petData.weight) || null,
        specialNotes: petData.personality 
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}/pets`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(requestBody),
        });
        if (res.ok) {
            alert("반려동물이 등록되었습니다.");
            setShowAddPet(false);
            fetchMyData(); 
        } else {
            alert("등록에 실패했습니다.");
        }
    } catch (e) { alert("오류가 발생했습니다."); }
  };

  const handleUpdatePetSubmit = async (petData: any) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!selectedPetId) return;

    const requestBody = {
        name: petData.name,
        gender: petData.gender,
        size: petData.size,
        birthDate: formatBirthDate(petData.birthday),
        age: petData.age,
        weight: Number(petData.weight) || null,
        specialNotes: petData.personality
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}/pets/${selectedPetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(requestBody),
        });
        if (res.ok) {
            alert("정보가 수정되었습니다.");
            setShowPetEdit(false);
            fetchMyData();
        } else {
            alert("수정에 실패했습니다.");
        }
    } catch (e) { alert("오류가 발생했습니다."); }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            alert("탈퇴가 완료되었습니다.");
            onLogout();
        } else {
            alert("탈퇴 처리에 실패했습니다.");
        }
    } catch (e) { alert("오류가 발생했습니다."); }
  };

  // 5. 조건부 렌더링 (Return)
  if (loading && !user) return <div className="flex h-screen items-center justify-center">로딩중...</div>;
  
  if (error || !user) return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
        <p className="text-red-500 font-bold">{error || "사용자 정보가 초기화되었습니다."}</p>
        <p className="text-gray-600">서버 재접속 등으로 인해 데이터가 없습니다.<br/>다시 로그인 해주세요.</p>
        <Button onClick={onLogout}>로그아웃</Button>
    </div>
  );

  if (showAddPet) return <PetForm onSubmit={handleAddPetSubmit} onBack={() => setShowAddPet(false)} />;

  if (selectedPet) {
    return (
      <>
        <PetDetail 
            pet={selectedPet} 
            onBack={() => setSelectedPetId(null)} 
            onEdit={handlePetEdit} 
            onDelete={handlePetDelete} 
        />
        {/* 수정 모달: selectedPet이 확실히 있을 때만 렌더링 */}
        {showPetEdit && (
            <PetEditDialog 
                open={showPetEdit} 
                onClose={() => setShowPetEdit(false)} 
                pet={selectedPet} 
                onSave={handleUpdatePetSubmit} 
            />
        )}
      </>
    );
  }

  if (showAccountManagement) {
    return (
      <AccountManagement 
        user={user} 
        onBack={() => setShowAccountManagement(false)} 
        onUserUpdate={fetchMyData} 
        onDeleteAccount={handleDeleteAccount} 
      />
    );
  }

  const profileInitial = user.nickname ? user.nickname.charAt(0) : "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[2520px] mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <button onClick={onBack} className="hover:opacity-70 transition-opacity"><img src={logoImage} alt="어디가개" className="h-20" /></button>
          <Button onClick={onLogout} variant="outline">로그아웃</Button>
        </div>
      </div>

      <div className="max-w-[2520px] mx-auto px-6 lg:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="flex items-center gap-2 mb-6 text-gray-700"><User className="w-5 h-5" /> 사용자 프로필</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4"><span className="text-4xl text-gray-600">{profileInitial}</span></div>
              <h3 className="text-2xl text-gray-900 mb-1">{user.nickname}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-yellow-600 mb-4">반려동물 {pets.length}마리</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowProfileEdit(true)}><Edit2 className="w-4 h-4" /> 수정</Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowAccountManagement(true)}><Settings className="w-4 h-4" /> 계정 관리</Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="flex items-center gap-2 mb-6 text-gray-700"><Dog className="w-5 h-5" /> 반려동물 프로필</h2>
            {pets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">등록된 반려동물이 없습니다.</div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                {pets.map((pet) => (
                    <div key={pet.id} className="border border-gray-200 rounded-xl p-4 relative cursor-pointer hover:border-yellow-300 transition-colors" onClick={() => handlePetClick(pet.id)}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><Dog className="w-6 h-6 text-gray-500" /></div>
                        {/* [수정] 카드 위 수정 버튼을 누르면 이벤트 전파를 막고 바로 수정창을 띄움 */}
                        <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                                e.stopPropagation(); // 카드 클릭(상세페이지 이동) 방지
                                handlePetClick(pet.id); // 선택된 펫 설정
                                setShowPetEdit(true);   // 수정창 열기
                            }}
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                    <h3 className="mb-1">{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{pet.breed}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500"><span>{pet.size}</span></div>
                    </div>
                ))}
                </div>
            )}
            <Button onClick={() => setShowAddPet(true)} variant="outline" className="w-full border-gray-300 hover:bg-gray-50">반려동물 추가하기</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6"><Checkbox id="recent-reviews" /><label htmlFor="recent-reviews" className="text-gray-700 cursor-pointer">최근 작성한 리뷰</label></div>
          <div className="space-y-4 text-center py-4 text-gray-500">작성된 리뷰가 없습니다.</div>
        </div>
      </div>

      <ProfileEditDialog 
        open={showProfileEdit} 
        onClose={() => setShowProfileEdit(false)} 
        currentNickname={user.nickname} 
        profileInitial={profileInitial} 
        onSave={handleProfileUpdate} 
      />
    </div>
  );
}