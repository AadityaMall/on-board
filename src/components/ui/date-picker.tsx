"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
// import { utcToZonedTime } from "date-fns-tz";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DatePicker({ setDay, setDate }: any) {
  const [date, setCalenderDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false); // Track popover state


  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDay(format(selectedDate, "EEEE"));
      setCalenderDate(selectedDate);
      setOpen(false);
  
      const localDate = new Date(selectedDate);
      const startUtc = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate() - 1, 18, 30, 0, 0)); 

      const endUtc = new Date(startUtc);
      endUtc.setUTCDate(endUtc.getUTCDate() + 1);
      endUtc.setUTCHours(18, 29, 59, 999);
    
      setDate(startUtc.toISOString(), endUtc.toISOString());
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
          onSelect={handleDateSelect}
          initialFocus
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  );
}
export function DateTimePicker24h({
  onChange,
}: {
  onChange: (dateTime: string) => void;
}) {
  const [date, setDate] = React.useState<Date | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      updateDateTime(selectedDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") newDate.setHours(parseInt(value));
      if (type === "minute") newDate.setMinutes(parseInt(value));

      setDate(newDate);
      updateDateTime(newDate);
    }
  };

  const updateDateTime = (updatedDate: Date) => {
    // Convert directly to ISO string which is in UTC format
    onChange(updatedDate.toISOString()); // Send UTC time to backend
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left text-brandColor font-semibold hover:text-brandColor",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd-MM-yyyy HH:mm") : <span>Select Date and Time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date || new Date()}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date?.getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date?.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}