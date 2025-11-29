import { Star } from "lucide-react";
import { ImageWithFallback } from "./ui/ImageWithFallback"; // 경로 수정됨

interface PlaceCardProps {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  category: string;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

export function PlaceCard({
  name,
  image,
  description,
  rating,
  reviewCount,
  category,
  onClick,
  onHover,
  onLeave,
}: PlaceCardProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs">
            {category}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 group-hover:underline">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm">{rating.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{description}</p>
        <p className="text-sm text-gray-500">{reviewCount}개의 후기</p>
      </div>
    </div>
  );
}