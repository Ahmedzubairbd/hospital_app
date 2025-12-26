"use client";
import React from "react";
import Icon from "@mui/material/SvgIcon";

const RheumatologyIcon = () => {
  const iconClass = "w-10 h-10 text-gray-700";

  return (
    <Icon className={iconClass} viewBox="0 0 24 24">
      {/* Bone 1 */}
      <path
        d="M7.5 4C6 4 5 5.2 5 6.5c0 .6.2 1.1.5 1.5-.3.4-.5.9-.5 1.5C5 10.8 6 12 7.5 12S10 10.8 10 9.5c0-.6-.2-1.1-.5-1.5.3-.4.5-.9.5-1.5C10 5.2 9 4 7.5 4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* Bone 2 */}
      <path
        d="M16.5 12c-1.5 0-2.5 1.2-2.5 2.5 0 .6.2 1.1.5 1.5-.3.4-.5.9-.5 1.5 0 1.3 1 2.5 2.5 2.5s2.5-1.2 2.5-2.5c0-.6-.2-1.1-.5-1.5.3-.4.5-.9.5-1.5 0-1.3-1-2.5-2.5-2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      {/* Joint Connection */}
      <path
        d="M10 10l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Inflammation Symbol */}
      <circle
        cx="12"
        cy="12"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </Icon>
  );
};

export default RheumatologyIcon;
