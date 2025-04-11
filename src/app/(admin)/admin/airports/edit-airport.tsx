"use client";
import React, { useState, FormEvent } from "react";
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
import { cities } from "@/data/cities";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { LetterText,Edit } from "lucide-react";
interface EditDialogProps {
  preselectedAirport: any;
  refetchData: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  preselectedAirport,
  refetchData,
}) => {
  const [name, setName] = useState(preselectedAirport?.name || "");
  const [city, setCity] = useState(preselectedAirport?.city || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        id: preselectedAirport?.id, // Ensure airport exists
        airportName: name,
        city: city,
        country: "IN",
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
          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select City
            </label>
            <CustomAutocomplete
              value={city}
              setValue={setCity}
              data={cities}
              getOptionLabel={(option) => option}
            />
          </div>

          <InputField
            label="Airport Name"
            type="text"
            id="airportName"
            name="airportName"
            value={name}
            icon={<LetterText size={20} className="form-icon" />}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter airport name"
            className="w-full"
          />
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Airport"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
