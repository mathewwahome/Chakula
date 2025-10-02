import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
interface FilterOption {
  id: string;
  label: string;
}
interface FilterAccordionProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  onChange: (selectedIds: string[]) => void;
  allowMultiple?: boolean;
}
const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  options,
  selectedOptions,
  onChange,
  allowMultiple = true
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionChange = (id: string) => {
    if (allowMultiple) {
      const newSelectedOptions = selectedOptions.includes(id) ? selectedOptions.filter(optionId => optionId !== id) : [...selectedOptions, id];
      onChange(newSelectedOptions);
    } else {
      onChange([id]);
    }
  };
  return <div className="border-b border-gray-200 py-4">
      <button className="flex justify-between items-center w-full text-left font-medium text-neutral-dark focus:outline-none" onClick={toggleAccordion}>
        <span>{title}</span>
        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>
      {isOpen && <div className="mt-3 space-y-2 pl-1">
          {options.map(option => <label key={option.id} className="flex items-center cursor-pointer">
              <input type={allowMultiple ? 'checkbox' : 'radio'} checked={selectedOptions.includes(option.id)} onChange={() => handleOptionChange(option.id)} className="mr-2" />
              <span className="text-gray-700">{option.label}</span>
            </label>)}
        </div>}
    </div>;
};
export default FilterAccordion;