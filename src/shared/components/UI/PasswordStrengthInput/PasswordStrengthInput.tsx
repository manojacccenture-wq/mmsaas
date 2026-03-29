import {
  useState,
  useMemo,
  useRef,
  forwardRef,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  useEffect,
} from "react";
import Input from '@/shared/components/UI/Input/Input';

type StrengthLevel =
  | "weak"
  | "medium"
  | "good"
  | "strong"
  | "veryStrong";

interface Requirement {
  label: string;
  test: (pwd: string) => boolean;
}

interface StrengthResult {
  score: number;
  level: StrengthLevel;
  percentage: number;
  metCount: number;
  totalCount: number;
}

interface PasswordStrengthInputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  showStrength?: boolean;
  evaluator?: (password: string) => StrengthResult | null;
  rules?: Requirement[];
  strengthLabels?: Record<StrengthLevel, string>;
  strengthColors?: Record<StrengthLevel, string>;
  overlayClassName?: string;
  hideOnBlur?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  disabled?: boolean;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  containerClass?: string;
}

const DEFAULT_REQUIREMENTS: Requirement[] = [
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

const DEFAULT_STRENGTH_LABELS: Record<StrengthLevel, string> = {
  weak: "Weak",
  medium: "Fair",
  good: "Good",
  strong: "Strong",
  veryStrong: "Very Strong",
};

const DEFAULT_STRENGTH_COLORS: Record<StrengthLevel, string> = {
  weak: "#F44444",
  medium: "#FFA500",
  good: "#2ECC71",
  strong: "#2ECC71",
  veryStrong: "#00BFA6",
};


const defaultEvaluator = (
  password: string,
  requirements: Requirement[]
): StrengthResult | null => {
  if (!password) return null;

  const metRequirements = requirements.filter((req) =>
    req.test(password)
  ).length;

  const percentageByRequirements =
    (metRequirements / requirements.length) * 100;

  let level: StrengthLevel = "weak";
  let score = 0;

  if (metRequirements === 3 && password.length >= 16) {
    level = "veryStrong";
    score = 100;
  } else if (metRequirements === 3) {
    level = "strong";
    score = 75;
  } else if (metRequirements === 2 || password.length >= 12) {
    level = "good";
    score = 50;
  } else if (metRequirements === 1 || password.length >= 8) {
    level = "medium";
    score = 25;
  }

  return {
    score,
    level,
    percentage: percentageByRequirements,
    metCount: metRequirements,
    totalCount: requirements.length,
  };
};


const PasswordStrengthInput = forwardRef<
  HTMLInputElement,
  PasswordStrengthInputProps
>((props, ref) => {
  const {
    value: controlledValue,
    onChange,
    onFocus,
    onBlur,
    showStrength = true,
    evaluator = null,
    rules = DEFAULT_REQUIREMENTS,
    strengthLabels = DEFAULT_STRENGTH_LABELS,
    strengthColors = DEFAULT_STRENGTH_COLORS,
    overlayClassName = "",
    hideOnBlur = false,
    error = false,
    helperText = "",
    disabled = false,
    label = "",
    placeholder = "",
    className = "",
    containerClass = "",
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue || ""
  );

  const isControlled = controlledValue !== undefined;
  const password = isControlled ? controlledValue ?? "" : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);

  /* ===== Strength Calculation ===== */

  const strengthData = useMemo(() => {
    if (!password) return null;

    const result = evaluator
      ? evaluator(password)
      : defaultEvaluator(password, rules);

    if (!result) return null;

    return {
      ...result,
      label: strengthLabels[result.level] ?? strengthLabels.weak,
      color: strengthColors[result.level] ?? strengthColors.weak,
      requirements: rules.map((req) => ({
        ...req,
        met: req.test(password),
      })),
    };
  }, [password, evaluator, rules, strengthLabels, strengthColors]);

  /* ===== Handlers ===== */

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (hideOnBlur) {
      setIsFocused(false);
    }
    onBlur?.(e);
  };

  const showOverlay =
    showStrength &&
    isFocused &&
    password &&
    strengthData &&
    strengthData.level !== "strong" &&
    strengthData.level !== "veryStrong";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ===== Render ===== */

  return (
    <div ref={containerRef} className={`relative w-full ${containerClass}`}>
      <Input
        ref={ref}
        type="password"
        showPasswordToggle
        label={label}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        className={className}
        value={password}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      {showOverlay && strengthData && (
        <div
          className={`absolute top-full left-0 mt-2 z-50 ${overlayClassName}`}
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-lg shadow-md p-4 w-96">
            <div className="mb-3">
              <p className="font-medium">{strengthData.label}</p>
              <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${strengthData.percentage}%`,
                    backgroundColor: strengthData.color,
                  }}
                />
              </div>
            </div>

            <p className="text-sm mb-2 text-gray-600">
              Password must contain:
            </p>

            <div className="space-y-2">
              {strengthData.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-4 h-4 rounded border ${req.met
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                      }`}
                  />
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PasswordStrengthInput.displayName = 'PasswordStrengthInput';

export default PasswordStrengthInput;
