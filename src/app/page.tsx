"use client";

import Cart from "./_components/cart/Cart";
import SideBar from "./_components/SideBar";
import Body from "./_components/body/Body";
import ChatInput from "./_components/ChatInput";

export default function Home() {
  return (
    <div className="flex w-full h-full ">
      <div className="flex w-full flex-col grow gap-4 ">
        <div className="flex w-full h-full bg-white">
          <SideBar />
          <Body />
          {/* <Cart /> */}
        </div>
      </div>
      <ChatInput />
    </div>
  );
}
