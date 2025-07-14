import { useEffect, useState } from "react";
import type { PanelSettings } from "../Settings";

export const useTheme = (settings: PanelSettings) => {
	const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
		"light",
	);

	useEffect(() => {
		if (settings.appTheme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			setEffectiveTheme(mediaQuery.matches ? "dark" : "light");

			const handler = (e: MediaQueryListEvent) => {
				setEffectiveTheme(e.matches ? "dark" : "light");
			};

			mediaQuery.addEventListener("change", handler);

			return () => mediaQuery.removeEventListener("change", handler);
		} else {
			setEffectiveTheme(settings.appTheme);
		}
	}, [settings.appTheme]);

	return effectiveTheme;
};
