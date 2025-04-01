"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { InputField } from "@/components/ui/input";
import { LetterText, PlusCircle, Trash2,DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createFlightAction } from "@/actions/FlightActions";
import { toast } from "react-toastify";

interface FlightFormProps {
  closeDrawer: () => void;
  refetchData: () => void;
}

const FlightForm: React.FC<FlightFormProps> = ({
  closeDrawer,
  refetchData,
}) => {
  const [loading, setLoading] = useState(false);
  const [flightNumber, setFlightNumber] = useState<number | "">("");
  const [company, setCompany] = useState<string>("");
  const [totalSeats, setTotalSeats] = useState<number | "">("");
  const [seatTypes, setSeatTypes] = useState<
    { type: string; count: number; price: number }[]
  >([{ type: "", count: 0, price: 0 }]);

  // Handle Input Changes
  const handleSeatTypeChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const updatedSeats = [...seatTypes];
    updatedSeats[index] = { ...updatedSeats[index], [key]: value };
    setSeatTypes(updatedSeats);
  };

  const addSeatType = () => {
    setSeatTypes([...seatTypes, { type: "", count: 0, price: 0 }]);
  };

  const removeSeatType = (index: number) => {
    setSeatTypes(seatTypes.filter((_, i) => i !== index));
  };

  // Calculate total seat type count
  const totalSeatTypeCount = seatTypes.reduce(
    (sum, seat) => sum + seat.count,
    0
  );

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (totalSeatTypeCount !== totalSeats) {
      toast.error("Total seat count must match total seats!");
      return;
    }

    const flightData = {
      flightNumber: Number(flightNumber),
      company,
      totalSeats: Number(totalSeats),
      seatType: seatTypes.map((seat) => ({
        type: seat.type.toUpperCase(),
        count: seat.count,
        price: seat.price,
      })),
    };

    setLoading(true);
    try {
      const response = await createFlightAction(flightData);
      toast.success(response.data.message);
      refetchData();
      closeDrawer();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create flight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-h-[60vh] overflow-y-auto">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Flight</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Flight Number"
            type="number"
            min={0}
            id="flightNumber"
            name="flightNumber"
            value={flightNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFlightNumber(Number(e.target.value))
            }
            icon={<LetterText size={20} className="form-icon" />}
          />
          <InputField
            label="Company Name"
            type="text"
            id="companyName"
            name="companyName"
            value={company}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCompany(e.target.value)
            }
            icon={<LetterText size={20} className="form-icon" />}
          />
          <InputField
            label="Total Seats"
            type="number"
            min={0}
            id="totalSeats"
            name="totalSeats"
            value={totalSeats}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTotalSeats(Number(e.target.value))
            }
            icon={<LetterText size={20} className="form-icon" />}
          />

          {/* Seat Types Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Seat Types</label>
            {seatTypes.map((seat, index) => (
              <div key={index} className="flex items-end gap-x-2">
                <div className="flex-1">
                  <InputField
                    label="Type"
                    type="text"
                    id={`seatType-${index}`}
                    name={`seatType-${index}`}
                    value={seat.type}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSeatTypeChange(index, "type", e.target.value)
                    }
                    icon={<LetterText size={20} className="form-icon" />}
                  />
                </div>

                <div className="flex-1">
                  <InputField
                    label="Count"
                    type="number"
                    min={0}
                    id={`seatCount-${index}`}
                    name={`seatCount-${index}`}
                    value={seat.count}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSeatTypeChange(
                        index,
                        "count",
                        Number(e.target.value)
                      )
                    }
                    icon={<LetterText size={20} className="form-icon" />}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Price"
                    type="number"
                    min={0}
                    step="0.01"
                    id={`seatPrice-${index}`}
                    name={`seatPrice-${index}`}
                    value={seat.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSeatTypeChange(
                        index,
                        "price",
                        Number(e.target.value)
                      )
                    }
                    icon={<DollarSign size={20} className="form-icon" />}
                  />
                </div>
                {index > 0 && (
                  <Button
                    variant="destructive"
                    className="p-0 mb-4"
                    size="icon"
                    onClick={() => removeSeatType(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" onClick={addSeatType} className="w-full">
              <PlusCircle size={18} />
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || totalSeatTypeCount !== totalSeats}
          >
            {loading ? "Adding..." : "Add Flight"}
          </Button>

          {/* Warning Message if Counts Don't Match */}
          {totalSeatTypeCount !== totalSeats && (
            <p className="text-red-500 text-sm text-center">
              Total seat types must equal total seats ({totalSeatTypeCount}/
              {totalSeats})
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FlightForm;
