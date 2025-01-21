// src/components/Dropdown.tsx
import React from "react";

interface DropdownProps {
  label: string;
  options: { label: string; value: boolean }[];
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div>
    <label>{label}</label>
    <select
      value={value ? "true" : "false"}
      onChange={(e) => onChange(e.target.value === "true")}
    >
      {options.map((option) => (
        <option key={option.label} value={option.value ? "true" : "false"}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
// src/components/TokenSelector.tsx
// import React from "react";

interface TokenSelectorProps {
  label: string;
  tokens: { [key: string]: string };
  value: string;
  onChange: (value: string) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ label, tokens, value, onChange }) => (
  <div>
    <label>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {Object.entries(tokens).map(([tokenName, tokenAddress]) => (
        <option key={tokenAddress} value={tokenAddress}>
          {tokenName}
        </option>
      ))}
    </select>
  </div>
);
