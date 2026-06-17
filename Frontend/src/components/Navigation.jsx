import React from 'react'

const Navigation = ({ items, activeId, onSelect, onDownloadResume }) => {
    return (
        <nav className="flex w-full shrink-0 flex-col justify-between border-b border-gray-200 bg-slate-50 p-4 md:p-6 lg:w-56 lg:border-b-0 lg:border-r xl:w-60">
            <div>
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Sections
                </p>
                <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
                    {items.map(item => (
                        <button
                            type="button"
                            key={item.id}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                                activeId === item.id
                                    ? 'bg-indigo-50 font-medium text-indigo-600'
                                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                            }`}
                            onClick={() => onSelect(item.id)}
                        >
                            <span className="flex shrink-0 items-center">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={onDownloadResume}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 lg:mt-6"
            >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" /></svg>
                Download Resume
            </button>
        </nav>
    )
}

export default Navigation
