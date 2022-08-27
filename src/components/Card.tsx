import React from "react";

export interface CardProps {
  title: React.ReactNode | string;
  icon: React.ComponentType<{ className: string; size: number }>;
  tag?: React.ReactNode | string;
  description: React.ReactNode | string;
}

export const Card: React.FC<CardProps> = ({ title, icon, tag, description }) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center text-center rounded border-2 border-gray-300 py-6">
      <Icon className="text-gray-700" size={80} />

      {/* Title and Tag */}
      <span className="font-bold text-xl text-gray-800 my-2">
        <span className="flex justify-center items-center space-x-2">
          <h3>{title}</h3>
          {tag && 
            <span className="uppercase bg-gray-700 text-white rounded px-2 py-1 text-xs leading-none">
              {tag}
            </span>
          }
        </span>
      </span>

      <p className="px-4 text-gray-600">{description}</p>
    </div>
  );
};
