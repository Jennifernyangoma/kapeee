import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

export default function Login() {
  const [showAuthModal, setShowAuthModal] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowAuthModal(false);
    navigate("/");
  };

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={handleClose}
      initialMode="login"
    />
  );
}
