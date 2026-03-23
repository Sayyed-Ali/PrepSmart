import { useState } from 'react'

function CalendarWidget() {
    const [currentMonth] = useState('October 2024')

    // calendar setup
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const calendarDates = [
        null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ]

    const datesWithEvents = [5, 12, 18]
    const todayDate = 15

    // upcoming events list
    const events = [
        {
            title: 'Mock Interview - Apple',
            time: 'Tomorrow at 10:00 AM'
        },
        {
            title: 'Aptitude Test - Advanced',
            time: 'Oct 18 at 2:00 PM'
        }
    ]

    return (
        <div className="bg-white rounded-xl p-5 lg:p-6 shadow-sm sticky top-6">
            {/* month header with navigation arrows */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-800">{currentMonth}</h3>
                <div className="flex gap-2">
                    <button className="w-7 h-7 bg-gray-100 rounded-md hover:bg-purple-600 hover:text-white transition-all text-sm">
                        ←
                    </button>
                    <button className="w-7 h-7 bg-gray-100 rounded-md hover:bg-purple-600 hover:text-white transition-all text-sm">
                        →
                    </button>
                </div>
            </div>

            {/* calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 mb-5">
                {/* day headers (S M T W T F S) */}
                {dayLabels.map((day, i) => (
                    <div key={i} className="text-center text-xs font-semibold text-gray-600 py-1">
                        {day}
                    </div>
                ))}

                {/* actual dates */}
                {calendarDates.map((date, i) => {
                    let dateClass = 'aspect-square flex items-center justify-center rounded-md text-xs cursor-pointer transition-all'

                    if (date === null) {
                        dateClass = ''
                    } else if (date === todayDate) {
                        dateClass += ' bg-purple-600 text-white font-bold'
                    } else if (datesWithEvents.includes(date)) {
                        dateClass += ' bg-blue-100 text-blue-600 font-medium'
                    } else {
                        dateClass += ' hover:bg-gray-100'
                    }

                    return (
                        <div key={i} className={dateClass}>
                            {date}
                        </div>
                    )
                })}
            </div>

            {/* upcoming events section */}
            <div>
                <h4 className="font-bold text-gray-800 mb-3 text-sm lg:text-base">Upcoming Sessions</h4>
                <div className="space-y-2">
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="p-3 bg-gray-50 rounded-lg border-l-3 border-purple-600"
                        >
                            <div className="font-semibold text-gray-800 text-xs lg:text-sm">
                                {event.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                                {event.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CalendarWidget