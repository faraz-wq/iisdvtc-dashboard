import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption } from "@/types/gallery";

interface FilterBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  filterOptions: {
    categories: FilterOption[];
    tags: FilterOption[];
  };
}

const FilterBar = ({ onSearch, onFilterChange, filterOptions }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilterChange("category", value === "all" ? "" : value);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    onFilterChange("tag", value === "all" ? "" : value);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions.categories.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedTag} onValueChange={handleTagChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Tags</SelectItem>
              {filterOptions.tags.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
};

export default FilterBar;
