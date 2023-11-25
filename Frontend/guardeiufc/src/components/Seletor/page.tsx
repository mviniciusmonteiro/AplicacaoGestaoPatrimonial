import React from 'react';

interface SelectorProps {
  options: { label: string; value: string }[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({ options, selectedOption, onSelect }) => {
  return (
    <div>
      <label>Seletor:</label>
      {options.map((option) => (
        <div key={option.value} className="form-check">
          <input
            type="radio"
            id={option.value}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => onSelect(option.value)}
            className="form-check-input"
          />
          <label htmlFor={option.value} className="form-check-label">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Selector;
