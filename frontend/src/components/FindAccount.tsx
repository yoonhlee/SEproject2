import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import logoImage from "figma:asset/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
// [수정] Dialog 관련 컴포넌트 추가 임포트
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

interface FindAccountProps {
  type: "id" | "password";
  onBack: () => void;
}

export function FindAccount({ type, onBack }: FindAccountProps) {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    email: "",
    username: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = () => {
    if (type === "id") {
      if (!formData.name || !formData.birthdate || !formData.email) {
        setError("모든 항목을 입력해주세요.");
        return;
      }
      // Mock result
      setResult("user123");
      setShowResult(true);
    } else {
      if (!formData.username || !formData.phone) {
        setError("모든 항목을 입력해주세요.");
        return;
      }
      // Mock result
      setResult("password123!");
      setShowResult(true);
    }
    setError("");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <button onClick={onBack} className="hover:opacity-70 transition-opacity">
              <img src={logoImage} alt="어디가개" className="h-24 mb-4" />
            </button>
            <h1 className="text-3xl mb-2">
              {type === "id" ? "아이디 찾기" : "비밀번호 찾기"}
            </h1>
            <p className="text-gray-600">
              {type === "id"
                ? "가입 시 입력한 정보를 입력해주세요"
                : "아이디와 휴대전화를 입력해주세요"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 mb-6">
            {type === "id" ? (
              <>
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="이름을 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="birthdate">생년월일</Label>
                  <Input
                    id="birthdate"
                    value={formData.birthdate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthdate: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="YYYYMMDD"
                    maxLength={8}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="username">아이디</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="아이디를 입력하세요"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">휴대전화</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        phone: e.target.value.replace(/\D/g, "") 
                      })
                    }
                    placeholder="01012345678"
                    maxLength={11}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline" className="flex-1">
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-gray-900"
            >
              확인
            </Button>
          </div>
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "id" ? "아이디 찾기 결과" : "비밀번호 찾기 결과"}
            </DialogTitle>
            {/* [수정] 접근성 경고 해결을 위한 설명 추가 */}
            <DialogDescription>
              요청하신 계정 정보 조회 결과입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-2">
              {type === "id"
                ? "고객님의 아이디는 다음과 같습니다:"
                : "고객님의 비밀번호는 다음과 같습니다:"}
            </p>
            <p className="text-xl text-gray-900 bg-gray-100 p-4 rounded-lg text-center">
              {result}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowResult(false);
                onBack();
              }}
              className="bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-gray-900"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}