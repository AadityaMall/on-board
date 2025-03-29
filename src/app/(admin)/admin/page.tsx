import React from "react";
import ScheduleServiceHealth from "@/components/Admin/Dashboard/ScheduleServiceHealth";
import FlightServiceHealth from "@/components/Admin/Dashboard/FlightServiceHealth";
import AuthServiceHealth from "@/components/Admin/Dashboard/AuthServiceHealth";
import AirportServiceHealth from "@/components/Admin/Dashboard/AirportServiceHealth";
import UserServiceHealth from "@/components/Admin/Dashboard/UserServiceHealth";

const dashboard = () => {
  return (
    <>
      <div className="flex flex-col w-[90%] items-center min-h-screen">
        <h1 className="my-2 text-3xl text-brandColor font-bold">Admin Dashboard</h1>
        <div className="w-full flex justify-center my-8">
          <div className="w-[90%] grid md:grid-cols-3 grid-cols-1 gap-6 space-4">
            <ScheduleServiceHealth />
            <FlightServiceHealth />
            <AuthServiceHealth />
            <AirportServiceHealth />
            <UserServiceHealth />
          </div>
        </div>
      </div>
    </>
  );
};

export default dashboard;
