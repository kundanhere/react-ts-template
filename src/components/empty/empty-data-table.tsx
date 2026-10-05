import { Add02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export interface IEmptyDataTableProps extends React.ComponentProps<"div"> {
  emptyStateWidget?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateActions?: React.ReactNode;
}

export function EmptyDataTable({
  emptyStateWidget,
  emptyStateTitle = "Oops! There's nothing here...",
  emptyStateDescription = "There is nothing here to view right now, please add new data to get started.",
  emptyStateActions,
}: IEmptyDataTableProps) {
  return (
    <Empty className="bg-muted/5 flex h-full flex-col items-center justify-center rounded-none border-none">
      <EmptyHeader className="max-w-lg">
        {emptyStateWidget ?? (
          /* Concentric Squircles Icon Container */
          <div className="relative mb-4 flex items-center justify-center">
            {/* Outermost Squircle */}
            <div className="border-primary/10 bg-primary/1 flex size-24 items-center justify-center rounded-[1.75rem] border">
              {/* Middle Squircle */}
              <div className="border-primary/20 bg-primary/2 flex size-20 items-center justify-center rounded-[1.375rem] border">
                {/* Innermost Squircle */}
                <div className="border-primary/30 bg-background text-primary flex size-14 items-center justify-center rounded-2xl border shadow-xs">
                  <HugeiconsIcon icon={Add02Icon} size={22} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>
        )}
        <EmptyTitle className="text-foreground text-base font-semibold">
          {emptyStateTitle}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground mt-1.5 max-w-sm text-xs leading-normal">
          {emptyStateDescription}
        </EmptyDescription>
        {emptyStateActions && (
          <EmptyContent className="mt-4 flex w-full flex-row items-center justify-center gap-2">
            {emptyStateActions}
          </EmptyContent>
        )}
      </EmptyHeader>
    </Empty>
  );
}
