import React, { useState, useMemo, useRef } from 'react';
import Input from '../Input/Input';

const PasswordInputWithStrength = ({ error, helperText, showStrengthOverlay = true, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState(props.value || '');
  const containerRef = useRef(null);

  const requirements = [
    {
      label: 'Uppercase and lowercase letter',
      test: (pwd) => /(?=.*[a-z])(?=.*[A-Z])/.test(pwd),
    },
    {
      label: 'Special characters',
      test: (pwd) => /(?=.*[^A-Za-z\d])/.test(pwd),
    },
    {
      label: 'Must have at least 12-16 characters',
      test: (pwd) => pwd.length >= 12,
    },
  ];

  const strengthData = useMemo(() => {
    if (!password) return null;

    const metRequirements = requirements.filter((req) => req.test(password)).length;
    const length = password.length;
    const progressPercentage = (metRequirements / requirements.length) * 100;

    let strength = '';
    let color = '';

    if (metRequirements === 3 && length >= 16) {
      strength = 'Very Strong';
      color = '#00BFA6';
    } else if (metRequirements === 3) {
      strength = 'Strong';
      color = '#2ECC71';
    } else if (metRequirements === 2 || length >= 12) {
      strength = 'Good';
      color = '#2ECC71';
    } else if (metRequirements === 1 || length >= 8) {
      strength = 'Fair';
      color = '#FFA500';
    } else {
      strength = 'Weak';
      color = '#F44444';
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

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const showOverlay = showStrengthOverlay && isFocused && password && strengthData;

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        type="password"
        error={error}
        helperText={helperText}
        {...props}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {showOverlay && (
        <div className="absolute top-full left-0 mt-[8px] z-50 w-auto pointer-events-auto">
          <div className="relative">
            <div className="absolute -top-[8px] left-[20px] w-[16px] h-[8px]">
              <svg
                viewBox="0 0 16 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path d="M8 0L16 8H0L8 0Z" fill="white" />
              </svg>
            </div>

            <div
              className="bg-white rounded-[8px] shadow-[0px_4px_12px_0px_rgba(63,70,86,0.1)] p-[16px] w-[376px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[8px]">
                  <div className="font-['Outfit',sans-serif] font-normal text-[16px] leading-[20px] text-[#333333]">
                    <p>{strengthData.strength}</p>
                  </div>
                  <div className="h-[6px] overflow-hidden relative rounded-[50px] w-[340px] bg-[#f3f5f9]">
                    <div
                      className="h-full rounded-[50px] transition-all duration-300 ease-out"
                      style={{
                        width: `${strengthData.progressPercentage}%`,
                        backgroundColor: strengthData.color,
                      }}
                    />
                  </div>
                </div>

                <div className="font-['Outfit',sans-serif] font-normal text-[16px] leading-[20px] text-[#595d62]">
                  <p>Password must contain:</p>
                </div>

                <div className="flex flex-col gap-[12px]">
                  {strengthData.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-[8px] items-center">
                      <div
                        className={`relative shrink-0 size-[16px] rounded-[4px] border border-solid transition-all duration-200 ${
                          req.met
                            ? 'bg-[#00bfa6] border-[#00bfa6]'
                            : 'border-[#cbced6] bg-white'
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
                      <div className="font-['Outfit',sans-serif] font-normal text-[16px] leading-[20px] text-[#595d62]">
                        <p>{req.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInputWithStrength;
