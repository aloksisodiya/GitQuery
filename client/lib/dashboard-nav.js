import { FolderGit2, LayoutGrid, Settings, } from "lucide-react";
export const dashboardNavGroups = [
    {
        label: "Workspace",
        items: [
            {
                title: "Overview",
                href: "/dashboard/overview",
                icon: LayoutGrid,
            },
            {
                title: "Repositories",
                href: "/dashboard",
                icon: FolderGit2,
                exact: true,
            },
        ],
    },
    {
        label: "Account",
        items: [
            {
                title: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];
export function isDashboardNavActive(pathname, href, exact = false) {
    if (exact) {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
