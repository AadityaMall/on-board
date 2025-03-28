"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation
import { DatePicker } from "@/components/ui/date-picker";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { toast } from "react-toastify";
import { fetchAirportsAction } from "@/actions/AirportActions";
import { useAuth } from "@/context/AuthContext";

interface City {
  id: number;
  name: string;
  city: string;
  country: string;
}

const Landing = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [day,setDay] = useState()
  const [airports, setAirports] = useState<City[]>([]);
  const [startUtc, setStartUtc] = useState<string>("");
  const [endUtc, setEndUtc] = useState<string>("");
  const [sourceAirport, setSourceAirport] = useState<City | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Date Selection
  const handleDateSelect = (start: string, end: string) => {
    setStartUtc(start);
    setEndUtc(end);
  };

  // Fetch Airports
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAirportsAction(setLoading);
        setAirports(data.data);
        toast.info(data.message);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prevent same Source & Destination selection
  useEffect(() => {
    if (sourceAirport && destinationAirport && sourceAirport.id === destinationAirport.id) {
      toast.error("Source and Destination can't be the same");
      setDestinationAirport(null);
    }
  }, [sourceAirport, destinationAirport]);

  const handleSearch = () => {
    if (!sourceAirport || !destinationAirport || !startUtc || !endUtc) return;

    router.push(
      `/schedules?start=${(startUtc)}&end=${(
        endUtc
      )}&source=${sourceAirport.id}&destination=${destinationAirport.id}`
    );
  };

  return (
    <div className="flex flex-col mt-[5vh]">
      <h1 className="mx-5 my-8 font-semibold text-4xl">
        Hey {user ? user.name.split(" ")[0] : "there"}, Where would you like
        to get <span className="text-brandColor font-bold">OnBoard</span> today?
      </h1>
      <div className="md:w-[80vw] w-[90vw] mx-5 bg-white rounded-lg">
        <div className="bg-brandColor text-white rounded-lg">
          <h1 className="text-center py-[5px] font-medium text-md">
            {user ? "Book a flight" : "Login/Signup to book flights"}
          </h1>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 bg-white text-black p-5">
            {/* Source Airport */}
            <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
              <h1 className="text-brandGray font-semibold text-sm ml-1">From</h1>
              <CustomAutocomplete
                value={sourceAirport}
                setValue={setSourceAirport}
                data={airports}
                getOptionLabel={(option) => option.name}
              />
              <h1 className="text-brandGray font-semibold text-sm ml-1">
                {sourceAirport ? sourceAirport.city : ""}
              </h1>
            </div>

            {/* Destination Airport */}
            <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
              <h1 className="text-brandGray font-semibold text-sm ml-1">To</h1>
              <CustomAutocomplete
                value={destinationAirport}
                setValue={setDestinationAirport}
                data={airports}
                getOptionLabel={(option) => option.name}
              />
              <h1 className="text-brandGray font-semibold text-sm ml-1">
                {destinationAirport ? destinationAirport.city : ""}
              </h1>
            </div>

            {/* Date Picker */}
            <div className="border-2 border-[#E3F4FF] rounded-md flex flex-col gap-2 p-4">
              <h1 className="text-brandGray font-semibold text-sm">Departure</h1>
              <DatePicker setDate={handleDateSelect} setDay={setDay} />
              <h1 className="text-brandGray font-semibold text-sm ml-1">
                {day}
              </h1>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex bg-white justify-center text-black rounded-b-lg pb-5">
            <button
              className={`py-1 px-5 my-2 rounded-full font-semibold text-white ${
                sourceAirport && destinationAirport && startUtc && endUtc
                  ? "bg-brandColor cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!sourceAirport || !destinationAirport || !startUtc || !endUtc}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
