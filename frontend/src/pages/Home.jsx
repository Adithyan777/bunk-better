// Home.jsx

import CustomFooter from "@/components/ui/CustomFooter";
import LoginCard from "./LoginCard";

function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center m-9">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Bunk Better
          </h1>
          <h2 className="text-3xl font-semibold tracking-tight">
            Helps you bunk better.
          </h2>
        </div>
        <LoginCard />
      </div>
      <CustomFooter />
    </>
  );
}

export default Home;
