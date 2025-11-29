import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function ProfileEditDialog({ open, onClose, currentNickname, onSave }: any) {
  const [nickname, setNickname] = useState(currentNickname);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>프로필 수정</DialogTitle></DialogHeader>
        <div className="py-4"><Label>닉네임</Label><Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-2" /></div>
        <div className="flex gap-3"><Button onClick={onClose} variant="outline" className="flex-1">취소</Button><Button onClick={() => onSave(nickname)} className="flex-1 bg-yellow-300 text-gray-900">저장</Button></div>
      </DialogContent>
    </Dialog>
  );
}