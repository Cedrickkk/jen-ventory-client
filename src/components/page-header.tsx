import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  role?: string;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight lg:text-3xl">
            {title}
          </h1>
        </div>
        {description && <p className="text-sm lg:text-lg">{description}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
