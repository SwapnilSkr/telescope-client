import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AddMultipleGroupsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddMultipleGroupsModal({
  isOpen,
  setIsOpen,
}: AddMultipleGroupsModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [groups, setGroups] = useState<string[]>([]);

  const validateAndAddGroup = (value: string) => {
    const trimmedValue = value.trim();
    if (
      trimmedValue &&
      /^https:\/\/t\.me\/[a-zA-Z0-9_]{5,}$/.test(trimmedValue)
    ) {
      const username = trimmedValue.split("/").pop() || "";
      if (groups.length < 10 && !groups.includes(username)) {
        setGroups([...groups, username]);
      }
    }
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      validateAndAddGroup(value);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndAddGroup(inputValue);
    }
  };

  const removeGroup = (group: string) => {
    setGroups(groups.filter((g) => g !== group));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the submission of the new groups
    console.log("New groups submitted:", groups);
    setGroups([]);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setGroups([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Multiple Groups</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-links" className="text-right">
                Group Links
              </Label>
              <Input
                id="group-links"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="col-span-3"
                placeholder="https://t.me/username"
              />
            </div>
            <div className="col-span-3 flex flex-wrap gap-2">
              {groups.map((group) => (
                <Badge
                  key={group}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {group}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeGroup(group)}
                  />
                </Badge>
              ))}
            </div>
            {groups.length >= 10 && (
              <p className="text-sm text-red-500">
                Maximum of 10 groups reached
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={groups.length === 0}>
              Add Groups
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
