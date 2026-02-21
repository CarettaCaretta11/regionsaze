"use client";

interface Props {
  hintsUsed: number;
  maxHints: number;
  onShowNextOutline: () => void;
  onShowAllOutlines: () => void;
  disabled: boolean;
}

export default function HintSection({
  hintsUsed,
  maxHints,
  onShowNextOutline,
  onShowAllOutlines,
  disabled,
}: Props) {
  return (
    <div className="w-full max-w-md">
      <p className="text-[#999980] text-sm mb-2">
        Get a hint ({hintsUsed}/{maxHints}):
      </p>
      <div className="space-y-2">
        <button
          onClick={onShowNextOutline}
          disabled={disabled || hintsUsed >= maxHints}
          className="w-full py-2.5 rounded-lg border border-[#5a5a3a] text-[#c8c8a0] hover:bg-[#3a3a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Show next province outline
        </button>
        <button
          onClick={onShowAllOutlines}
          disabled={disabled}
          className="w-full py-2.5 rounded-lg border border-[#5a5a3a] text-[#c8c8a0] hover:bg-[#3a3a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Show all province outlines
        </button>
      </div>
    </div>
  );
}
