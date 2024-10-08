import { Profile, Search, Logo, MintCoin, Download, Caret, Coins, Arrow, Cart } from "./svgs/svgs";

export const ICON_TYPE: {
  [key: string]: {
    [key: string]: React.ComponentType<any>;
  };
} = {
  SVGS: {
    profile: Profile,
    search: Search,
    logo: Logo,
    "mint-coin": MintCoin,
    download: Download,
    caret: Caret,
    coins: Coins,
    arrow: Arrow,
    cart: Cart


  },
};
