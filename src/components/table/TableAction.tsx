import { cn } from "@/lib/utils";
import { DataTable } from "@/components/admin";
import { TableActionsProps } from "@/types";


export const TableActions = ({ render, label = "", className }: TableActionsProps) => (
  <DataTable.Col
    source="id"
    label={label}
    render={(record) => (
      <div className={cn(`flex items-center gap-2`, className)}>
        {render(record)}
      </div>
    )}
  />
);