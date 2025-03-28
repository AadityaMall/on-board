"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
const Schedules = () => {
  const searchParams = useSearchParams();
  const startUtc = searchParams.get("start");
  const endUtc = searchParams.get("end");
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!startUtc || !endUtc || !source || !destination) return;

      try {
        const uri = `http://localhost:8080/schedule-service/api/schedules?start=${startUtc}&end=${endUtc}`;
        console.log(uri);
        const response = await fetch(uri);
        const data = await response.json();
        setSchedules(data.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, [startUtc, endUtc, source, destination]);
  console.log(schedules);
  return (
    <div>
      {schedules && schedules.map((schedule: any) => (
        <span>{ format(schedule.dateTime,"dd MMMM, yyyy h:mm a")} <br /> </span>
      ))}
    </div>
  );
};

export default Schedules;
