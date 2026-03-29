import { useNavigate } from "react-router-dom";

import ShieldX from "@/assets/Images/Icons/common/shield.png"



const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <img src={ShieldX} />
            {/* <ShieldX className="text-red-600 w-10 h-10" /> */}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          You don’t have permission to access this application.  
          Please contact your administrator if you think this is a mistake.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Go to Login
          </button>

          {/* <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;