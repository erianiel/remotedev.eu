import { useIsMobile } from "../hooks/useIsMobile";

function KoFiButton() {
  const isMobile = useIsMobile();
  return (
    <a
      href="https://ko-fi.com/R6R31JL3A0"
      target="_blank"
      rel="noopener noreferrer"
      className={` ${isMobile ? "self-end" : ""} flex gap-1 justify-center items-center bg-amber-100 p-1 border-slate-600 border-1 rounded-sm hover:bg-amber-200 shadow-sm cursor-pointer`}
    >
      <img src="../public/kofi_symbol.webp" alt="ko-fi logo" className="w-6" />
      <p className="text-xs">Support me on Ko-fi</p>
    </a>
  );
}

export default KoFiButton;
