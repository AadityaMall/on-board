"use client";
import React, { useState, FormEvent, useEffect, useCallback } from "react";
import { InputField } from "@/components/ui/input";
import { LetterText } from "lucide-react";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { Button } from "@/components/ui/button";
import { fetchAirportsAction } from "@/actions/AirportActions";
import { fetchFlightAction } from "@/actions/FlightActions";
import { createScheduleAction } from "@/actions/ScheduleActions";
import { toast } from "react-toastify";
import { DateTimePicker24h } from "@/components/ui/date-picker";
interface Flight {
  flightId: string;
  flightNumber: number;
  company: string;
  totalSeats: number;
  seatType: Array<{ type: string; count: number }>;
}

interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
}

interface FormProps {
  closeDrawer: () => void;
  refetchData: () => void;
}

const AddScheduleForm: React.FC<FormProps> = ({ closeDrawer, refetchData }) => {
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(
    null
  );
  const [flight, setFlight] = useState<Flight | null>(null);
  const [dateTime, setDateTime] = useState<string>("");

  const fetchAirportData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAirportsAction(setLoading);
      setAirports(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFlightData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFlightAction(setLoading);
      setFlights(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirportData();
    fetchFlightData();
  }, [fetchAirportData, fetchFlightData]);

  useEffect(() => {
    if (
      sourceAirport &&
      destinationAirport &&
      sourceAirport.id === destinationAirport.id
    ) {
      toast.error("Source and Destination can't be the same");
      if (destinationAirport !== null) {
        setDestinationAirport(null);
      }
    }
  }, [sourceAirport, destinationAirport]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!flight) {
        throw new Error("Please select a flight");
      }
      if (!sourceAirport) {
        throw new Error("Please select a source airport");
      }
      if (!destinationAirport) {
        throw new Error("Please select a destination airport");
      }
      if (!dateTime) {
        throw new Error("Please select a date and time");
      }
      const data = {
        flightId: flight.flightId,
        sourceAirport: sourceAirport.id,
        destinationAirport: destinationAirport.id,
        dateTime: dateTime,
      };
      console.log(data);
      const result = await createScheduleAction(data);
      if (result.success) {
        toast.success(result.data.message || "Schedule created successfully");
        refetchData();
        closeDrawer();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create airport");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!loading && (
        <div className="flex flex-col w-full">
          <div className="min-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Add Schedule
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Select Flight */}
              <div>
                <label className="block text-sm font-medium">
                  Select Flight
                </label>
                <CustomAutocomplete
                  value={flight}
                  setValue={setFlight}
                  getOptionLabel={(option) =>
                    `${option?.flightNumber} ${option?.company}`
                  }
                  data={flights ? flights : []}
                  placeholder="Select Flight"
                />
              </div>

              {/* Select Source Airport */}
              <div>
                <label className="block text-sm font-medium">
                  Select Source Airport
                </label>
                <CustomAutocomplete
                  value={sourceAirport}
                  setValue={setSourceAirport}
                  getOptionLabel={(option) => option?.name || ""}
                  data={airports ? airports : []}
                  placeholder="Select Airport"
                />
              </div>

              {/* Select Destination Airport */}
              <div>
                <label className="block text-sm font-medium">
                  Select Destination Airport
                </label>
                <CustomAutocomplete
                  value={destinationAirport}
                  setValue={setDestinationAirport}
                  getOptionLabel={(option) => option?.name || ""}
                  data={airports ? airports : []}
                  placeholder="Select Airport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Select Date and Time
                </label>
                <DateTimePicker24h onChange={(date) => setDateTime(date)} />
              </div>
              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Schedule"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddScheduleForm;
