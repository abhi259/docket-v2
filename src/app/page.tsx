"use client";

import ChatInputStatic from "./_components/ChatInputStatic";
import SideBar from "./_components/SideBar";
import Body from "./_components/body/Body";

export default function Home() {
  return (
    <div className="flex w-full h-full ">
      <div className="flex w-full flex-col grow gap-4 ">
        <div className="flex w-full h-full bg-white">
          <SideBar />
          <Body />
        </div>
      </div>
      <ChatInputStatic />
    </div>
  );
}
