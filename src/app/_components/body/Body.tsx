import Menu from "./Menu";
import SearchBar from "./SearchBar";

export default function Body() {
  return (
    <div className="w-full h-full overflow-scroll p-10 ">
      <SearchBar />
      <p className="text-2xl font-bold p-4">Our Menu</p>
      <Menu />
    </div>
  );
}
