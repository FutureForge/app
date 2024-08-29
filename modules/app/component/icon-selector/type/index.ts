import { Profile, Search, Logo } from "./svgs/svgs";

export const ICON_TYPE: {
  [key: string]: {
    [key: string]: React.ComponentType<any>;
  };
} = {
  SVGS: {
    profile: Profile,
    search: Search,
    logo: Logo
  },
};
