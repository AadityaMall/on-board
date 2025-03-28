"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2 } from "lucide-react";
import ScheduleForm from "./add-schedule";
import CustomDrawer from "@/components/Admin/Layout/CustomDrawer";
import EditDialog from "./edit-schedule";
import { deleteScheduleAction, getAllSchedules } from "@/actions/ScheduleActions";
import { format } from "date-fns";

interface Schedule {
  id: string;
  company: string;
  source: string;
  destination: string;
  dateTime: string;
  flightNumber: number;
}

const SchedulesPage = () => {
  const [rows, setRows] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const columns = [
    {
      field: "id",
      flex: 1,

      headerName: "ID",
      renderCell: (params: any) => (
        <span className="truncate block" title={params.value}>
          {params.value.slice(0, 8)}... {/* Show only first 8 characters */}
        </span>
      ),
    },
    {
      field: "flightNumber",
      flex: 1,
      headerName: "Flight Number",
      editable: false,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <span>{params.row.flightResponse.flightNumber}</span>
          </div>
        );
      },
    },
    {
      field: "flightCompany",
      headerName: "Company",
      flex: 1,
      editable: false,
      renderCell: (params: any) => {
        return <span>{params.row.flightResponse.company}</span>;
      },
    },
    {
      field: "sourceCity",
      headerName: "Source City",
      flex: 1,

      renderCell: (params: any) => {
        return <span>{params.row.sourceAirportResponse.name}</span>;
      },
    },
    {
      field: "desitnation City",
      headerName: "Destination City",
      flex: 1,

      renderCell: (params: any) => {
        return <span>{params.row.destinationAirportResponse.name}</span>;
      },
    },
    {
      field: "scheduleDate",
      headerName: "schedule Date",
      flex: 1,

      renderCell: (params: any) => {
        return (
          <span>
            {format(new Date(params.row.dateTime), "dd MMMM, yyyy h:mm a")}
          </span>
        );
      },
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
            <EditDialog
              preselectedSchedule={params.row}
              refetchData={fetchScheduleData}
            />
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

  const fetchScheduleData = async () => {
    try {
      const data = await getAllSchedules(setLoading);
      setRows(data.data);
      console.log(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);
  const handleDelete = async (id: string) => {
    try {
      // Show confirmation dialog
      if (!confirm("Are you sure you want to delete this schedule?")) {
        return;
      }
      const response = await deleteScheduleAction(id);
      if (response.success) {
        toast.success(response.message);
        fetchScheduleData(); // Refetch data after successful deletion
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
            <span className="text-brandColor">Schedules </span> data for OnBoard
          </h2>
          <CustomDrawer
            triggerText="Add"
            content={
              <ScheduleForm
                closeDrawer={() => setIsDrawerOpen(false)}
                refetchData={fetchScheduleData}
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
    </>
  );
};

export default SchedulesPage;
