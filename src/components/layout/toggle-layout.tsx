import { Button } from "@/components/ui/button";
import { useLayoutStore } from "@/stores/use-layout-store";
import { Maximize, Minimize } from "lucide-react";

export function ToggleLayout() {
  const { isCompact, toggleLayout } = useLayoutStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLayout}
      className="text-primary"
      title={isCompact ? "Switch to Expanded" : "Switch to Compact"}
    >
      {isCompact ? (
        <Maximize className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Minimize className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle layout density</span>
    </Button>
  );
}
