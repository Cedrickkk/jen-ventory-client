import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartAreaInteractive } from "@/features/dashboard/components/chart/area-chart";
import { ChartBarInteractive } from "@/features/dashboard/components/chart/bar-chart";
import { ChartLineMultiple } from "@/features/dashboard/components/chart/line-chart";
import { ChartPieDonutText } from "@/features/dashboard/components/chart/pie-chart";
import StatisticsCard from "@/features/dashboard/components/statistics-card";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Ellipsis,
  HandCoins,
  Package,
  PhilippinePeso,
  RefreshCw,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatisticsCard
          title="Today's Sales"
          value="100"
          subtitle="+20.1% from last month"
          icon={PhilippinePeso}
        />
        <StatisticsCard
          title="Total Active Customers"
          value="8"
          subtitle="+10.5% from last month"
          icon={UsersIcon}
        />
        <StatisticsCard
          title="Low Stock Items"
          value="12"
          subtitle="-2% from last month"
          icon={Package}
        />
        <StatisticsCard
          title="Outstanding Debt"
          value="5"
          subtitle="-2% from last month"
          icon={HandCoins}
        />
        <StatisticsCard
          title="Outstanding Debt"
          value="5"
          subtitle="-2% from last month"
          icon={HandCoins}
        />
      </div>
      <div className="flex items-center justify-between space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Business Analytics
          </h3>
          <p className="text-muted-foreground">
            30 days selected &middot; Feb 3 - March 4, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Field className="mx-auto w-60">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal"
                >
                  <CalendarIcon />
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
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartAreaInteractive />
        <ChartPieDonutText />
        <ChartLineMultiple />
        <ChartBarInteractive />
      </div>
    </div>
  );
}
