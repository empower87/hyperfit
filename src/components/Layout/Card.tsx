import { ReactNode } from "react";

type CardProps = {
  header: ReactNode;
  contents: ReactNode;
  footer?: ReactNode;
};
export default function Card({ header, contents, footer }: CardProps) {
  return (
    <div className="space-y-1 rounded-md bg-primary-600 p-4">
      <div className="flex space-x-1">
        {header}
        {contents}
      </div>

      {footer}
    </div>
  );
}
