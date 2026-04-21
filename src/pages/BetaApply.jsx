import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BetaApply() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/pricing", { replace: true }); }, []);
  return null;
}