import React, { useMemo } from "react";

/* ================= TYPES ================= */

interface Requirement {
  label: string;
  test: (pwd: string) => boolean;
  met?: boolean;
}

interface StrengthData {
  strength: string;
  color: string;
  progressPercentage: number;
  requirements: Requirement[];
}

interface PasswordStrengthCheckerProps {
  password?: string;
}

/* ================= COMPONENT ================= */

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  password = "",
}) => {
  const requirements: Requirement[] = [
    {
      label: "Uppercase and lowercase letter",
      test: (pwd: string) => /(?=.*[a-z])(?=.*[A-Z])/.test(pwd),
    },
    {
      label: "Special characters",
      test: (pwd: string) => /(?=.*[^A-Za-z\d])/.test(pwd),
    },
    {
      label: "Must have at least 12-16 characters",
      test: (pwd: string) => pwd.length >= 12,
    },
  ];

  const strengthData = useMemo<StrengthData | null>(() => {
    if (!password) return null;

    const metRequirements = requirements.filter((req) =>
      req.test(password)
    ).length;

    const length = password.length;
    const progressPercentage =
      (metRequirements / requirements.length) * 100;

    let strength = "";
    let color = "";

    if (metRequirements === 3 && length >= 16) {
      strength = "Very Strong";
      color = "#00BFA6";
    } else if (metRequirements === 3) {
      strength = "Strong";
      color = "#2ECC71";
    } else if (metRequirements === 2 || length >= 12) {
      strength = "Good";
      color = "#2ECC71";
    } else if (metRequirements === 1 || length >= 8) {
      strength = "Fair";
      color = "#FFA500";
    } else {
      strength = "Weak";
      color = "#F44444";
    }

    return {
      strength,
      color,
      progressPercentage,
      requirements: requirements.map((req) => ({
        ...req,
        met: req.test(password),
      })),
    };
  }, [password]);

  if (!strengthData) return null;

  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      <div className="flex flex-col gap-[8px] items-start w-full">
        <div className="flex flex-col font-['Outfit',sans-serif] font-normal justify-center leading-[20px] text-[16px]">
          <p>{strengthData.strength}</p>
        </div>
        <div className="h-[6px] overflow-hidden relative rounded-[50px] w-full bg-[#f3f5f9]">
          <div
            className="h-full rounded-[50px] transition-all duration-300 ease-out"
            style={{
              width: `${strengthData.progressPercentage}%`,
              backgroundColor: strengthData.color,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[12px] items-start w-full mt-[8px]">
        <div className="flex flex-col font-['Outfit',sans-serif] font-normal leading-[20px] text-[16px] text-[#595d62]">
          <p>Password must contain:</p>
        </div>

        <div className="flex flex-col gap-[12px] items-start w-full">
          {strengthData.requirements.map((req, idx) => (
            <div key={idx} className="flex gap-[8px] items-center w-full">
              <div
                className={`relative shrink-0 size-[16px] rounded-[4px] border border-solid transition-all duration-200 ${
                  req.met
                    ? "bg-[#00bfa6] border-[#00bfa6]"
                    : "border-[#cbced6] bg-white"
                }`}
              >
                {req.met && (
                  <svg
                    className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 size-[14px] text-white"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06l7.25-7.25a.75.75 0 011.06 0z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col font-['Outfit',sans-serif] font-normal leading-[20px] text-[16px] text-[#595d62]">
                <p>{req.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;