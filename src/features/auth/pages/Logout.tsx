import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hook";
import { logoutAsync } from "@/features/auth/authThunk";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await dispatch(logoutAsync()).unwrap();
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        navigate("/", { replace: true }); // redirect to login
      }
    };

    doLogout();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      Logging out...
    </div>
  );
};

export default Logout;