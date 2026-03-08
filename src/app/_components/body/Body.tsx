import Menu from "./Menu";
import SearchBar from "./SearchBar";

export default function Body() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 px-10 pt-10">
        <SearchBar />
      </div>
      <p className="text-2xl font-bold pb-4 px-10 top-0 bg-white z-10">
        Our Menu
      </p>
      <div className="flex-1 overflow-scroll mx-10 mb-4 pb-10 rounded-2xl ">
        <Menu />
      </div>
    </div>
  );
}
