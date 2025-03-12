"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Aos = ({ children }) => {
  useEffect(() => {
    AOS.init();
  }, []);
  return <>{children}</>;
};

export default Aos;
