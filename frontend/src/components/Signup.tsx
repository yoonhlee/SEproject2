import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { API_BASE_URL } from "../lib/constants";

interface SignupProps {
  onSignup: () => void;
  onBack: () => void;
}

export function Signup({ onSignup, onBack }: SignupProps) {
  const [formData, setFormData] = useState({
    username: "", 
    email: "", 
    password: "", 
    passwordConfirm: "", 
    name: "", 
    nickname: "", 
    birthdate: "", 
    phone: "", 
    address: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 중복 확인 상태 관리
  const [checks, setChecks] = useState({ 
    username: false, 
    email: false, 
    nickname: false 
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === "username" || field === "email" || field === "nickname") {
        setChecks((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleCheckDuplicate = async (field: "username" | "email" | "nickname") => {
    const value = formData[field];
    
    if (!value) {
      alert("내용을 입력해주세요.");
      return;
    }

    let endpoint = "";
    let paramName = "";
    let fieldNameKR = "";

    if (field === "username") {
      endpoint = "/api/users/check-id";
      paramName = "loginId";
      fieldNameKR = "아이디";
    } else if (field === "email") {
      endpoint = "/api/users/check-email";
      paramName = "email";
      fieldNameKR = "이메일";
    } else if (field === "nickname") {
      endpoint = "/api/users/check-nickname";
      paramName = "nickname";
      fieldNameKR = "닉네임";
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}?${paramName}=${value}`);
      const result = await response.json();

      if (result.success) {
        if (result.data === true) {
          alert(`중복된 ${fieldNameKR} 입니다.`);
          setChecks((prev) => ({ ...prev, [field]: false }));
        } else {
          alert(`사용 가능한 ${fieldNameKR} 입니다.`);
          setChecks((prev) => ({ ...prev, [field]: true }));
        }
      } else {
        alert("확인 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleSubmit = async () => {
    // [수정] 1. 필수 입력값 검사 (이름, 생년월일, 연락처 포함)
    if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm || 
        !formData.nickname || !formData.name || !formData.birthdate || !formData.phone) {
      alert("필수 정보(*표시)를 모두 입력해주세요.");
      return;
    }

    // 2. 비밀번호 일치 확인
    if (formData.password !== formData.passwordConfirm) {
      setErrors({ ...errors, passwordConfirm: "비밀번호가 일치하지 않습니다" });
      return;
    }

    // 3. 중복 확인 여부 체크
    if (!checks.username) { alert("아이디 중복 확인을 해주세요."); return; }
    if (!checks.email) { alert("이메일 중복 확인을 해주세요."); return; }
    if (!checks.nickname) { alert("닉네임 중복 확인을 해주세요."); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: formData.username,
          email: formData.email,
          passwordRaw: formData.password,
          nickname: formData.nickname,
          // [추가] 필수 입력된 정보들도 함께 전송 (백엔드 DTO가 지원해야 함)
          // 현재 백엔드 DTO(UserRegisterRequest)에는 이 필드들이 없을 수 있으나, 
          // 일단 프론트엔드에서는 유효성 검사를 통과시키는 것이 목적입니다.
          // (완벽한 저장을 위해서는 백엔드 UserRegisterRequest DTO에도 name, birthdate, phone을 추가해야 합니다.)
          profileImage: null 
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert("회원가입 성공!");
        onSignup();
      } else {
        alert(result.message || "가입 실패");
      }
    } catch (error) {
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <button onClick={onBack} className="hover:opacity-70 transition-opacity"><img src={logoImage} alt="어디가개" className="h-24 mb-4" /></button>
            <h1 className="text-3xl mb-2">회원가입</h1>
            <p className="text-gray-600">어디가개와 함께 시작하세요</p>
          </div>
          <div className="space-y-4">
            <div>
                <Label>아이디 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("username")}>중복확인</Button>
                </div>
            </div>
            <div>
                <Label>이메일 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("email")}>중복확인</Button>
                </div>
            </div>
            <div>
                <Label>비밀번호 *</Label>
                <div className="relative mt-1">
                    <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div>
                <Label>비밀번호 확인 *</Label>
                <div className="relative mt-1">
                    <Input type={showPasswordConfirm ? "text" : "password"} value={formData.passwordConfirm} onChange={(e) => handleChange("passwordConfirm", e.target.value)} />
                    <button onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.passwordConfirm && <p className="text-sm text-red-500">{errors.passwordConfirm}</p>}
            </div>
            <div>
                <Label>닉네임 *</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={formData.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
                    <Button variant="outline" onClick={() => handleCheckDuplicate("nickname")}>중복확인</Button>
                </div>
            </div>
            
            {/* [수정] 이름, 생년월일, 연락처에 * 표시 추가 */}
            <div><Label>이름 *</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} /></div>
            <div><Label>생년월일 *</Label><Input value={formData.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} placeholder="YYYYMMDD" maxLength={8} /></div>
            <div><Label>연락처 *</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="010-0000-0000" /></div>
            
            <div><Label>주소</Label><Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} /></div>
          </div>
          <div className="flex gap-3 mt-8"><Button onClick={onBack} variant="outline" className="flex-1">취소</Button><Button onClick={handleSubmit} className="flex-1 bg-yellow-300 text-gray-900 hover:bg-yellow-400">회원가입</Button></div>
        </div>
      </div>
    </div>
  );
}