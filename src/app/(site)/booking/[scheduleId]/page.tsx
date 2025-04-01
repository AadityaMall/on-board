"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeatSelection from "./SeatSelection";
import { getScheduleById } from "@/actions/ScheduleActions";
import { format } from "date-fns";

interface SeatTypeInfo {
  type: string;
  price: number;
  startSeatNumber: number;
  endSeatNumber: number;
}

export default function ScheduleBookingPage() {
  const { scheduleId } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatTypeforSelection, setseatTypeforSelection] = useState<
    SeatTypeInfo[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  {console.log(selectedSeats)}

  useEffect(() => {
    const getScheduleDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getScheduleById(scheduleId as string);
        setSchedule(data.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load schedule details");
      } finally {
        setIsLoading(false);
      }
    };

    getScheduleDetails();
  }, [scheduleId]);

  useEffect(() => {
    if (schedule?.flightResponse?.seatType) {
      console.log(schedule.flightResponse);
      const totalSeats = schedule.flightResponse.totalSeats || 0;
      const seatTypeArray = schedule.flightResponse.seatType || [];
      console.log(seatTypeArray);
      // Transform the seat types and calculate start/end seat numbers
      let startSeatNumber = 1;
      const transformedSeatTypes = seatTypeArray.map((type: any) => {
        const count = type.count || 0;
        const price = type.price || 0;
        const typeInfo = {
          type: type.type,
          price: price,
          startSeatNumber: startSeatNumber,
          endSeatNumber: startSeatNumber + count - 1,
        };
        startSeatNumber += count;
        return typeInfo;
      });

      setseatTypeforSelection(transformedSeatTypes);
    }
  }, [schedule]);

  useEffect(() => {
    let price = 0;
    selectedSeats.forEach((seatNumber) => {
      const seatType = getSeatType(seatNumber);
      if (seatType) {
        price += seatType.price;
      }
    });
  
    setTotalPrice(price);
  }, [selectedSeats, seatTypeforSelection])

  const getSeatType = (seatNumber: number): SeatTypeInfo | undefined => {
    return seatTypeforSelection.find(
      (type) =>
        seatNumber >= type.startSeatNumber && seatNumber <= type.endSeatNumber
    );
  };

  const handleSelectionChange = (seats: number[]) => {
    setSelectedSeats(seats);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Loading Schedule details...
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600">Schedule Not Found</h2>
        <p className="text-gray-600 mt-2">
          The requested flight schedule could not be found.
        </p>
        <Button className="mt-6" onClick={() => router.push("/schedules")}>
          Browse All Flights
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row lg:gap-6">
      {/* Left Side - Flight Details and Seat Selection */}
      <div className="flex-1">
        {/* Flight and Journey Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-bold text-lg">
                {format(new Date(schedule.dateTime), "dd MMMM, yyyy")}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      schedule.flightResponse.bookedSeats
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <SeatSelection
          scheduleId={scheduleId as string}
          seats={schedule.seats || []}
          seatTypes={seatTypeforSelection || []}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Right Side - Booking Summary */}
      <div className="lg:w-1/3 w-full sticky top-6 self-start">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Selected Seats:</span>
              <span>
                {selectedSeats.length > 0
                  ? selectedSeats.sort((a, b) => a - b).join(", ")
                  : "None selected"}
              </span>
            </div>
            {selectedSeats.map((seatNumber) => {
              const seatType = getSeatType(seatNumber);
              return (
                <div
                  key={seatNumber}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    Seat {seatNumber} ({seatType?.type})
                  </span>
                  <span>₹{seatType?.price.toLocaleString()}</span>
                </div>
              );
            })}
            <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
              <span>Total Price:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              disabled={selectedSeats.length === 0}
              className="w-full bg-brandColor hover:bg-opacity-90 text-white font-medium px-6 py-2 rounded transition-colors"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
