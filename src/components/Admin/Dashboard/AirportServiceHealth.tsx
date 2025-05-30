"use client";
import React, { useEffect, useState } from "react";
import { fetchAirportServiceHealthStatus } from "@/actions/DashBoardActions";
import { toast } from "react-toastify";
import { CheckCircleIcon, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
const AirportServiceHealth = () => {
  const [status, setStatus] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      const data = await fetchAirportServiceHealthStatus();
      toast.info("Airport Service :" + data.status);
      setStatus(data.status);
    } catch (error: any) {
      toast.error("Error fetching data:", error);
    }
  };
  const pingBanckend = async () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        className={`w-full flex flex-col items-center justify-center border-2 
      border-gray-300 rounded-lg p-4 shadow-md ${
        status === "UP" ? "bg-green-300" : "bg-red-300"
      }`}
      >
        {status === "UP" ? (
          <CheckCircleIcon className="text-green-900 !h-[50%] !w-[50%]" />
        ) : (
          <CircleX className="text-red-500 !h-[50%] !w-[50%]" />
        )}
        <h2 className="text-2xl my-2 font-bold text-center">Airport Service</h2>
        <span className="text-xl font-semibold">
          {status ? status : "DOWN"}
        </span>
        <Button
          variant="outline"
          className="mt-2 hover:font-semibold hover:text-brandColor"
          onClick={pingBanckend}
        >
          Check Status
        </Button>
      </div>
    </>
  );
};

export default AirportServiceHealth;
