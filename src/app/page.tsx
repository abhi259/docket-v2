"use client";

import Cart from "./_components/Cart";
import SideBar from "./_components/SideBar";
import Body from "./_components/body/Body";

export default function Home() {
  return (
    <div className="flex w-full h-full ">
      <div className="flex m-4 w-full flex-col grow gap-4  rounded-2xl overflow-hidden">
        <div className="flex w-full h-full overflow-hidden rounded-2xl bg-white">
          <SideBar />
          <Body />
          <Cart />
        </div>
      </div>
    </div>
  );
}
