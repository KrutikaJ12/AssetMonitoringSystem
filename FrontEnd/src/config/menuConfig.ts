type NavItem = {
  name: string;
//   icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const adminMenu: NavItem[] = [
  // {
  //   icon: <GridIcon />,
  //   name: "Dashboard",
  //   subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  // },
  {
    // icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    // icon: <UserCircleIcon />,
    name: "Sites",
    path: "/admin/sites",
  },

  // {
  //   name: "Assets",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  {
    // icon: <UserCircleIcon />,
    name: "Assets",
    path: "/admin/assets",
  },
  {
    // icon: <UserCircleIcon />,
    name: "Operators",
    path: "/admin/operators",
  },
  {
    // icon: <UserCircleIcon />,
    name: "Alerts",
    path: "/admin/alerts",
  },
  {
    // icon: <UserCircleIcon />,
    name: "Reports",
    path: "/admin/reports",
  },
  {
    // icon: <UserCircleIcon />,
    name: "Settings",
    path: "/admin/settings",
  },

  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

export const siteManagerMenu: NavItem[] = [
  {
    
    name: "Dashboard",
    path: "/siteManager",
  },
  {
    
    name: "Assets",
    path: "/assets",
  },
  {
    
    name: "Operators",
    path: "/operators",
  },
  {
    
    name: "Location",
    path: "/location",
  },
  {
   
    name: "Alerts",
    path: "/alerts",
  },
  {
    
    name: "Reports",
    path: "/reports",
  },
  {
    
    name: "Settings",
    path: "/settings",
  },
];

export const operatorMenu:NavItem[] = [
  {
    name: "Dashboard",
    path: "/operator",
  },
  {
    name: "Assigned Assets",
    path: "/assigned-assets",
  },
  {
    name: "Tasks",
    path: "/tasks",
  },
  {

    name: "Alerts",
    path: "/alerts",
  },
    {

    name: "Profile",
    path: "/profile",
  },
];

export const menuConfig = {
  admin: adminMenu,
  siteManager: siteManagerMenu,
  operator: operatorMenu,
};
