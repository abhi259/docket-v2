import Menu from "./Menu";
import SearchBar from "./SearchBar";

export default function Body() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 px-10 pt-10">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-scroll px-10 pb-10">
        <p className="text-2xl font-bold p-4">Our Menu</p>
        <Menu />
      </div>
    </div>
  );
}
