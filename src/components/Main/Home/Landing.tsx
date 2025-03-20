"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import {toast} from 'react-toastify';

interface City {
  id: number;
  name: string;
  city: string;
  country: string;
}


const Landing = () => {
  const [airports, setAirports] = useState([]);
  const [date, setDate] = useState<String>("");
  const [day, setDay] = useState<String>("");
  const [sourceAirport, setSourceAirport] = useState<City | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<City | null>(null);

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
        setAirports(data.data);
        toast.success(data.message);
      })
      .catch((error) => toast.error("Error fetching airports"));
  }, []);

  useEffect(() => {
    if(sourceAirport && destinationAirport){
      console.log(sourceAirport);
      if(sourceAirport.id === destinationAirport.id){
        toast.error("Source and Destination can't be the same");
        setDestinationAirport(null);
      }
      
    }
  }, [sourceAirport,destinationAirport])
  

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
                <CustomAutocomplete
                value={sourceAirport}
                setValue={setSourceAirport}
                data={airports?airports:[]}
                type="object"
              />
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  {sourceAirport?sourceAirport.city:""}
                </h1>
              </div>
              <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  To
                </h1>
                <CustomAutocomplete
                value={destinationAirport}
                setValue={setDestinationAirport}
                data={airports?airports:[]}
                type="object"
              />
                <h1 className="text-brandGray font-semibold text-sm ml-1">
                  {destinationAirport?destinationAirport.city:""}
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
