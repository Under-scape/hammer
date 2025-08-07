# Hammer

Hammer is a web-based, lightweight tilemap editor built with React, TypeScript, and Vite. It provides a simple interface for creating 2D game maps by placing tiles from a custom tilesheet onto a zoomable and pannable canvas.

## Features

- **Custom Tilesheets**: Upload your own PNG, JPG, or JPEG image files to be used as a tilesheet.
- **Tile Palette**: Automatically slices the uploaded tilesheet into a selectable palette of 16x16 tiles.
- **Infinite Canvas**: Pan and zoom freely to navigate your map.
- **Core Editing Tools**: Draw and erase tiles with simple mouse clicks.
- **Save & Load**: Export your maps to a `.tmpx` JSON file, which includes the tilesheet data, and import them back into the editor.
- **Keyboard Shortcuts**: Speed up your workflow with intuitive shortcuts for common actions.
- **Real-time Console**: Get feedback on your actions through the built-in console log.

## Getting Started

To run the editor on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/under-scape/hammer.git
    cd hammer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open the provided URL (e.g., `http://localhost:5173`) in your browser.

## How to Use

-   **Loading a Tilesheet**: Click the **Upload Tilesheet** button or press `U` to select your image file. The editor will process the image and display the individual tiles in the left-hand panel.
-   **Selecting a Tile**: Click on any tile in the left-hand tile panel to select it for drawing.
-   **Placing Tiles**: Select the **Draw** tool (or press `D`) and click on the canvas to place the selected tile.
-   **Erasing Tiles**: Select the **Erase** tool (or press `E`) and click on a tile on the canvas to remove it.
-   **Navigating the Canvas**:
    -   **Pan**: Hold the right mouse button and drag to move around the canvas.
    -   **Zoom**: Use the mouse wheel to zoom in and out.
    -   **Center View**: Click the **Center view** button or press `C` to re-center the canvas.
-   **Saving and Loading**:
    -   **Save**: Click the **Save local copy** button or press `Ctrl + S` to download the current map as a `.tmpx` file.
    -   **Load**: Click the **Import Map** button to load a previously saved `.tmpx` file. This will restore the tilesheet and the map layout.

## File Format (.tmpx)

The `.tmpx` file is a JSON object containing the map data. It has two main properties:

-   `tilesheet`: A base64 data URL representation of the tilesheet image.
-   `map`: An array of tile objects, where each object has:
    -   `x`: The x-coordinate of the tile on the map.
    -   `y`: The y-coordinate of the tile on the map.
    -   `tile`: The index of the tile from the tilesheet palette.

```json
{
  "tilesheet": "data:image/png;base64,...",
  "map": [
    { "tile": 0, "x": 0, "y": 0 },
    { "tile": 5, "x": 16, "y": 0 },
    { "tile": 12, "x": 0, "y": 16 }
  ]
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.