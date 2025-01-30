import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGroupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddGroupModal({ isOpen, setIsOpen }: AddGroupModalProps) {
  const [groupLink, setGroupLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the submission of the new group
    console.log("New group link submitted:", groupLink);
    setGroupLink("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-link" className="text-right">
                Group Link
              </Label>
              <Input
                id="group-link"
                value={groupLink}
                onChange={(e) => setGroupLink(e.target.value)}
                className="col-span-3"
                placeholder="Enter the group link here"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
