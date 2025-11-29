import { Dialog, DialogContent } from "./ui/dialog";
import { PetForm } from "./PetForm";

export function PetEditDialog({ open, onClose, pet, onSave }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none">
        <div className="bg-white rounded-2xl overflow-hidden">
            <PetForm pet={pet} onSubmit={onSave} onBack={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}