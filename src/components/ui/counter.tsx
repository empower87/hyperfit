import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./button";
import { Input } from "./input";

export default function Counter() {
  return (
    <div className={`flex space-x-1`}>
      <Button variant="outline" size="icon">
        <MinusIcon fill="white" />
      </Button>
      <Input placeholder="3" />
      <Button variant="outline" size="icon">
        <PlusIcon fill="white" />
      </Button>
    </div>
  );
}
