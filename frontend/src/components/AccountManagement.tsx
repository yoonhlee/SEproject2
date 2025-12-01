import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, Trash2, Check, AlertCircle } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { API_BASE_URL } from "../lib/constants";
import { toast } from "sonner";

interface AccountManagementProps {
  user: any;
  onBack: () => void;
  onUserUpdate: () => void; 
  onDeleteAccount: () => void;
  onHome: () => void; // [추가]
}

export function AccountManagement({ user, onBack, onUserUpdate, onDeleteAccount, onHome }: AccountManagementProps) {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    name: "",
    birthdate: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [checks, setChecks] = useState({ nickname: true, email: true }); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        email: user.email || "",
        name: user.name || "",
        birthdate: user.birthdate || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "nickname") {
      setChecks((prev) => ({ ...prev, nickname: value === user.nickname }));
    }
    if (field === "email") {
      setChecks((prev) => ({ ...prev, email: value === user.email }));
    }
  };

  const handleCheckDuplicate = async (field: "email" | "nickname") => {
    const value = formData[field];
    if (!value) return;
    if (value === user[field]) {
      alert("현재 사용 중인 정보입니다.");
      setChecks((prev) => ({ ...prev, [field]: true }));
      return;
    }

    try {
      const endpoint = field === "email" ? "/api/users/check-email" : "/api/users/check-nickname";
      const paramName = field;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}?${paramName}=${value}`);
      const result = await response.json();

      if (result.success) {
        if (result.data === true) {
          alert(`이미 존재하는 ${field === "email" ? "이메일" : "닉네임"}입니다.`);
          setChecks((prev) => ({ ...prev, [field]: false }));
        } else {
          alert(`사용 가능한 ${field === "email" ? "이메일" : "닉네임"}입니다.`);
          setChecks((prev) => ({ ...prev, [field]: true }));
        }
      }
    } catch (e) {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSaveInfo = async () => {
    if (!checks.nickname) { alert("닉네임 중복 확인이 필요합니다."); return; }
    if (!checks.email) { alert("이메일 중복 확인이 필요합니다."); return; }

    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          profileImage: user.profilePhoto 
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("회원 정보가 수정되었습니다.");
        onUserUpdate(); 
      } else {
        alert(result.message || "수정에 실패했습니다.");
      }
    } catch (e) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });
      const result = await response.json();
      if (result.success) {
        alert("비밀번호가 변경되었습니다.");
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        alert(result.message);
      }
    } catch (e) {
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[800px] mx-auto px-6 h-20 flex items-center gap-4">
          {/* [수정] 로고 클릭 시 메인 화면으로 이동 */}
          <button onClick={onHome}>
            <img src={logoImage} alt="어디가개" className="h-20" />
          </button>
          <h1 className="text-xl font-bold">계정 관리</h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-gray-700 font-medium">
              <Settings className="w-5 h-5" /> 내 정보 수정
            </h2>
            <Button onClick={handleSaveInfo} className="bg-yellow-300 text-gray-900 hover:bg-yellow-400">
              전체 저장
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>이름</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="이름" /></div>
              <div><Label>생년월일</Label><Input value={formData.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} placeholder="YYYYMMDD" maxLength={8} /></div>
            </div>
            <div><Label>닉네임 *</Label><div className="flex gap-2 mt-1"><Input value={formData.nickname} onChange={(e) => handleChange("nickname", e.target.value)} /><Button variant="outline" onClick={() => handleCheckDuplicate("nickname")}>중복확인</Button></div></div>
            <div><Label>이메일 *</Label><div className="flex gap-2 mt-1"><Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} /><Button variant="outline" onClick={() => handleCheckDuplicate("email")}>중복확인</Button></div></div>
            <div><Label>연락처</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="010-0000-0000" /></div>
            <div><Label>주소</Label><Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="주소를 입력하세요" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-gray-700 font-medium mb-6">비밀번호 변경</h2>
          <div className="space-y-4">
            <div><Label>현재 비밀번호</Label><Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} /></div>
            <div><Label>새 비밀번호</Label><Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} /></div>
            <Button onClick={handleChangePassword} variant="outline" className="w-full">비밀번호 변경하기</Button>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" /><span className="font-medium">계정 삭제</span></div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}><Trash2 className="w-4 h-4 mr-2" /> 삭제하기</Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>계정 삭제</AlertDialogTitle><AlertDialogDescription>정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>취소</AlertDialogCancel><AlertDialogAction onClick={onDeleteAccount} className="bg-red-500 hover:bg-red-600">삭제</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}