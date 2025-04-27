import React from 'react';
import Select, { MultiValue } from 'react-select';

const CollegeDropdown = ({ colleges, selectedColleges, onChange }: {
  colleges: { _id: string; name: string }[];
  selectedColleges: string[];
  onChange: (selectedIds: string[]) => void;
}) => {
  // Map colleges to options compatible with react-select
  const options = colleges.map((college) => ({
    value: college._id,
    label: college.name,
  }));

  // Map selectedColleges to selected options
  const selectedOptions = options.filter((option) =>
    selectedColleges.includes(option.value)
  );

  // Handle changes in selection
  const handleChange = (selected: MultiValue<{ value: string; label: string }>) => {
    const selectedIds = selected.map((item) => item.value);
    onChange(selectedIds);
  };

  return (
    <Select
      isMulti // Enable multi-select
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Select colleges"
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default CollegeDropdown;