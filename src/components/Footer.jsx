
"use client";

import { Footer } from "flowbite-react";

const CustomFooter = () => {    
  return (
    <Footer container>
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
         
        <Footer.Copyright href="#" by="AI recycle assistant" year={2024} />
      </div>
    </Footer>
  );
}

export default CustomFooter;