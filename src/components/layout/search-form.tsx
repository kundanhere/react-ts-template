import { AiSearch02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <InputGroup className="max-w-sm">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <HugeiconsIcon
              icon={AiSearch02Icon}
              className="text-muted-foreground"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⇧ ⌘ K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </form>
  );
}
