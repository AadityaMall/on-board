"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchAirportsAction,
  deleteAirportAction,
} from "@/actions/AirportActions";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Trash2 } from "lucide-react";
import AirportForm from "./add-airport";
import CustomDrawer from "@/components/Admin/Layout/CustomDrawer";
import EditDialog from "./edit-airport"; // Create this component

interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
}

const AirportPage = () => {
  const [rows, setRows] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      editable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 110,
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 110,
      flex: 0.5,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div className="!flex !items-center gap-4">
            <Button onClick={() => handleEdit(params.row)}>
              <Edit />
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const data = await fetchAirportsAction(setLoading);
      setRows(data.data);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
  }, []);

  const handleEdit = (airport: Airport) => {
    setSelectedAirport(airport);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Show confirmation dialog
      if (!confirm("Are you sure you want to delete this airport?")) {
        return;
      }
      const response = await deleteAirportAction(id);
      if (response.success) {
        toast.success(response.message);
        fetchData(); // Refetch data after successful deletion
      } else {
        toast.error(response.message);
      }
      if (response.warning) {
        toast.warning(response.warning);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full mt-8">
        <div className="flex justify-between md:mx-12 items-baseline">
          <h2 className="mt-5 font-bold text-xl">
            <span className="text-brandColor">Airport</span> data for OnBoard
          </h2>
          <CustomDrawer
            triggerText="Add"
            content={
              <AirportForm
                closeDrawer={() => setIsDrawerOpen(false)}
                refetchData={fetchData}
              />
            }
            open={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
          />
        </div>
        <div className="w-[90%] mx-auto mt-5">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </div>
      </div>

      <EditDialog
        open={isEditOpen}
        onClose={() => {
          setSelectedAirport(null);
          setIsEditOpen(false);
        }}
        airport={
          selectedAirport ? selectedAirport : { id: 0, name: "", city: "" }
        }
        refetchData={fetchData}
      />
    </>
  );
};

export default AirportPage;
