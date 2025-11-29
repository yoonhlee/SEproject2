import { User, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onMyPageClick: () => void;
  onLogoClick: () => void;
  onSearchClick?: () => void;
  onWizardClick?: () => void;
  onFilterClick?: () => void;
  showSearch?: boolean;
  searchMode?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: () => void;
}

export function Header({
  isLoggedIn, onLoginClick, onSignupClick, onLogoutClick, onMyPageClick, onLogoClick, onSearchClick, onWizardClick, onFilterClick,
  showSearch = true, searchMode = false, searchQuery = "", onSearchChange, onSearch,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[2520px] mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <button onClick={onLogoClick} className="flex items-center hover:opacity-70 transition-opacity">
            <img src={logoImage} alt="어디가개" className="h-20" />
          </button>
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              {searchMode ? (
                <div className="w-full flex items-center justify-between px-6 py-3 border border-gray-300 hover:shadow-md rounded-full transition-shadow">
                  <Input value={searchQuery} onChange={(e) => onSearchChange?.(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch?.()} placeholder="댕댕이와 어디로 떠나볼까요?" className="border-0 bg-transparent focus-visible:ring-0 px-0 text-sm" autoFocus />
                  <div className="flex items-center gap-2">
                    <Button onClick={(e) => { e.stopPropagation(); onFilterClick?.(); }} size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs border-gray-300"><SlidersHorizontal className="w-3 h-3 mr-1" />필터</Button>
                    <Button onClick={(e) => { e.stopPropagation(); onWizardClick?.(); }} size="sm" className="bg-yellow-200 hover:bg-yellow-300 rounded-full h-8 px-3 text-xs text-gray-900"><Sparkles className="w-3 h-3 mr-1" />마법사</Button>
                    <button onClick={(e) => { e.stopPropagation(); onSearch?.(); }} className="bg-yellow-200 p-2 rounded-full hover:bg-yellow-300"><Search className="w-4 h-4 text-gray-900" strokeWidth={2.5} /></button>
                  </div>
                </div>
              ) : (
                // [수정됨] button 태그를 div 태그로 변경하여 중첩 에러 해결
                <div onClick={onSearchClick} className="w-full flex items-center justify-between px-6 py-3 border border-gray-300 hover:shadow-md rounded-full transition-shadow cursor-pointer">
                  <span className="text-sm text-gray-400">댕댕이와 어디로 떠나볼까요?</span>
                  <div className="flex items-center gap-2">
                    <Button onClick={(e) => { e.stopPropagation(); onFilterClick?.(); }} size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs border-gray-300"><SlidersHorizontal className="w-3 h-3 mr-1" />필터</Button>
                    <Button onClick={(e) => { e.stopPropagation(); onWizardClick?.(); }} size="sm" className="bg-yellow-200 hover:bg-yellow-300 rounded-full h-8 px-3 text-xs text-gray-900"><Sparkles className="w-3 h-3 mr-1" />마법사</Button>
                    <div className="bg-yellow-200 p-2 rounded-full"><Search className="w-4 h-4 text-gray-900" strokeWidth={2.5} /></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button onClick={onMyPageClick} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow"><div className="bg-gray-700 p-1.5 rounded-full"><User className="w-4 h-4 text-white" /></div></button>
                <Button onClick={onLogoutClick} variant="outline" className="rounded-full border-gray-300">로그아웃</Button>
              </>
            ) : (
              <>
                <Button onClick={onLoginClick} variant="outline" className="rounded-full border-gray-300">로그인</Button>
                <Button onClick={onSignupClick} className="rounded-full bg-yellow-200 hover:bg-yellow-300 text-gray-900">회원가입</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}