'use client'

import { PiInfoThin } from 'react-icons/pi';
import TooltipComponent from './ToolTipComponent';

interface TitleDescriptionProps {
    title: string;
    description?: string;
    className?: string;
    tooltipContent?: string;
    tooltipActive?: boolean;
}

export default function TitleDescription({
    title,
    description,
    tooltipContent,
    tooltipActive = false,
    className
}: TitleDescriptionProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <div className='text-[18px] flex font-sans tracking-wide gap-x-2 items-center'>
                {title}

                {tooltipActive && tooltipContent && (
                    <TooltipComponent content={tooltipContent}>
                        <span className='flex justify-center items-center'>
                            <PiInfoThin size={16} />
                        </span>
                    </TooltipComponent>
                )}
            </div>

            {description && (
                <div className='text-sm dark:text-neutral-400 font-sans mt-1'>
                    {description}
                </div>
            )}
        </div>
    );
}