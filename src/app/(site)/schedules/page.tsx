"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { DatePicker } from "@/components/ui/date-picker";
import { getSchedulesByDateRange } from "@/actions/ScheduleActions";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAirportsAction } from "@/actions/AirportActions";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { InputField } from "@/components/ui/input";
import { Plane } from "lucide-react";

interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
}

interface Flight {
  flightId: string;
  flightNumber: number;
  company: string;
  totalSeats: number;
  bookedSeats: number;
}

interface Schedule {
  id: string;
  dateTime: string;
  flightResponse: Flight;
  sourceAirportResponse: Airport;
  destinationAirportResponse: Airport;
  bookedSeats: number;
  seats: any;
}

const Schedules = () => {
  const searchParams = useSearchParams();
  const initialStartUtc = searchParams.get("start");
  const initialEndUtc = searchParams.get("end");
  const initialSourceId = searchParams.get("source");
  const initialDestinationId = searchParams.get("destination");

  const [startUtc, setStartUtc] = useState<string>(initialStartUtc || "");
  const [endUtc, setEndUtc] = useState<string>(initialEndUtc || "");
  const [day, setDay] = useState<string>("");

  // For filtering
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(
    null
  );
  const [flightNumber, setFlightNumber] = useState<string>("");

  // For storing data
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  // Handle Date Selection from the DatePicker
  const handleDateSelect = (start: string, end: string) => {
    setStartUtc(start);
    setEndUtc(end);
  };

  // Fetch schedules based on date range
  const fetchSchedules = async () => {
    if (!startUtc || !endUtc) return;

    try {
      setLoading(true);
      const response = await getSchedulesByDateRange(
        startUtc,
        endUtc,
        setLoading
      );

      if (response && response.data) {
        setAllSchedules(response.data);
        setFilteredSchedules(response.data);
        toast.success("Schedules fetched successfully");
      } else {
        setAllSchedules([]);
        setFilteredSchedules([]);
        toast.info("No schedules found for the selected date range");
      }
    } catch (error: any) {
      toast.error(error.message || "Error fetching schedules");
      setAllSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch airports for filters
  const fetchAirports = async () => {
    try {
      setLoading(true);
      const response = await fetchAirportsAction(setLoading);
      setAirports(response.data);
    } catch (error: any) {
      toast.error(error.message || "Error fetching airports");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount or when params change
  useEffect(() => {
    fetchAirports();

    if (initialStartUtc && initialEndUtc) {
      fetchSchedules();
    }
  }, []);

  // Update the filter effect to include company name search
  useEffect(() => {
    if (allSchedules.length === 0) return;

    let filtered = [...allSchedules];

    // Filter by source airport
    if (sourceAirport) {
      filtered = filtered.filter(
        (schedule) => schedule.sourceAirportResponse?.id === sourceAirport.id
      );
    }

    // Filter by destination airport
    if (destinationAirport) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.destinationAirportResponse?.id === destinationAirport.id
      );
    }

    // Filter by flight number or company name
    if (flightNumber.trim() !== "") {
      const searchTerm = flightNumber.toLowerCase();
      filtered = filtered.filter(
        (schedule) =>
          schedule.flightResponse?.flightNumber
            .toString()
            .toLowerCase()
            .includes(searchTerm) ||
          schedule.flightResponse?.company.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredSchedules(filtered);
  }, [sourceAirport, destinationAirport, flightNumber, allSchedules]);

  // Fetch when date changes
  useEffect(() => {
    if (startUtc && endUtc) {
      fetchSchedules();
    }
  }, [startUtc, endUtc]);

  // Set initial filters based on URL params
  useEffect(() => {
    if (airports.length > 0) {
      // Set source airport if provided in URL
      if (initialSourceId) {
        const source = airports.find(
          (airport) => airport.id === parseInt(initialSourceId)
        );
        if (source) setSourceAirport(source);
      }

      // Set destination airport if provided in URL
      if (initialDestinationId) {
        const destination = airports.find(
          (airport) => airport.id === parseInt(initialDestinationId)
        );
        if (destination) setDestinationAirport(destination);
      }
    }
  }, [airports, initialSourceId, initialDestinationId]);

  const handleClearFilters = () => {
    setSourceAirport(null);
    setDestinationAirport(null);
    setFlightNumber("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="w-full bg-white rounded-lg shadow mb-4">
          <button
            className="w-full p-4 text-left flex justify-between items-center"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              <span className="text-sm text-gray-500">
                {sourceAirport || destinationAirport || flightNumber
                  ? "(Active filters applied)"
                  : ""}
              </span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                isFiltersOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isFiltersOpen && (
            <div className="p-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Date Range Picker */}
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <label className="block text-sm font-semibold text-gray-700 w-full text-left">
                    Select Date Range
                  </label>
                  <DatePicker setDate={handleDateSelect} setDay={setDay} />
                </div>

                {/* Source Airport */}
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <label className="block text-sm font-semibold text-gray-700 w-full text-left">
                    From
                  </label>
                  <CustomAutocomplete
                    value={sourceAirport}
                    setValue={setSourceAirport}
                    data={airports}
                    getOptionLabel={(option) =>
                      `${option.city} - ${option.name}`
                    }
                  />
                </div>

                {/* Destination Airport */}
                <div className="space-y-2 flex flex-col justify-center items-center w-full">
                  <label className="block text-sm font-semibold text-gray-700 w-full text-left">
                    To
                  </label>
                  <CustomAutocomplete
                    value={destinationAirport}
                    setValue={setDestinationAirport}
                    data={airports}
                    getOptionLabel={(option) =>
                      `${option.city} - ${option.name}`
                    }
                  />
                </div>

                {/* Flight Number/Airline */}
                <div className="space-y-2 flex flex-col justify-center items-center">
                  <InputField
                    label="Flight No. or Airline"
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    id="searchFlight"
                    name="searchFlight"
                    className="w-full"
                    icon={<Plane size={20} className="form-icon" />}
                  />
                </div>
              </div>

              {/* Clear Filters Button - Centered */}
              <div className="flex justify-center mt-6">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded transition-colors flex items-center justify-center gap-2"
                  onClick={handleClearFilters}
                >
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandColor"></div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {filteredSchedules.length > 0
                ? `Showing ${filteredSchedules.length} ${
                    filteredSchedules.length === 1 ? "schedule" : "schedules"
                  }`
                : "No schedules found"}
            </h2>
          </div>

          {filteredSchedules.length > 0 ? (
            <div className="md:w-[80%] w-full mx-auto my-2">
              {filteredSchedules.map((schedule, index) => (
                <Card
                  key={index}
                  className="overflow-hidden my-4 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="font-bold text-lg">
                            {format(
                              new Date(schedule.dateTime),
                              "dd MMMM, yyyy"
                            )}
                          </span>
                          <span className="ml-2 text-brandColor font-semibold">
                            {format(new Date(schedule.dateTime), "h:mm a")}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Flight</p>
                          <p className="font-semibold">
                            {schedule.flightResponse?.company} #
                            {schedule.flightResponse?.flightNumber}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-semibold">
                            {schedule.sourceAirportResponse?.city}
                          </p>
                          <p
                            className="text-sm text-gray-600 truncate"
                            title={schedule.sourceAirportResponse?.name}
                          >
                            {schedule.sourceAirportResponse?.name}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-semibold">
                            {schedule.destinationAirportResponse?.city}
                          </p>
                          <p
                            className="text-sm text-gray-600 truncate"
                            title={schedule.destinationAirportResponse?.name}
                          >
                            {schedule.destinationAirportResponse?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Available</p>
                            <p className="font-semibold text-green-600">
                              {schedule.flightResponse
                                ? schedule.flightResponse.totalSeats -
                                  schedule.bookedSeats
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Booked</p>
                            <p className="font-semibold text-red-600">
                              {schedule?.bookedSeats || "N/A"}
                            </p>
                          </div>
                        </div>

                        {schedule.flightResponse &&
                        schedule.flightResponse.totalSeats -
                          schedule.bookedSeats >
                          0 ? (
                          <a
                            href={`/booking/${schedule.id}`}
                            className="inline-flex items-center bg-brandColor hover:bg-opacity-90 text-white font-medium px-6 py-2 rounded transition-colors"
                          >
                            Book Now
                          </a>
                        ) : (
                          <div className="text-red-600 font-semibold flex items-center">
                            <svg
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Fully Booked
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No schedules found for the selected criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try selecting a different date or changing your search criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedules;
