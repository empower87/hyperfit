import { filterIcon, searchIcon } from "src/assets/icons/_icons";

type IconProps = {
  name: string;
};

const getIcon = (type: string) => {
  switch (type) {
    case "filter":
      return filterIcon;
    case "search":
      return searchIcon;
    default:
      throw new Error("icon not found");
  }
};

export default function Icon({ name }: IconProps) {
  const icon = getIcon(name);
  return <img src={icon} alt="icon" />;
}
// export default function Icon({ name }: IconProps) {
//   return <img src={`/src/assets/icons/${name}`} />;
// }
