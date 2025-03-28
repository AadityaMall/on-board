"use client";
import React, { useState,useEffect, FormEvent, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAirportAction } from "@/actions/AirportActions";
import { toast } from "react-toastify";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { Button } from "@/components/ui/button";
import {  Edit } from "lucide-react";
import { DateTimePicker24h } from "@/components/ui/date-picker";
import { fetchAirportsAction } from "@/actions/AirportActions";
import { fetchFlightAction } from "@/actions/FlightActions";
interface EditDialogProps {
  preselectedSchedule: any;
  refetchData: () => void;
}
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

const EditDialog: React.FC<EditDialogProps> = ({
  preselectedSchedule,
  refetchData,
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(preselectedSchedule?.sourceAirportResponse);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(
    preselectedSchedule?.destinationAirportResponse
  );
  const [flight, setFlight] = useState<Flight | null>(preselectedSchedule?.flightResponse);
  const [dateTime, setDateTime] = useState<string>(preselectedSchedule?.dateTime);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        id: preselectedSchedule?.id, // Ensure airport exists
        flightId: flight?.flightId,
        sourceAirportId: sourceAirport?.id,
        destinationAirportId: destinationAirport?.id,
        dateTime: dateTime,
      };
      const response = await updateAirportAction(data);
      if (response.success) {
        toast.success("Airport updated successfully!");
        refetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update airport.");
    } finally {
      setLoading(false);
    }
  };
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brandColor font-semibold text-2xl">
            Edit User Role
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleUpdate}>
          {/* Select Flight */}
          <div>
            <label className="block text-sm font-medium">Select Flight</label>
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
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
