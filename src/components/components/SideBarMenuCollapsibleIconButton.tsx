import React, { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";

export const SideBarMenuCollapsibleIconButton = () => {

    const [open, setOpen] = useState(true);

    return (
        <div className='absolute w-full h-full flex items-center justify-end px-2' onClick={() => { setOpen(!open) }}>
            <IoIosArrowDown className={`transition-all duration-100  ${open ? "-rotate-90 " : "rotate-6"} mr-4`} />
        </div>
    )
}
