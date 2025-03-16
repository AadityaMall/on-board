"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Autocomplete } from "@/components/ui/Autocomplete";
import {toast} from 'react-toastify';
const Landing = () => {

  const [airports, setAirports] = useState<
    { value: string; label: string; id: number }[]
  >([]);

  useEffect(() => {
    fetch("http://localhost:8080/airport-service/api/airports")
      .then((response) => {
        if (!response.ok) {
          toast.error("Network response was not ok");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const airportList = Array.isArray(data) ? data : data.data || [];

        setAirports(
          airportList.map((airport: any) => ({
            value: airport.city, // Adjust based on actual API response
            label: airport.airportName,
            id: airport.id,
          }))
        );
      })
      .catch((error) => toast.error("Error fetching airports"));
  }, []);

  const [date, setDate] = useState<String>("");
  const [day, setDay] = useState<String>("");
  const [sourceCity, setSourceCity] = useState<String>("");
  const [sourceAirportId, setSourceAirportId] = useState<String>("");
  const [destinationCity, setDestinationCity] = useState<String>("");
  const [destinationAirportId, setDestinationAirportId] = useState<String>("");
  return (
    <>
      <div className="flex flex-col  mt-[5vh]">
        <h1 className="mx-5 my-8 font-semibold text-4xl">
          Where would you like to get{" "}
          <span className="text-brandColor font-bold">OnBoard</span> today?
        </h1>
        <div className="md:w-[80vw] w-[90vw] mx-5 bg-white rounded-lg">
          <div className="bg-brandColor text-white rounded-lg">
            <h1 className="text-center py-[5px] font-medium text-md">
              Login/Signup to book flights
            </h1>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 bg-white text-black p-5">
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  From
                </h1>
                <Autocomplete
                  setDataId={setSourceAirportId}
                  setDataLabel={setSourceCity}
                  data={airports}
                  label="Airports"
                />
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  {sourceCity}
                </h1>
              </div>
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  From
                </h1>
                <Autocomplete
                  setDataId={setDestinationAirportId}
                  setDataLabel={setDestinationCity}
                  data={airports}
                  label="Airports"
                />
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  {destinationCity}
                </h1>
              </div>
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-brandGray font-semibold text-sm">
                  Departure
                </h1>
                <DatePicker setDate={setDate} setDay={setDay} />
                <h1 className="text-brandGray font-semibold text-sm">{day}</h1>
              </div>
            </div>
            <div className="flex bg-white justify-center text-black rounded-b-lg pb-5">
              <button className="py-1 px-5 my-2 rounded-full bg-[#BCC2CF] font-semibold text-white">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
