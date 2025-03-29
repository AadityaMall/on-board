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
import { LetterText, Edit } from "lucide-react";
import { updateUserRoleAction } from "@/actions/UserActions";
import { toast } from "react-toastify";
import CustomAutocomplete from "@/components/ui/CustomAutocomplete";

const roles = ["Admin","User"]
export default function EditUser({
  preselectedUser,
  refetchData,
}: {
  preselectedUser: any;
  refetchData: any;
}) {
  const [role, setRole] = useState(preselectedUser.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data =  {
        ...preselectedUser,
        role
      }
      await updateUserRoleAction(data);
      toast.success("User Role Updated Successfully");
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to Update flight");
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
        <form className="space-y-4 " onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            type="text"
            id="flightNumber"
            name="flightNumber"
            value={preselectedUser?.name}
            disabled
            icon={<LetterText size={20} className="form-icon" />}
          />
          <InputField
            label="Email Id"
            type="text"
            id="emailId"
            name="emailId"
            value={preselectedUser?.email}
            disabled
            icon={<LetterText size={20} className="form-icon" />}
          />
          <div>
            <label className="block text-sm font-medium">Select Role</label>
            <CustomAutocomplete
              value={role}
              setValue={setRole}
              data={roles}
              getOptionLabel={(option)=> option}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
