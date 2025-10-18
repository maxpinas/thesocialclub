import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SourceTooltipProps {
  number: number;
  source: string;
}

export default function SourceTooltip({ number, source }: SourceTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <sup className="cursor-help text-[#76a9f9] hover:text-[#7cbd8e] transition-colors ml-0.5">
          [{number}]
        </sup>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <p className="text-xs">{source}</p>
      </TooltipContent>
    </Tooltip>
  );
}
