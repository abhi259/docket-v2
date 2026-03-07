import { useFoodStore } from "@/app/store/store";
import { MapPin, Search } from "lucide-react";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useFoodStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full  py-3  flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:ring-2 transition-all"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <MapPin className="w-5 h-5 text-gray-400" />
        <span className="font-medium">Bengaluru</span>
      </div>
    </div>
  );
}
