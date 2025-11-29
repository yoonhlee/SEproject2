import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
// [수정] DialogDescription 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

export function ProfileEditDialog({ open, onClose, currentNickname, onSave }: any) {
  const [nickname, setNickname] = useState(currentNickname);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            {/* [수정] 설명 추가 (화면에 불필요하면 sr-only 클래스 사용 가능) */}
            <DialogDescription>
                다른 사용자에게 보여질 닉네임을 설정하세요.
            </DialogDescription>
        </DialogHeader>
        <div className="py-4"><Label>닉네임</Label><Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-2" /></div>
        <div className="flex gap-3"><Button onClick={onClose} variant="outline" className="flex-1">취소</Button><Button onClick={() => onSave(nickname)} className="flex-1 bg-yellow-300 text-gray-900">저장</Button></div>
      </DialogContent>
    </Dialog>
  );
}