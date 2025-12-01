import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Camera, X } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { API_BASE_URL } from "../lib/constants";

interface PetFormProps {
  pet?: any;
  onSubmit: (pet: any) => void;
  onBack: () => void;
}

export function PetForm({ pet, onSubmit, onBack }: PetFormProps) {
  // 1. 초기 상태 설정 (수정 시 기존 데이터 불러오기)
  const [formData, setFormData] = useState({
    name: pet?.name || "",
    gender: pet?.gender || "",
    age: pet?.age || 0,
    size: pet?.size || "",
    birthday: pet?.birthday || "",
    weight: pet?.weight || "", // 입력 편의를 위해 문자열로 관리 (나중에 숫자로 변환)
    personality: pet?.personality || "",
    photo: pet?.photo || "", // 사진 URL
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. 일반 텍스트/선택 입력 핸들러
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // 3. 숫자 입력 핸들러 (나이, 몸무게: 음수 방지)
  const handleNumberChange = (field: string, value: string) => {
    // 빈 값 허용 (입력 중 지울 때)
    if (value === "") {
      setFormData({ ...formData, [field]: "" });
      return;
    }
    
    const num = parseFloat(value);
    // 0 이상의 숫자만 입력 가능
    if (!isNaN(num) && num >= 0) {
      setFormData({ ...formData, [field]: num });
    }
  };

  // 4. 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: uploadData,
        // fetch는 FormData 전송 시 Content-Type을 자동으로 설정함 (multipart/form-data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 서버가 반환한 이미지 경로를 저장 (예: /images/uuid_filename.jpg)
        // 프론트엔드에서 보여줄 때는 앞에 API_BASE_URL을 붙여야 함
        // 하지만 DB에는 '경로'만 저장하는 것이 일반적이므로, 여기서는 전체 URL을 만들어 상태에 저장
        // (백엔드 DB에 전체 URL을 넣을지 상대 경로를 넣을지는 정책 나름이지만, 편의상 전체 URL 사용)
        const fullImageUrl = `${API_BASE_URL}${result.data}`;
        setFormData({ ...formData, photo: fullImageUrl });
      } else {
        alert("이미지 업로드 실패: " + result.message);
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  // 5. 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setFormData({ ...formData, photo: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // input 초기화
    }
  };

  // 6. 제출 핸들러 (유효성 검사)
  const handleSubmit = () => {
    if (!formData.name || !formData.gender || !formData.size) {
        alert("필수 정보(이름, 성별, 크기)를 입력해주세요.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[2520px] mx-auto px-6 lg:px-20 h-20 flex items-center">
          <button onClick={onBack} className="hover:opacity-70 transition-opacity">
            <img src={logoImage} alt="어디가개" className="h-20" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl mb-2">{pet ? "반려동물 수정" : "반려동물 등록"}</h1>
            <p className="text-gray-600">정보를 입력해주세요</p>

            {/* 프로필 사진 영역 */}
            <div className="mt-6 relative group">
                <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                    {formData.photo ? (
                        <img src={formData.photo} alt="Pet Profile" className="w-full h-full object-cover" />
                    ) : (
                        // 사진이 없을 때 기본 아이콘 표시 (투명도 조절)
                        <img src={logoImage} alt="Default" className="w-16 h-16 opacity-30 grayscale" />
                    )}
                </div>
                
                {/* 사진 삭제 버튼 (사진이 있을 때만 표시) */}
                {formData.photo && (
                    <button 
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md transition-colors"
                        title="사진 삭제"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* 사진 업로드 버튼 (카메라 아이콘) */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-50 shadow-sm text-gray-600 transition-colors"
                    title="사진 변경"
                >
                    <Camera className="w-5 h-5" />
                </button>
                {/* 숨겨진 파일 입력창 */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                />
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="space-y-6">
            <div>
                <Label>이름 *</Label>
                <Input 
                    value={formData.name} 
                    onChange={(e) => handleChange("name", e.target.value)} 
                    className="mt-1" 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label>성별 *</Label>
                  <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="MALE">수컷</SelectItem>
                          <SelectItem value="FEMALE">암컷</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label>나이 (살)</Label>
                  <Input 
                      type="number" 
                      min="0" 
                      value={formData.age} 
                      onChange={(e) => handleNumberChange("age", e.target.value)} 
                      className="mt-1" 
                  />
              </div>
            </div>

            <div>
                <Label>크기 *</Label>
                <Select value={formData.size} onValueChange={(val) => handleChange("size", val)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SMALL">소형견</SelectItem>
                        <SelectItem value="MEDIUM">중형견</SelectItem>
                        <SelectItem value="BIG">대형견</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>생일 (YYYYMMDD)</Label>
                <Input 
                    value={formData.birthday} 
                    onChange={(e) => handleChange("birthday", e.target.value)} 
                    className="mt-1" 
                    placeholder="선택사항 (예: 20230101)" 
                    maxLength={8}
                />
            </div>

            <div>
                <Label>몸무게 (kg)</Label>
                <Input 
                    type="number" 
                    min="0" 
                    step="0.1"
                    value={formData.weight} 
                    onChange={(e) => handleNumberChange("weight", e.target.value)} 
                    className="mt-1" 
                    placeholder="선택사항" 
                />
            </div>
            
            {/* 성격 (선택형으로 변경됨) */}
            <div>
                <Label>성격</Label>
                <Select value={formData.personality} onValueChange={(val) => handleChange("personality", val)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="성격을 선택해주세요" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="활발">활발 (에너지 넘침)</SelectItem>
                        <SelectItem value="소심">소심 (낯가림이 있음)</SelectItem>
                        <SelectItem value="평범">평범 (무난해요)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button onClick={onBack} variant="outline" className="flex-1">취소</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
}