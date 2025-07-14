import { basicTheme } from "@uiw/react-json-view/basic";
import { darkTheme } from "@uiw/react-json-view/dark";
import { githubDarkTheme } from "@uiw/react-json-view/githubDark";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { gruvboxTheme } from "@uiw/react-json-view/gruvbox";
import { lightTheme } from "@uiw/react-json-view/light";
import { monokaiTheme } from "@uiw/react-json-view/monokai";
import { nordTheme } from "@uiw/react-json-view/nord";
import { vscodeTheme } from "@uiw/react-json-view/vscode";

export const themes = {
	lightTheme,
	darkTheme,
	nordTheme,
	githubLightTheme,
	githubDarkTheme,
	vscodeTheme,
	gruvboxTheme,
	monokaiTheme,
	basicTheme,
};

export type ThemeKey = keyof typeof themes;
