import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
// [수정] DialogDescription 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { PlaceCard } from "./PlaceCard";

export function WizardDialog({ open, onClose, places, onPlaceClick }: any) {
  const [step, setStep] = useState(0);
  const questions = [{ id: 1, q: "크기는?", o: ["소형", "중형", "대형"] }, { id: 2, q: "컨디션은?", o: ["활발", "조용"] }];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="text-yellow-400" /> 마법사 추천</DialogTitle>
          {/* [추가] 접근성 경고 해결용 설명 (화면에는 안 보임) */}
          <DialogDescription className="sr-only">
            몇 가지 질문에 답하고 딱 맞는 장소를 추천받으세요.
          </DialogDescription>
        </DialogHeader>
        {step < questions.length ? (
          <div className="py-6 text-center">
            <h3 className="text-2xl mb-8">{questions[step].q}</h3>
            <div className="grid grid-cols-3 gap-4">{questions[step].o.map(opt => <button key={opt} onClick={() => setStep(step + 1)} className="p-6 border rounded-2xl hover:bg-yellow-50">{opt}</button>)}</div>
          </div>
        ) : (
          <div className="py-6">
            <h3 className="text-xl mb-4">추천 장소</h3>
            <div className="grid grid-cols-3 gap-4">{places.slice(0, 3).map((p: any) => <PlaceCard key={p.id} {...p} onClick={() => { onPlaceClick(p.id); onClose(); }} />)}</div>
            <Button onClick={() => setStep(0)} className="w-full mt-6 bg-yellow-300 text-gray-900">다시하기</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}