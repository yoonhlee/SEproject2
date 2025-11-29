import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

export function ReviewEditDialog({ open, onClose, placeName, review, onSave }: any) {
  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <div className="border-b pb-4 mb-4"><h2 className="text-lg">리뷰 작성</h2><p className="text-sm text-gray-600">{placeName}</p></div>
        <div className="flex gap-2 mb-4">{[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRating(star)}><Star className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} /></button>)}</div>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" rows={4} className="mb-4" />
        <div className="flex gap-3"><Button onClick={onClose} variant="outline" className="flex-1">취소</Button><Button onClick={() => onSave(rating, content, [])} className="flex-1 bg-yellow-300 text-gray-900">저장</Button></div>
      </DialogContent>
    </Dialog>
  );
}