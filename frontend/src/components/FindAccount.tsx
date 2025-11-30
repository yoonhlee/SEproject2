import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { API_BASE_URL } from "../lib/constants";

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
    // phone은 백엔드 로직상(이메일 인증) 사용하지 않으므로 email 재사용
  });
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      if (type === "id") {
        // [아이디 찾기]
        // 백엔드는 이메일로 아이디를 찾습니다. (이름, 생년월일은 입력은 받되 API엔 이메일만 전송)
        if (!formData.email) {
          setError("이메일을 입력해주세요.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/users/find-id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data.data); // 찾은 아이디
          setShowResult(true);
        } else {
          setError(data.message || "일치하는 회원 정보가 없습니다.");
        }

      } else {
        // [비밀번호 찾기]
        // 백엔드는 아이디 + 이메일로 사용자를 확인하고 임시 비밀번호를 줍니다.
        if (!formData.username || !formData.email) {
          setError("아이디와 이메일을 모두 입력해주세요.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            loginId: formData.username, 
            email: formData.email 
          }),
        });

        const data = await response.json();

        if (data.success) {
          setResult(data.data); // 임시 비밀번호
          setShowResult(true);
        } else {
          setError(data.message || "일치하는 회원 정보가 없습니다.");
        }
      }
    } catch (e) {
      console.error(e);
      setError("서버 연결 중 오류가 발생했습니다.");
    }
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
                ? "가입 시 등록한 이메일을 입력해주세요"
                : "아이디와 이메일을 입력해주세요"}
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
                {/* 이름, 생년월일은 구색 맞추기용 (실제 찾기는 이메일로) */}
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
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="가입 시 등록한 이메일"
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="username">아이디 *</Label>
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

                {/* [수정] 휴대전화 -> 이메일로 변경 (백엔드 로직 일치화) */}
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="가입 시 등록한 이메일"
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
              {type === "id" ? "아이디 찾기 결과" : "임시 비밀번호 발급"}
            </DialogTitle>
            <DialogDescription>
              {type === "id" ? "회원님의 아이디 정보입니다." : "로그인을 위한 임시 비밀번호입니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-gray-600 mb-2">
              {type === "id"
                ? "고객님의 아이디는 다음과 같습니다:"
                : "아래 임시 비밀번호로 로그인해주세요:"}
            </p>
            <p className="text-xl font-bold text-gray-900 bg-gray-100 p-4 rounded-lg break-all">
              {result}
            </p>
            {type === "password" && (
                <p className="text-xs text-red-500 mt-2">로그인 후 반드시 비밀번호를 변경해주세요.</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowResult(false);
                onBack(); // 로그인 화면으로 이동
              }}
              className="w-full bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-gray-900"
            >
              로그인 하러 가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}