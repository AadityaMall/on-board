"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import React from "react";

interface Seat {
  seatNumber: number;
  status: SeatStatus;
}
interface SeatTypeInfo {
  type: string;
  price: number;
  startSeatNumber: number;
  endSeatNumber: number;
}
enum SeatStatus {
  VACANT,
  PENDING,
  BOOKED,
}
interface SeatSelectionProps {
  scheduleId: string;
  seats: Seat[];
  seatTypes: SeatTypeInfo[];
  onSelectionChange: (selectedSeats: number[]) => void;
}

const SeatSelection = ({
  scheduleId,
  seats,
  seatTypes,
  onSelectionChange,
}: SeatSelectionProps) => {
  const [seatsData, setSeatsData] = useState<Seat[]>(seats);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  // Update parent component when selection changes
  useEffect(() => {
    onSelectionChange(selectedSeats);
  }, [selectedSeats, onSelectionChange]);

  // Handle seat updates from WebSocket
  const handleSeatUpdate = (data: any) => {
    if (!data.seatNumber || !data.status) return;

    setSeatsData((prevSeats) =>
      prevSeats.map((seat) =>
        seat.seatNumber === data.seatNumber
          ? { ...seat, status: data.status as SeatStatus }
          : seat
      )
    );
  };

  // Handle user count updates
  const handleUserCount = (data: any) => {
    if (data.count !== undefined) {
      setActiveUsers(data.count);
    }
  };

  // Toggle seat selection
  const toggleSeatSelection = async (seat: Seat) => {
    if (seat.status === SeatStatus.BOOKED) {
      toast.error("This seat is already booked.");
      return;
    }

    try {
      if (selectedSeats.includes(seat.seatNumber)) {
        // Release seat
        setSelectedSeats((prev) =>
          prev.filter((seatNum) => seatNum !== seat.seatNumber)
        );

        // Send seat release message over WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          console.log("Sending seat release message");
          wsRef.current.send(`UNBLOCK_SEAT:${seat.seatNumber}`);
        }
      } else {
        if (seat.status === SeatStatus.PENDING) {
          toast.error("This seat is being selected by another user.");
          return;
        }

        setSelectedSeats((prev) => [...prev, seat.seatNumber]);

        // Send seat block message over WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          console.log("Sending seat block message");
          wsRef.current.send(`BLOCK_SEAT:${seat.seatNumber}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error selecting seat");
    }
  };

  const getSeatType = (seatNumber: number): SeatTypeInfo | undefined => {
    return seatTypes.find(
      (type) =>
        seatNumber >= type.startSeatNumber && seatNumber <= type.endSeatNumber
    );
  };


  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/seats/${scheduleId}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to Schedule WebSocket");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle user count updates
      if (data.count !== undefined) {
        setActiveUsers(data.count);
      }

      // Handle seat blocked message
      if (data.type === "BLOCKED_SEATS" && data.seats) {
        setSeatsData((prevSeats) =>
          prevSeats.map((seat) =>
            data.seats.includes(seat.seatNumber)
              ? { ...seat, status: SeatStatus.PENDING }
              : seat
          )
        );
      }

      // Handle seat released message
      if (data.type === "UNBLOCKED_SEATS" && data.seats) {
        setSeatsData((prevSeats) =>
          prevSeats.map((seat) =>
            data.seats.includes(seat.seatNumber)
              ? { ...seat, status: SeatStatus.VACANT }
              : seat
          )
        );
      }
    };

    ws.onclose = () => {};
    return () => ws.close();
  }, [scheduleId]);

  return (
    <div className="w-full max-w-screen-lg mx-auto bg-white p-6 rounded-lg shadow-md border-2">
      {/* Header Section */}
      <div className="mb-4 p-4 rounded-md flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Select Your Seats</h3>
        <span className="text-lg text-muted-foreground">
          {activeUsers} {activeUsers === 1 ? "person" : "people"} currently
          viewing
        </span>
      </div>

      {/* Seat Types Info */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          {seatTypes.map((type, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`w-6 h-6 rounded-full`}
                style={{ backgroundColor: getColorForSeatType(type.type) }}
              ></div>
              <span className="text-sm text-gray-700">
                {type.type} - ₹{type.price}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-start gap-5 mb-15 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-200 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-amber-300 rounded-full"></div>
            <span>Selected by You</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-200 rounded-full"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="relative mb-8">
        <div className="absolute inset-x-0 -top-6 flex justify-center">
          <div className="bg-gray-600 rounded-t-lg w-[60%] h-6 flex items-center justify-center text-white text-sm">
            Front of Aircraft
          </div>
        </div>
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-lg">
          <div className="grid gap-3 grid-cols-5 md:grid-cols-14 lg:grid-cols-16">
            {seatTypes.map((seatType, typeIndex) => (
              <React.Fragment key={typeIndex}>
                {typeIndex > 0 && (
                  <div className="col-span-full border-b border-gray-300 my-2" />
                )}
                <div className="col-span-full text-xs font-medium text-gray-700 mb-1 mt-1">
                  {seatType.type} Section
                </div>
                {seatsData
                  .filter(
                    (seat) =>
                      seat.seatNumber >= seatType.startSeatNumber &&
                      seat.seatNumber <= seatType.endSeatNumber
                  )
                  .map((seat) => {
                    const isSelected = selectedSeats.includes(
                      seat.seatNumber
                    );

                    return (
                      <button
                        key={seat.seatNumber}
                        onClick={() => toggleSeatSelection(seat)}
                        disabled={
                          seat.status === SeatStatus.BOOKED ||
                          (seat.status === SeatStatus.PENDING && !isSelected)
                        }
                        className={`p-2 rounded-full text-center text-xs transition-all h-9 w-9 
                        ${getSeatStatusClass(seat.status, isSelected)} 
                        ${getBorderForSeatType(seatType.type)} hover:scale-105`}
                        title={`Seat ${seat.seatNumber} - ${seatType.type} (₹${seatType.price})`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Seats Display */}
      <div className="mt-6">
        <h4 className="font-semibold text-xl mb-2">Selected Seats:</h4>
        <div className="flex flex-wrap gap-2">
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seatNumber) => {
              const seatType = getSeatType(seatNumber);
              return (
                <div
                  key={seatNumber}
                  className="bg-amber-100 border border-amber-300 rounded-md px-3 py-1 flex items-center"
                >
                  Seat {seatNumber}
                  {seatType && (
                    <span className="ml-2 text-sm text-gray-700">
                      ({seatType.type}: ₹{seatType.price})
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No seats selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for styling
function getSeatStatusClass(status: SeatStatus, isSelected: boolean): string {
  if (isSelected) {
    return "bg-amber-300 hover:bg-amber-400";
  }

  switch (status) {
    case SeatStatus.VACANT:
      return "bg-green-200 hover:bg-green-300";
    case SeatStatus.PENDING:
      return "bg-orange-200 cursor-not-allowed";
    case SeatStatus.BOOKED:
      return "bg-red-200 cursor-not-allowed opacity-70";
    default:
      return "bg-gray-200";
  }
}

function getColorForSeatType(type: string): string {
  switch (type.toLowerCase()) {
    case "economy":
      return "#C5E1A5"; // Light green
    case "premium economy":
      return "#FFD54F"; // Light amber
    case "business":
      return "#90CAF9"; // Light blue
    case "first class":
      return "#CE93D8"; // Light purple
    default:
      return "#E0E0E0"; // Light gray
  }
}

function getBorderForSeatType(type: string): string {
  switch (type.toLowerCase()) {
    case "economy":
      return "border-2 border-green-500";
    case "premium economy":
      return "border-2 border-amber-500";
    case "business":
      return "border-2 border-blue-500";
    case "first class":
      return "border-2 border-purple-500";
    default:
      return "border border-gray-300";
  }
}

export default SeatSelection;
