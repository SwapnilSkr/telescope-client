import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Globe } from "lucide-react";

interface AddMultipleGroupsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddMultipleGroupsModal({
  isOpen,
  setIsOpen,
}: AddMultipleGroupsModalProps) {
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Add link when space or enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && linkInput.trim()) {
      // Only add if it's a valid telegram link format
      if (linkInput.trim().startsWith("https://t.me/")) {
        addLink();
      }
    }
  };

  const addLink = () => {
    if (linkInput.trim() && !links.includes(linkInput.trim())) {
      setLinks([...links, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter((link) => link !== linkToRemove));
  };

  const handleSubmit = () => {
    // Here you would normally make an API call
    console.log("Submitting links:", links);
    // Show success message
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state for next time
    setLinkInput("");
    setLinks([]);
    setIsSubmitted(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-[#14162E] border-none text-white">
        <DialogTitle className="text-xl font-bold">Add Groups</DialogTitle>
        
        {!isSubmitted ? (
          <>
            <div className="space-y-4">
              <p className="text-gray-400">Add Group Links here</p>
              <div className="flex items-center space-x-2">
                <Input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://t.me/username here..."
                  className="bg-[#1A1E38] border-none text-white px-4 py-2 rounded-full"
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={links.length === 0}
                  className={`${
                    links.length === 0 
                      ? "bg-purple-900/50 text-gray-400 cursor-not-allowed" 
                      : "bg-purple-700 hover:bg-purple-600 text-white"
                  } rounded-full px-6`}
                >
                  OK
                </Button>
              </div>

              {/* List of added links */}
              <div className="space-y-2 mt-4">
                {links.map((link, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-[#1A1E38] px-4 py-3 rounded-full"
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-white mr-2" />
                      <span className="text-white">{link}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-xl mb-4">Request has been submitted</p>
            <Button 
              onClick={handleClose}
              className="bg-purple-700 hover:bg-purple-600 text-white rounded-full px-6"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
