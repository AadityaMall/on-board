import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface Station {
  name: string;
  city: string;
  id: number;
  country: string;
}

interface CustomAutocompleteProps {
  value: string | Station | any;
  setValue: (value: string | Station | any) => void;
  data: string[] | Station[];
  type: "string" | "object"; // Determines behavior
}

export default function CustomAutocomplete({ value, setValue, data, type }: CustomAutocompleteProps) {
  return (
    <div className="mt-1">
      <Autocomplete
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        options={data}
        getOptionLabel={(option) => (type === "object" ? (option as Station).name : (option as string))}
        filterOptions={(options, { inputValue }) => {
          if (type === "object") {
            return (options as Station[]).filter((option) =>
              option.city.toLowerCase().includes(inputValue.toLowerCase())
            );
          } else {
            return (options as string[]).filter((option) =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            );
          }
        }}
        disablePortal
        className="!text-brandColor"
        sx={{
          "& .MuiInputBase-root": {
            height: "30px",
            minHeight: "30px",
            padding: "0px 10px",
            alignItems: "center",
            color: "var(--color-brandColor) !important",
            fontWeight: "bold",
            "&:focus, &:focus-within": {
              outline: "none",
              boxShadow: "none",
              border: "none",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            outline: "1px solid #E5E7EB",
            border: "none",
          },
          "& .MuiAutocomplete-option": {
            fontSize: "12px",
            padding: "4px 10px",
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            color: "var(--color-brandColor) !important",
            fontWeight: "bold",
          },
        }}
        renderInput={(params) => (
          <TextField {...params} className="!flex !items-center !text-sm" placeholder="Search..." />
        )}
      />
    </div>
  );
}
