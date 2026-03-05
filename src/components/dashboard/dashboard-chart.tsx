"use client";

import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

import { getChartData } from "@/app/(dashboard)/actions";

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function DashboardChart() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });
    const [data, setData] = useState<{ date: string, revenue: number, expenses: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (date?.from && date?.to) {
            setIsLoading(true);
            getChartData(date.from.toISOString(), date.to.toISOString())
                .then(setData)
                .finally(() => setIsLoading(false));
        }
    }, [date]);

    const handleExportCSV = () => {
        if (!data.length) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,Revenue,Expenses\n"
            + data.map(row => `${row.date},${row.revenue},${row.expenses}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="col-span-1 lg:col-span-4 xl:col-span-4 transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border-zinc-800">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-6">
                <div>
                    <CardTitle className="text-xl font-bold">Revenue vs Expenses</CardTitle>
                    <CardDescription>Visual summary of organizational cash flow</CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[260px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="icon" onClick={handleExportCSV} title="Export CSV" className="hidden sm:flex">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleExportCSV} title="Export CSV" className="w-full sm:hidden">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-[350px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                        No financial data found for this period.
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                hide={false}
                                tickFormatter={(value) => `$${value}`}
                                axisLine={false}
                                tickLine={false}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
