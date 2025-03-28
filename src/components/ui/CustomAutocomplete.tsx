import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface CustomAutocompleteProps<T> {
  value: T | null;
  setValue: any;
  data: T[];
  getOptionLabel: (option: T) => string; // Generic function to extract label
  filterOption?: (option: T, inputValue: string) => boolean; // Optional custom filtering
  placeholder?: string;
}

export default function CustomAutocomplete<T>({
  value,
  setValue,
  data,
  getOptionLabel,
  filterOption,
  placeholder = "Search...",
}: CustomAutocompleteProps<T>) {
  return (
    <div className="mt-1">
      <Autocomplete
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        options={data}
        getOptionLabel={getOptionLabel}
        filterOptions={(options, { inputValue }) =>
          options.filter((option) =>
            filterOption
              ? filterOption(option, inputValue)
              : getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
          )
        }
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
          <TextField {...params} className="!flex !items-center !text-sm" placeholder={placeholder} />
        )}
      />
    </div>
  );
}
