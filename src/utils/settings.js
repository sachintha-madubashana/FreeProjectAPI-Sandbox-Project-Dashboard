import data from "@/assets/data.json";

export const getProjectStatuses = () => {
  return ["unavilable", "developing", "active"];
};

export const getApplicationTitle = () => {
  return data.banner.title;
};

export const getApplicationDescription = () => {
  return data.banner.description;
};

export const getApplicationBadges = () => {
  return data.banner.badges;
};

export const getPages = () => {
  const status = getProjectStatuses();

  return [
    {
      id: 1,
      title: "Home",
      description: "This is the Home Page.",
      icon: "LayoutDashboard",
      iconColor: "#FFD700",
      path: "/",
      apiEndpoints: "./",
    },
    {
      id: 2,
      title: "Bank Loan",
      description: "This is the second project.",
      icon: "Landmark",
      iconColor: "#1E90FF",
      path: "/bank-loan",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 3,
      title: "Bus Booking",
      description: "Browse bus schedules and book a seat",
      icon: "Bus",
      iconColor: "#FFD700",
      path: "/bus-booking",
      apiEndpoints: "./test",
      status: status[0],
    },
    {
      id: 4,
      title: "College Project",
      description: "This is the third project.",
      icon: "GraduationCap",
      iconColor: "#FF69B4",
      path: "/college-project",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 5,
      title: "Ecommerce",
      description: "This is the fourth project.",
      icon: "ShoppingCart",
      iconColor: "#32CD32",
      path: "/ecommerce",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 6,
      title: "Employee App",
      description: "Directory & search",
      icon: "Users",
      iconColor: "#4285F4",
      path: "/employee-app",
      apiEndpoints: "./",
      status: status[1],
    },
    {
      id: 7,
      title: "Onboarding",
      description: "Step-by-step wizard",
      icon: "UserPlus",
      iconColor: "#34A853",
      path: "/onboarding",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 8,
      title: "Enquiry",
      description: "Support tickets",
      icon: "MessageSquare",
      iconColor: "#EA4335",
      path: "/enquiry",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 9,
      title: "Fees Tracking",
      description: "Enrollments & payments",
      icon: "HandCoins",
      iconColor: "#FBBC05",
      path: "/fees-tracking",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 10,
      title: "Goal Tracker",
      description: "Goals & progress",
      icon: "Target",
      iconColor: "#AA00FF",
      path: "/goal-tracker",
      apiEndpoints: "./",
      status: status[2],
    },
    {
      id: 11,
      title: "Leave Tracker",
      description: "Leave requests & balance",
      icon: "CalendarDays",
      iconColor: "#4285F4",
      path: "/leave-tracker",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 12,
      title: "Competition",
      description: "Register & submit projects",
      icon: "Trophy",
      iconColor: "#FBBC05",
      path: "/competition",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 13,
      title: "Smart Parking",
      description: "Live slot availability",
      icon: "CircleParking",
      iconColor: "#34A853",
      path: "/smart-parking",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 14,
      title: "Survey",
      description: "Multi-question surveys",
      icon: "ClipboardList",
      iconColor: "#AA00FF",
      path: "/survey",
      apiEndpoints: "./",
      status: status[0],
    },
    {
      id: 15,
      title: "User App",
      description: "Profile management",
      icon: "User",
      iconColor: "#4285F4",
      path: "/user-app",
      apiEndpoints: "./",
      status: status[0],
    },
  ];
};

export const getPageByPath = (path) => {
  const pages = getPages();
  return pages.find((page) => page.path === path) ?? null;
};
