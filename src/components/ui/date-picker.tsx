"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ setDay, setDate }: any) {
  const [date, setCalenderDate] = React.useState<Date>(new Date());
  const [open, setOpen] = React.useState(false); // Track popover state

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDay(format(selectedDate, "EEEE"));
      setDate(format(selectedDate, "MMMM d, yyyy"));
      setCalenderDate(selectedDate);
      setOpen(false); // Close the popover when date is selected
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100%] justify-start text-left text-brandColor font-semibold hover:text-brandColor",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM d, yyyy") : <span>Departure Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Close popover on selection
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
