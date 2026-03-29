import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/UI/Button/Button";
import deniedImage from "../../../assets/Images/Denied/Denied.png";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToSignIn = (): void => {
    navigate("/");
  };

  return (
    <div className="bg-white relative min-h-screen flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[12px] w-full max-w-[373px]">
          {/* Logo Section */}
          <div className="h-auto flex items-end justify-center gap-[6px]">
            <div>
              <img alt="our Image" src={"logoImage"} className="w-full h-full" />
            </div>
          </div>

          {/* Icon Container */}
          <div className="border-solid w-full">
            <div className="relative w-full h-auto">
              <img
                alt="vendor contact illustration"
                src={deniedImage}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-[4px] items-center text-center w-full">
            <h1 className="font-medium text-base text-[#0e121e]">
              Contact your vendor
            </h1>
            <p className="font-medium text-[16px] text-[#cbced6]">
              Please contact your vendor. They will notify the admin to help reset your password.
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center px-4 pb-8">
        <Button
          type="submit"
          variant="primary"
          size="md"
          onClick={handleBackToSignIn}
          className="w-[20%]"
        >
          Back to sign in
        </Button>
      </div>
    </div>
  );
};

export default AccessDenied;