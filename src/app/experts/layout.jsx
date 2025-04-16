import Navbar from "@/components/navbar/navbar";
import RequestSubject from "./requestSubject";
export default function layout({ children }) {
  return (
    <main className="w-full">
      <Navbar />
      {children}
      {/* <RequestSubject /> */}
    </main>
  );
}
