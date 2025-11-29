import { useState } from "react";
import { Button } from "./ui/button";
import {
  Star, MapPin, Clock, Share2, Heart, Users, Shield, DoorOpen, PawPrint, X,
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback"; // 경로 수정됨
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { ReviewEditDialog } from "./ReviewEditDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent } from "./ui/dialog";

interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  category: string;
  address: string;
  phone: string;
  hours: string;
  parking: boolean;
  leadOff: boolean;
  maxDogs: number;
  allowedSizes: string[];
  details: string;
}

interface Review {
  id: number;
  placeId: number;
  userId: number;
  userName: string;
  userPhoto: string;
  rating: number;
  content: string;
  photos: string[];
  date: string;
}

interface PlaceDetailProps {
  place: Place;
  reviews: Review[];
  isLoggedIn: boolean;
  currentUserId?: number;
  currentUserName?: string;
  onBack: () => void;
  onAddReview: (review: Omit<Review, "id" | "placeId" | "userId" | "date">) => void;
  onEditReview: (reviewId: number, review: Omit<Review, "id" | "placeId" | "userId" | "date">) => void;
  onDeleteReview: (reviewId: number) => void;
  onWriteReview?: () => void; // Optional prop if needed
}

export function PlaceDetail({
  place,
  reviews,
  isLoggedIn,
  currentUserId = 1,
  currentUserName = "사용자",
  onBack,
  onAddReview,
  onEditReview,
  onDeleteReview,
}: PlaceDetailProps) {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showWriteDialog, setShowWriteDialog] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const placeReviews = reviews.filter((r) => r.placeId === place.id);
  const galleryImages = [place.image, place.image, place.image];

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    setShowWriteDialog(true);
  };

  const handleSaveNewReview = (rating: number, content: string, photos: string[]) => {
    onAddReview({
      userName: currentUserName,
      userPhoto: "",
      rating,
      content,
      photos,
    });
    setShowWriteDialog(false);
  };

  const handleSaveEdit = (rating: number, content: string, photos: string[]) => {
    if (editingReview) {
      onEditReview(editingReview.id, {
        userName: editingReview.userName,
        userPhoto: editingReview.userPhoto,
        rating,
        content,
        photos,
      });
      setEditingReview(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteReviewId) {
      onDeleteReview(deleteReviewId);
      setDeleteReviewId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[2520px] mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <button onClick={onBack} className="hover:opacity-70 transition-opacity">
            <img src={logoImage} alt="어디가개" className="h-20" />
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <Share2 className="w-4 h-4 mr-2" /> 공유
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-gray-100 ${isSaved ? 'text-yellow-500' : ''}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} /> 저장
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[2520px] mx-auto px-6 lg:px-20 py-6">
        <div className="grid grid-cols-3 gap-2 h-[400px] rounded-xl overflow-hidden">
          {galleryImages.map((image, index) => (
            <ImageWithFallback
              key={index}
              src={image}
              alt={`${place.name} ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[2520px] mx-auto px-6 lg:px-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8">
              <h1 className="text-2xl mb-3">{place.name}</h1>
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{place.rating.toFixed(1)}</span>
                <span>· 후기 {place.reviewCount}개</span>
                <span>· {place.address}</span>
              </div>
              <div className="flex gap-2 mb-6">
                {place.allowedSizes?.map((size, i) => (
                  <span key={i} className="px-3 py-1.5 bg-yellow-200 text-gray-900 rounded-lg text-sm">{size}</span>
                ))}
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3"><Users className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">최대 {place.maxDogs}마리 동반 가능</span></div>
                <div className="flex items-center gap-3"><PawPrint className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">{place.leadOff ? "오프리쉬 가능" : "리드줄 착용 필수"}</span></div>
                {place.parking && <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">주차 가능</span></div>}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{place.details || place.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <h2 className="mb-4">운영시간</h2>
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gray-400" /><span className="text-gray-700">{place.hours}</span></div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl">{place.rating.toFixed(1)}</span>
                <span className="text-gray-600">· 후기 {placeReviews.length}개</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {placeReviews.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-gray-500">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</div>
                ) : (
                  placeReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-gray-600 text-sm">{review.userName[0]}</span></div>
                          <div><p className="text-sm">{review.userName}</p><p className="text-xs text-gray-500">{review.date}</p></div>
                        </div>
                        <div className="flex gap-2">
                            {/* 실제 구현시 본인 리뷰인지 확인 필요 */}
                            <button className="text-gray-400" onClick={() => { setEditingReview(review); setShowEditDialog(true); }}>수정</button>
                            <button className="text-red-400" onClick={() => setDeleteReviewId(review.id)}>삭제</button>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, i) => (<span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>))}</div>
                      <p className="text-sm text-gray-700 line-clamp-3">{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-3 mb-6"><MapPin className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500 mb-1">위치</p><p className="text-sm">{place.address}</p></div></div>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-4">이 장소를 이용해 보셨나요?</p>
                  <Button variant="outline" className="w-full border-gray-300" onClick={handleWriteReview}>리뷰 작성하기</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewEditDialog open={showWriteDialog} onClose={() => setShowWriteDialog(false)} placeName={place.name} review={{ rating: 5, content: "" }} onSave={handleSaveNewReview} mode="write" />
      {editingReview && <ReviewEditDialog open={showEditDialog} onClose={() => { setShowEditDialog(false); setEditingReview(null); }} placeName={place.name} review={{ rating: editingReview.rating, content: editingReview.content, photos: editingReview.photos }} onSave={handleSaveEdit} onDelete={() => setDeleteReviewId(editingReview.id)} mode="edit" />}
      
      <AlertDialog open={deleteReviewId !== null} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>리뷰 삭제</AlertDialogTitle><AlertDialogDescription>정말로 삭제하시겠습니까?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>취소</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">삭제</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50 text-white hover:bg-white/20" onClick={() => setSelectedImageIndex(null)}><X className="w-6 h-6" /></Button>
          {selectedImageIndex !== null && <div className="flex items-center justify-center w-full h-full p-8"><ImageWithFallback src={galleryImages[selectedImageIndex]} alt="상세 이미지" className="max-w-full max-h-[80vh] object-contain" /></div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}