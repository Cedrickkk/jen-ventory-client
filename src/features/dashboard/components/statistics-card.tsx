import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsCardProps {
  title?: string;
  value?: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function StatisticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: StatisticsCardProps) {
  return (
    <Card className={cn("w-full max-w-xs rounded-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && (
          <div className="bg-primary/10 rounded-md p-2">
            <Icon className="text-primary size-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
