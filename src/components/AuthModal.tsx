import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Assuming you use shadcn/ui
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Redirect to the login page and close the modal
  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  // Redirect to the sign-up page and close the modal
  const handleSignUp = () => {
    onClose();
    navigate("/signup");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login or Sign Up to Continue</DialogTitle>
          <DialogDescription>
            Please log in to your account or create a new one to use this
            feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end sm:gap-2">
          <Button onClick={handleLogin} className="w-full sm:w-auto">
            Login
          </Button>
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
