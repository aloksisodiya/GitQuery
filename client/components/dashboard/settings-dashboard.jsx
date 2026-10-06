"use client";

import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { GitHubIcon } from "@/components/icons/github-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
export function SettingsDashboard() {
  var _a, _b, _c, _d;
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your GitHub account connected to GitQuery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-xl">
              <AvatarImage
                src={
                  (_a =
                    user === null || user === void 0
                      ? void 0
                      : user.avatarUrl) !== null && _a !== void 0
                    ? _a
                    : undefined
                }
                alt={
                  user === null || user === void 0 ? void 0 : user.displayName
                }
              />
              <AvatarFallback className="rounded-xl">
                {((_b =
                  user === null || user === void 0
                    ? void 0
                    : user.displayName) !== null && _b !== void 0
                  ? _b
                  : "DP"
                )
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {user === null || user === void 0 ? void 0 : user.displayName}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                @
                {user === null || user === void 0
                  ? void 0
                  : user.githubUsername}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Display name</span>
              <span className="font-medium">
                {(_c =
                  user === null || user === void 0
                    ? void 0
                    : user.displayName) !== null && _c !== void 0
                  ? _c
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">GitHub username</span>
              <span className="font-medium">
                @
                {(_d =
                  user === null || user === void 0
                    ? void 0
                    : user.githubUsername) !== null && _d !== void 0
                  ? _d
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Authentication</span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <GitHubIcon className="size-4" />
                GitHub OAuth
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how GitQuery looks on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="dark-mode">Dark mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sun className="size-4 text-muted-foreground" />
              <Switch
                id="dark-mode"
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
              <Moon className="size-4 text-muted-foreground" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label>Theme selector</Label>
              <p className="text-sm text-muted-foreground">
                Current theme:{" "}
                {theme !== null && theme !== void 0 ? theme : "system"}
              </p>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account actions</CardTitle>
          <CardDescription>
            Manage your session and connected workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="justify-start" disabled>
            <UserRound data-icon="inline-start" />
            Manage on GitHub
          </Button>
          <Button
            variant="destructive"
            className="justify-start"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut data-icon="inline-start" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
