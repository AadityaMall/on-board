"use client";

import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { LetterText, PlusCircle, Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { updateFlightAction } from "@/actions/FlightActions";

export default function FlightDialog({
  preselectedFlight,
  refetchData,
}: {
  preselectedFlight: any;
  refetchData: any;
}) {
  const [flightNumber, setFlightNumber] = useState(
    preselectedFlight.number || ""
  );
  const [company, setCompany] = useState(preselectedFlight.company || "");
  const [totalSeats, setTotalSeats] = useState(
    preselectedFlight.totalSeats || 0
  );
  const [seatTypes, setSeatTypes] = useState(preselectedFlight.seatTypes || []);
  const [loading, setLoading] = useState(false);

  const handleSeatTypeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedSeats = [...seatTypes];
    updatedSeats[index] = { ...updatedSeats[index], [field]: value };
    setSeatTypes(updatedSeats);
  };

  const addSeatType = () => {
    setSeatTypes([...seatTypes, { type: "", count: 0 }]);
  };

  const removeSeatType = (index: number) => {
    setSeatTypes(seatTypes.filter((_: any, i: any) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (totalSeatTypeCount !== totalSeats) {
      toast.error("Total seat count must match total seats!");
      return;
    }

    const flightData = {
      flightId: preselectedFlight.id,
      flightNumber: Number(flightNumber),
      company,
      totalSeats: Number(totalSeats),
      seatType: seatTypes.map((seat: any) => ({
        type: seat.type.toUpperCase(),
        count: seat.count,
      })),
    };
    console.log(flightData);
    setLoading(true);
    try {
      const response = await updateFlightAction(flightData);
      toast.success(response.data.message);
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to Update flight");
    } finally {
      setLoading(false);
    }
  };
  const totalSeatTypeCount = seatTypes.reduce(
    (sum: any, seat: any) => sum + seat.count,
    0
  );

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
            Edit Flight Details
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 " onSubmit={handleSubmit}>
          <InputField
            label="Flight Number"
            type="number"
            min={0}
            id="flightNumber"
            name="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(Number(e.target.value))}
            icon={<LetterText size={20} className="form-icon" />}
          />
          <InputField
            label="Company Name"
            type="text"
            id="companyName"
            name="companyName"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            icon={<LetterText size={20} className="form-icon" />}
          />
          <InputField
            label="Total Seats"
            type="number"
            min={0}
            id="totalSeats"
            name="totalSeats"
            value={totalSeats}
            onChange={(e) => setTotalSeats(Number(e.target.value))}
            icon={<LetterText size={20} className="form-icon" />}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium">Seat Types</label>
            {seatTypes.map((seat: any, index: number) => (
              <div key={index} className="flex items-end gap-x-2">
                <div className="flex-1">
                  <InputField
                    label="Type"
                    type="text"
                    id={`seatType-${index}`}
                    name={`seatType-${index}`}
                    value={seat.type}
                    onChange={(e) =>
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
                    onChange={(e) =>
                      handleSeatTypeChange(
                        index,
                        "count",
                        Number(e.target.value)
                      )
                    }
                    icon={<LetterText size={20} className="form-icon" />}
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
              <PlusCircle size={18} /> Add Seat Type
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || totalSeatTypeCount !== totalSeats}
            >
              {loading ? "Updating..." : "Update Flight"}
            </Button>
          </DialogFooter>

          {totalSeatTypeCount !== totalSeats && (
            <p className="text-red-500 text-sm text-center">
              Total seat types must equal total seats ({totalSeatTypeCount}/
              {totalSeats})
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
