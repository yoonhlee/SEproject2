import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, Trash2 } from "lucide-react";
import logoImage from "../assets/13429f3bf73f16f4f94cb74ce47b8a5ef9aa39a9.png";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface AccountManagementProps {
  user: any;
  onBack: () => void;
  onUpdateField: (field: string, value: string) => void;
  onDeleteAccount: () => void;
}

export function AccountManagement({ user, onBack, onUpdateField, onDeleteAccount }: AccountManagementProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (field: string, currentValue: string) => { setEditingField(field); setEditValue(currentValue); };
  const handleSave = (field: string) => { onUpdateField(field, editValue); setEditingField(null); };

  const renderField = (label: string, fieldName: string, value: string) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-gray-600">{label}</Label>
        {!editingField && <Button variant="outline" size="sm" onClick={() => handleEdit(fieldName, value)}>수정</Button>}
      </div>
      {editingField === fieldName ? (
        <div className="space-y-2">
          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setEditingField(null)} className="flex-1">취소</Button><Button size="sm" onClick={() => handleSave(fieldName)} className="flex-1 bg-yellow-300 text-gray-900">저장</Button></div>
        </div>
      ) : <p className="text-gray-900">{fieldName === "password" ? "••••••••" : value}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[800px] mx-auto px-6 h-20 flex items-center gap-4">
          <button onClick={onBack}><img src={logoImage} alt="어디가개" className="h-20" /></button><h1 className="text-xl">계정관리</h1>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <h2 className="flex items-center gap-2 mb-6 text-gray-700"><Settings className="w-5 h-5" /> 계정 정보</h2>
          <div className="space-y-0">
            {renderField("닉네임", "nickname", user.nickname)}
            {renderField("이메일", "email", user.email)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 mb-4">
          <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600" onClick={() => setShowDeleteDialog(true)}><Trash2 className="w-4 h-4 mr-2" /> 계정 삭제</Button>
        </div>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>계정 삭제</AlertDialogTitle><AlertDialogDescription>삭제하시겠습니까?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>취소</AlertDialogCancel><AlertDialogAction onClick={onDeleteAccount} className="bg-red-500">삭제</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}