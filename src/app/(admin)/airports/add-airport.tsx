"use client";
import React, { useState, FormEvent } from "react";
import { cities } from "@/data/cities";
import { InputField } from "@/components/ui/input";
import { LetterText } from "lucide-react";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";
import { Button } from "@/components/ui/button";
import { createAirportAction } from "@/actions/AirportActions";
import { toast } from "react-toastify";
interface AirportFormProps {
  closeDrawer: () => void;
  refetchData: () => void;
}
const AirportForm : React.FC<AirportFormProps> = ({ closeDrawer,refetchData }) => {
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (!city) {
        throw new Error("Please select a city");
      }
      formData.append("city", city);

      const result = await createAirportAction(formData);
      
      if (result.success) {
        toast.success(result.data.message || "Airport created successfully");
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
    <div className="flex flex-col w-full">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Airport</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium">Select City</label>
            <CustomAutocomplete
              value={city}
              setValue={setCity}
              data={cities}
              type="string"
            />
          </div>

          {/* Airport Name Input */}
          <InputField
            label="Airport Name"
            type="text"
            id="airportName"
            name="airportName"
            icon={<LetterText size={20} className="form-icon" />}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Airport"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AirportForm;
