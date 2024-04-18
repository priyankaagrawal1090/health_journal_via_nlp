import * as React from "react";
import { Button } from "./button";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useNavigate } from "react-router-dom";

const Topnav = () => {
  const navigate = useNavigate();
  const handleOnClickSignIn = () => {
    navigate("/auth");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="border-b flex flex-row h-16">
      <div className="pl-4 py-4 items-center inline">
        <PsychologyIcon />
      </div>
      <div className="px-2 py-4 items-center inline">
        <h2 className="text-lg font-semibold">Health Journal</h2>
      </div>
      <div className="px-4 py-3 items-center">
        <Button className="bg-primary" onClick={handleNavigateHome}>Home</Button>
      </div>
      <div className="ml-auto px-4 py-3 items-center">
        <Button className="" onClick={handleOnClickSignIn}>Sign In</Button>
      </div>
    </div>
  );
};
export default Topnav;
