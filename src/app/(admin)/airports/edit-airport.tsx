"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { updateAirportAction } from "@/actions/AirportActions";
import { toast } from "react-toastify";
import { cities } from "@/data/cities";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import { LetterText } from "lucide-react";
interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  airport: { id: number; name: string; city: string } | null;
  refetchData: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  airport,
  refetchData,
}) => {
  const [name, setName] = useState(airport?.name || "");
  const [city, setCity] = useState(airport?.city || "");
  const [loading, setLoading] = useState(false);

  // Sync state when airport changes
  useEffect(() => {
    if (airport) {
      setName(airport.name);
      setCity(airport.city);
    }
  }, [airport]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const data = {
        id: airport?.id, // Ensure airport exists
        airportName: name,
        city: city,
        country: "IN",
      };
      const response = await updateAirportAction(data);
      if (response.success) {
        toast.success("Airport updated successfully!");
        refetchData();
        onClose();
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Airport</DialogTitle>
      <DialogContent>
        <form className="space-y-4">
          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select City
            </label>
            <CustomAutocomplete
              value={city}
              setValue={setCity}
              data={cities}
              type="string"
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant={"destructive"}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
