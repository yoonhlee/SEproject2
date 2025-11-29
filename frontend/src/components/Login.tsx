import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { API_BASE_URL } from "../lib/constants";

interface LoginProps {
  onLogin: (token: string, userId: string) => void;
  onSignup: () => void;
  onFindAccount: (type: "id" | "password") => void;
  onBack: () => void;
}

export function Login({ onLogin, onSignup, onFindAccount, onBack }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: username, passwordRaw: password }),
      });
      const result = await response.json();
      if (result.success) {
        onLogin(result.data.accessToken, result.data.user.userId);
      } else {
        setError(result.message);
      }
    } catch (err) { setError("서버 연결 실패"); }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center mb-8"><button onClick={onBack}><img src={logoImage} className="h-24 mb-4" /></button><p className="text-gray-600">로그인</p></div>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
          <div className="space-y-4 mb-6">
            <div><Label>아이디</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" /></div>
            <div><Label>비밀번호</Label><div className="relative mt-1"><Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Eye className="w-5 h-5" /></button></div></div>
          </div>
          <Button onClick={handleLogin} className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 h-12 mb-4">로그인</Button>
          <div className="flex justify-center gap-4 mb-6"><button onClick={onSignup} className="text-sm text-gray-600 hover:underline">회원가입</button><span className="text-gray-300">|</span><button onClick={() => onFindAccount("id")} className="text-sm text-gray-600">아이디/비번 찾기</button></div>
          <Button onClick={onBack} variant="ghost" className="w-full">돌아가기</Button>
        </div>
      </div>
    </div>
  );
}