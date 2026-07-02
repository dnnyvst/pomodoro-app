import { ChangeEventHandler, ComponentPropsWithoutRef } from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  cn?: string;
}

const Input = ({ id, value, onChange, onBlur, cn, ...rest }: InputProps) => (
  <input
    type="number"
    inputMode="numeric"
    min="0"
    max="60"
    id={id}
    value={value}
    placeholder="00"
    onKeyDown={(e) => {
      if (e.key === "-") {
        e.preventDefault();
      }
    }}
    onChange={(e) => {
      if (e.target.value.length <= 2) {
        onChange(e);
      } else {
        e.preventDefault();
      }
    }}
    onBlur={onBlur}
    className={`rounded-sm w-[2ch] !text-primary !opacity-100 bg-background sm:text-center placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 hover:ring-1 hover:outline-none hover:ring-ring hover:ring-offset-2 ${cn} ring-offset-background`}
    {...rest}
  />
);
export default Input;
