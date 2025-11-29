// [수정] Header, Title, Description 추가 임포트
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { PetForm } from "./PetForm";

export function PetEditDialog({ open, onClose, pet, onSave }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
        {/* [수정] 접근성 준수를 위해 숨김 처리된 헤더 추가 (sr-only) */}
        <DialogHeader className="sr-only">
            <DialogTitle>반려동물 정보 수정</DialogTitle>
            <DialogDescription>반려동물의 상세 정보를 수정하는 화면입니다.</DialogDescription>
        </DialogHeader>
        
        <div className="bg-white rounded-2xl overflow-hidden">
            <PetForm pet={pet} onSubmit={onSave} onBack={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}