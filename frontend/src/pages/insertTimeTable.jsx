import { ChevronRight } from "lucide-react";
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EachDayTimeTable from "@/components/ui/eachDayTimeTable";

function InsertTimeTable() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
    const [selectedDay, setSelectedDay] = useState(null);

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    return (
        <>
            <Card className="m-40">
                <CardHeader>
                    <CardTitle>
                        <h3 className="text-2xl font-bold">
                            Add your time table here
                        </h3>
                    </CardTitle>
                    <Breadcrumb>
                        <BreadcrumbList>
                            {days.map((day, index) => (
                                <React.Fragment key={day}>
                                    <BreadcrumbItem>
                                        <span
                                            onClick={() => handleDayClick(day)}
                                            style={{ 
                                                cursor: 'pointer', 
                                                color: selectedDay === day ? 'black' : 'grey' 
                                            }}
                                        >
                                            {day}
                                        </span>
                                    </BreadcrumbItem>
                                    {index !== days.length - 1 && (
                                        <BreadcrumbSeparator>
                                            <ChevronRight />
                                        </BreadcrumbSeparator>
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-100 gap-y-10 p-10">
                    {selectedDay ? (
                        <EachDayTimeTable key={selectedDay} day={selectedDay} />
                    ) : (
                      <h3 className="text-2xl font-bold">
                           Select a day to add subjects
                      </h3>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default InsertTimeTable;
