import React from "react";

export default function Spinner({ size = "small" }: { size?: string }) {
  return (
    <div className={`${size === "small" ? "spinner-mini" : "spinner"}`}></div>
  );
}
