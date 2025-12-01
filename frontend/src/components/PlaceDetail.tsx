import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Star, MapPin, Clock, Share2, Heart, Users, Shield, PawPrint, X, User
} from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { ReviewEditDialog } from "./ReviewEditDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent } from "./ui/dialog";
import { API_BASE_URL } from "../lib/constants";
import { toast } from "sonner";

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
  isLoggedIn: boolean;
  onBack: () => void;
  onHome: () => void;
}

export function PlaceDetail({
  place,
  isLoggedIn,
  onBack,
  onHome
}: PlaceDetailProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showWriteDialog, setShowWriteDialog] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const currentUserId = Number(localStorage.getItem("userId") || 0);
  const galleryImages = [place.image, place.image, place.image];

  const fetchReviews = useCallback(async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/places/${place.id}/reviews`);
        const data = await res.json();
        if (data.success) {
            const mappedReviews = data.data.map((r: any) => ({
                id: r.reviewId,
                placeId: r.placeId,
                userId: r.userId,
                userName: r.userNickname,
                userPhoto: "", 
                rating: r.rating,
                content: r.content,
                photos: r.photos,
                date: new Date(r.createdAt).toLocaleDateString()
            }));
            setReviews(mappedReviews);
        }
    } catch (e) {
        console.error("리뷰 로딩 실패", e);
    }
  }, [place.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요한 기능입니다.");
      return;
    }
    setShowWriteDialog(true);
  };

  // [수정] 리뷰 등록 핸들러 (에러 메시지 처리 강화)
  const handleCreateReview = async (rating: number, content: string, photos: string[]) => {
    const token = localStorage.getItem("accessToken");
    try {
        const res = await fetch(`${API_BASE_URL}/api/places/${place.id}/reviews`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rating, content, photos })
        });
        
        const result = await res.json(); // 응답 내용을 먼저 받습니다.

        if (res.ok && result.success) {
            toast.success("리뷰가 등록되었습니다.");
            setShowWriteDialog(false);
            fetchReviews(); 
        } else {
            // 서버가 보낸 에러 메시지(예: "20자 이상 작성해주세요")를 띄웁니다.
            toast.error(result.message || "리뷰 등록에 실패했습니다.");
        }
    } catch (e) {
        toast.error("오류가 발생했습니다.");
    }
  };

  const handleUpdateReview = async (rating: number, content: string, photos: string[]) => {
    if (!editingReview) return;
    const token = localStorage.getItem("accessToken");
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${editingReview.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ rating, content, photos })
        });

        const result = await res.json();

        if (res.ok && result.success) {
            toast.success("리뷰가 수정되었습니다.");
            setEditingReview(null);
            setShowEditDialog(false);
            fetchReviews();
        } else {
            toast.error(result.message || "수정에 실패했습니다.");
        }
    } catch (e) {
        toast.error("오류가 발생했습니다.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReviewId) return;
    const token = localStorage.getItem("accessToken");

    try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/${deleteReviewId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            toast.success("리뷰가 삭제되었습니다.");
            setDeleteReviewId(null);
            fetchReviews();
        } else {
            toast.error("삭제에 실패했습니다.");
        }
    } catch (e) {
        toast.error("오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[2520px] mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <button onClick={onHome} className="hover:opacity-70 transition-opacity">
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
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">{place.name}</h1>
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{place.rating.toFixed(1)}</span>
                <span>· 후기 {reviews.length}개</span>
                <span>· {place.address}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {place.allowedSizes?.map((size, i) => (
                  <span key={i} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {size}
                  </span>
                ))}
              </div>
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3"><Users className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">최대 {place.maxDogs}마리 동반 가능</span></div>
                <div className="flex items-center gap-3"><PawPrint className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">{place.leadOff ? "오프리쉬 가능" : "리드줄 착용 필수"}</span></div>
                {place.parking && <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-gray-400" /><span className="text-sm text-gray-700">주차 가능</span></div>}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{place.details || place.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-4">운영시간</h2>
              <div className="flex items-center gap-3 text-gray-700"><Clock className="w-5 h-5 text-gray-400" /><span>{place.hours}</span></div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">리뷰</h2>
                    <span className="text-gray-500 text-sm">({reviews.length})</span>
                </div>
                <Button variant="outline" onClick={handleWriteReview}>리뷰 작성하기</Button>
              </div>
              
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                    <p>아직 리뷰가 없습니다.</p>
                    <p className="text-sm mt-1">첫 번째 리뷰의 주인공이 되어보세요!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                             <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{review.userName}</p>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        {isLoggedIn && currentUserId === review.userId && (
                            <div className="flex gap-2 text-sm">
                                <button className="text-gray-400 hover:text-gray-600" onClick={() => { setEditingReview(review); setShowEditDialog(true); }}>수정</button>
                                <button className="text-red-400 hover:text-red-600" onClick={() => setDeleteReviewId(review.id)}>삭제</button>
                            </div>
                        )}
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-6"><MapPin className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500 mb-1">위치</p><p className="text-sm font-medium">{place.address}</p></div></div>
                <div className="pt-6 border-t border-gray-200">
                  <Button className="w-full bg-yellow-300 text-gray-900 hover:bg-yellow-400" onClick={handleWriteReview}>리뷰 작성하기</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewEditDialog 
        open={showWriteDialog} 
        onClose={() => setShowWriteDialog(false)} 
        placeName={place.name} 
        review={{ rating: 5, content: "" }} 
        onSave={handleCreateReview} 
        mode="write" 
      />
      
      {editingReview && (
        <ReviewEditDialog 
            open={showEditDialog} 
            onClose={() => { setShowEditDialog(false); setEditingReview(null); }} 
            placeName={place.name} 
            review={{ rating: editingReview.rating, content: editingReview.content, photos: editingReview.photos }} 
            onSave={handleUpdateReview} 
            mode="edit" 
        />
      )}
      
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