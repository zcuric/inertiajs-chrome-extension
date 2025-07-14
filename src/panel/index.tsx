import React from "react";
import { createRoot } from "react-dom/client";
import Panel from "./Panel.tsx";

const container = document.getElementById("root");

if (container) {
	try {
		const root = createRoot(container);
		root.render(<Panel />);
	} catch (error) {
		console.error("Error rendering panel:", error);
	}
} else {
	console.error("Root container not found!");
}
