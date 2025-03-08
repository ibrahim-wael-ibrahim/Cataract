import React from 'react';
import Spinner from "@/components/ui/Spinner";

function Button({ children, type = 'button', disabled = false,className ,...props } ) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={` ${className} px-4 py-2 min-h-4 flex justify-center items-center  rounded-2xl uppercase text-md font-extrabold  disabled:bg-boston-blue-950 border-2 border-boston-blue-700 hover:bg-boston-blue-400 transition-[background] duration-500 ease-in-out cursor-pointer`}
            {...props}
        >
            {disabled ? <Spinner/> : children}
        </button>
    );
}

export default Button;