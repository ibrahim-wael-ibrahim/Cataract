"use client";
import React from "react";

export default function Input({
  icon: Icon,
  onIconClick,
  type = "text",
  placeholder,
  value,
  onChange,
    idInput,
  required = false,
  inputClassName = "",
  containerClassName = "",
  ...rest
}) {
  return (
    <div
      className={`flex justify-between items-center px-4 py-2  rounded-2xl border-2 border-boston-blue-700  hover:bg-boston-blue-400/60  ${containerClassName}`}
    >
      {Icon && (
        <label  htmlFor={idInput}
               className=" uppercase text-md font-extrabold   cursor-pointer"

        >
          <Icon size={34} />
        </label>
      )}
      <input
          id={idInput}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full p-3  outline-none focus:outline-none ${inputClassName}`}
        {...rest}
      />
    </div>
  );
}
