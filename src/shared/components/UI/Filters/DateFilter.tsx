import { subDays, subMonths } from "date-fns";
import { useState } from "react";
import Button from "../Button/Button";

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
        variant="outlinePrimary"
        onClick={() => setOpen(!open)}
      >
        Filter by Date
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg border p-2 flex flex-col gap-1">

          <Button variant="outlinePrimary" onClick={() => applyPreset("today")}>
            Today
          </Button>

          <Button variant="outlinePrimary" onClick={() => applyPreset("yesterday")}>
            Yesterday
          </Button>

          <Button variant="outlinePrimary" onClick={() => applyPreset("month")}>
            Last 1 Month
          </Button>

          <Button variant="outlinePrimary" onClick={() => applyPreset("3month")}>
            Last 3 Months
          </Button>

        </div>
      )}
    </div>
  );
};

export default DateFilter;