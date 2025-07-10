# Inertia.js Devtools

A browser extension for debugging Inertia.js applications, built with Bun, React, and TypeScript. It provides a clean and intuitive interface to help you inspect your application's state and behavior.

<img width="1276" height="800" alt="Screenshot 2025-07-10 at 17 36 30" src="https://github.com/user-attachments/assets/6076326e-1c7a-408d-80b1-04e3e15210cf" />

## Features

### Page Inspection
Get a comprehensive overview of the current Inertia.js page. This includes:
- **Component Name:** The name of the front-end component for the current page.
- **URL:** The current page's URL.
- **Props:** A detailed and interactive JSON view of all the props passed to the component.
- **Version:** The asset version of your application, if provided.
- **Shared Data:** A view of props that are shared across all pages.
- **Deferred Props:** A view for props that are loaded asynchronously.

### Request Timeline
A complete history of all Inertia requests made during the page's lifecycle. Each entry in the timeline shows:
- **Method:** The HTTP method of the request (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Status:** The status of the request (`success`, `error`, `pending`).
- **Timestamps:** When the request was initiated.
- **Special Badges:** `INITIAL`, `REDIRECT`, and `PARTIAL` badges to quickly identify different types of visits.

Clicking on a request reveals its full details, including headers, payload, response time, and the props that were returned.

### Form Submissions
Isolate and debug your form submissions with ease. This tab filters for `POST`, `PUT`, and `PATCH` requests, allowing you to quickly inspect:
- **Form Data:** The data that was submitted with the form.
- **Validation Errors:** Any validation errors returned by the server.

### Route Listing
If your application uses Laravel with Ziggy, the extension will automatically display a list of all your named routes. This is incredibly useful for quickly referencing your application's endpoints.

### Advanced JSON Viewer
The JSON viewer for props and data is highly customizable:
- **Multiple Themes:** Choose from a variety of themes, including VS Code, GitHub, Nord, and more.
- **Adjustable Display:** Change the font size, indentation width, and collapse levels.
- **Data-type Display:** Toggle the visibility of data types.
- **Clipboard Support:** Easily copy parts of your props or data.

## How It Works

The extension detects Inertia.js by injecting a script (`injected.js`) into the page. This script listens for the custom events that Inertia dispatches on the `document` object:
- `inertia:start`: Captures the initial request details.
- `inertia:success`: Updates the request with the returned component and props.
- `inertia:error`: Captures any validation errors.
- `inertia:finish`: Calculates the total response time.
- `inertia:navigate`: Updates the current page details after a visit.

When these events are captured, the injected script sends messages to the content script, which then relays the information to the devtools panel. The panel uses this data to build the user interface you see. The extension also attempts to detect the front-end framework (React, Vue, or Svelte) being used.

## Technologies Used

- **Bun:** For fast and efficient development, building, and packaging.
- **React & TypeScript:** For building a robust and type-safe user interface.
- **Tailwind CSS:** For a utility-first approach to styling.
- **PostCSS:** For transforming CSS with plugins.
- **BiomeJS:** For linting and formatting the codebase.
- **`@uiw/react-json-view`:** For the interactive and themeable JSON viewer.

## Settings

The settings panel allows you to customize the devtools to your liking:
- **Application Theme:** Choose between `light`, `dark`, or `system` (follows your OS setting).
- **JSON Viewer Theme:** Select from over ten themes for the JSON viewer.
- **JSON View Preferences:** Control object key sorting, indentation width, data type visibility, and more.

## Installation

### From Source

1.  Clone this repository.
2.  Install dependencies: `bun install`
3.  Build the extension: `bun run build`
4.  Open Chrome and go to `chrome://extensions`.
5.  Enable "Developer mode".
6.  Click "Load unpacked" and select the `public` directory from this project.

## Development

To start developing the extension with live-reloading:

1.  Install dependencies: `bun install`
2.  Run the development server: `bun run dev`

This will watch for changes and automatically rebuild the extension.

## License

This project is licensed under the [MIT](/license) License.
