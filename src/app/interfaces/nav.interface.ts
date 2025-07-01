export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

export interface NavConfig {
  productOwner: NavItem[];
  scrumMaster: NavItem[];
  sdetEngineer: NavItem[];
}