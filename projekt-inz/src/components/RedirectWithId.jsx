import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserPanel from "../pages/UserPanel";

const RedirectWithId = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      navigate(`/?google_id=${user.id}`);
    }
  }, [user, navigate]);

  // Wyrenderuj UserPanel lub inny komponent, jeśli to konieczne
  return <UserPanel user={user} />;
};

export default RedirectWithId;