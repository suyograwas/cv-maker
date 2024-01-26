import React from "react";
import { FaChevronRight } from "react-icons/fa6";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
  return (
    <div className="w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center  justify-between  cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md">
      <Icon className=" text-txtPrimary text-xl group-hover:text-white " />
      <p className=" text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className=" text-txtPrimary text-base group-hover:text-white" />
    </div>
  );
};

export default AuthButtonWithProvider;
