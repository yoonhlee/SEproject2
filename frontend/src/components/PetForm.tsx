import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";

interface PetFormProps {
  pet?: any;
  onSubmit: (pet: any) => void;
  onBack: () => void;
}

export function PetForm({ pet, onSubmit, onBack }: PetFormProps) {
  const [formData, setFormData] = useState({
    name: pet?.name || "",
    gender: pet?.gender || "",
    age: pet?.age || 0,
    size: pet?.size || "",
    birthday: pet?.birthday || "",
    weight: pet?.weight || undefined,
    personality: pet?.personality || "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.gender || !formData.size) {
        alert("필수 정보를 입력해주세요.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[2520px] mx-auto px-6 lg:px-20 h-20 flex items-center">
          <button onClick={onBack} className="hover:opacity-70 transition-opacity"><img src={logoImage} alt="어디가개" className="h-20" /></button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl mb-2">{pet ? "반려동물 수정" : "반려동물 등록"}</h1>
            <p className="text-gray-600">정보를 입력해주세요</p>
          </div>
          <div className="space-y-6">
            <div><Label>이름 *</Label><Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>성별 *</Label><Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}><SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger><SelectContent><SelectItem value="MALE">수컷</SelectItem><SelectItem value="FEMALE">암컷</SelectItem></SelectContent></Select></div>
              <div><Label>나이</Label><Input type="number" value={formData.age} onChange={(e) => handleChange("age", parseInt(e.target.value))} className="mt-1" /></div>
            </div>
            <div><Label>크기 *</Label><Select value={formData.size} onValueChange={(val) => handleChange("size", val)}><SelectTrigger className="mt-1"><SelectValue placeholder="선택" /></SelectTrigger><SelectContent><SelectItem value="SMALL">소형견</SelectItem><SelectItem value="MEDIUM">중형견</SelectItem><SelectItem value="BIG">대형견</SelectItem></SelectContent></Select></div>
            <div><Label>생일 (YYYYMMDD)</Label><Input value={formData.birthday} onChange={(e) => handleChange("birthday", e.target.value)} className="mt-1" /></div>
            <div><Label>몸무게 (kg)</Label><Input type="number" value={formData.weight} onChange={(e) => handleChange("weight", parseFloat(e.target.value))} className="mt-1" /></div>
            <div><Label>성격</Label><Textarea value={formData.personality} onChange={(e) => handleChange("personality", e.target.value)} className="mt-1" /></div>
          </div>
          <div className="flex gap-3 mt-8">
            <Button onClick={onBack} variant="outline" className="flex-1">취소</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-yellow-300 text-gray-900">완료</Button>
          </div>
        </div>
      </div>
    </div>
  );
}