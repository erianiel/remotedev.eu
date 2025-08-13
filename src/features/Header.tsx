import { useIsMobile } from "../hooks/useIsMobile";
import KofiButton from "./KofiButton";

function Header() {
  const isMobile = useIsMobile();
  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-2" : "justify-between items-center"}`}
    >
      <div className={`${isMobile && "self-start"} flex flex-col gap-1`}>
        <h1 className="text-xl md:text-3xl text-zinc-700 font-semibold">
          Remote dev jobs in Europe
        </h1>
        <h2 className="text-sm md:text-large text-zinc-500 font-normal">
          Updated frequently. No spam. No distractions.
        </h2>
      </div>
      <KofiButton />
    </div>
  );
}

export default Header;
