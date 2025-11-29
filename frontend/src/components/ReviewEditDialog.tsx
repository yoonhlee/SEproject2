import { useState } from "react";
// [수정] DialogDescription 추가
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

export function ReviewEditDialog({ open, onClose, placeName, review, onSave }: any) {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        {/* [수정] DialogHeader로 감싸고 Title과 Description 추가 */}
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">
            {placeName}에 대한 리뷰를 작성하거나 수정합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-b pb-4 mb-4">
          {/* Title은 위로 올렸으니 여기선 텍스트로만 표시 */}
          {/* <h2 className="text-lg">리뷰 작성</h2>  <-- 삭제됨 (DialogTitle로 대체) */}
          <p className="text-sm text-gray-600">{placeName}</p>
        </div>
        
        <div className="flex gap-2 mb-4">{[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRating(star)}><Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} /></button>)}</div>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" rows={4} className="mb-4" />
        <div className="flex gap-3"><Button onClick={onClose} variant="outline" className="flex-1">취소</Button><Button onClick={() => onSave(rating, content, [])} className="flex-1 bg-yellow-300 text-gray-900">저장</Button></div>
      </DialogContent>
    </Dialog>
  );
}