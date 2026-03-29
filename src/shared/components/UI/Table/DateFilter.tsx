import { useState } from "react";
import { subDays, subMonths } from "date-fns";
import Button from "@/shared/components/UI/Button/Button";

interface Props {
  onChange: (range: { start?: Date; end?: Date }) => void;
}

const DateFilter: React.FC<Props> = ({ onChange }) => {

  const [open, setOpen] = useState(false);

  const applyPreset = (type: string) => {
    const now = new Date();

    switch (type) {

      case "today":
        onChange({
          start: new Date(now.setHours(0,0,0,0)),
          end: new Date()
        });
        break;

      case "yesterday":
        const y = subDays(new Date(), 1);
        onChange({
          start: new Date(y.setHours(0,0,0,0)),
          end: new Date(y.setHours(23,59,59,999))
        });
        break;

      case "month":
        onChange({
          start: subMonths(new Date(), 1),
          end: new Date()
        });
        break;

      case "3month":
        onChange({
          start: subMonths(new Date(), 3),
          end: new Date()
        });
        break;
    }

    setOpen(false);
  };

  return (
    <div className="relative">

      <Button
        onClick={() => setOpen(!open)}
        // className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Filter by Date
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border">

          <Button
          variant="outlinePrimary"
            // className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => applyPreset("today")}
          >
            Today
          </Button>

          <Button
            // className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => applyPreset("yesterday")}
          >
            Yesterday
          </Button>

          <Button   
            // className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => applyPreset("month")}
          >
            Last 1 Month
          </Button>

          <Button
            // className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => applyPreset("3month")}
          >
            Last 3 Months
          </Button>

        </div>
      )}
    </div>
  );
};

export default DateFilter;