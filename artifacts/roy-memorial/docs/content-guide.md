# Roy Moshe Memorial - Content Guide

## Editing Static Content
All static content on the website (hero text, biography, timeline events, dictionary entries, map places, etc.) is configured in a single central file:
**`src/content/roy.ts`**

### Placeholders
In the codebase, you will see strings like `"[PLACEHOLDER: Birth Date]"`. To replace these with real information:
1. Open `src/content/roy.ts`.
2. Find the placeholder text.
3. Replace it with the final Hebrew text, taking care to preserve the quotation marks.
4. For images, replace `null` or empty strings `""` with the URL or imported path of the actual image.

### Adding an Image
1. Upload the image to your asset hosting or place it in the project (e.g. `src/assets/photos/roy-1.jpg`).
2. If placed in the project, import it at the top of `roy.ts`: 
   `import royPhoto1 from "@/assets/photos/roy-1.jpg";`
3. Update the `heroImage` or `src` property in `roy.ts` to use `royPhoto1`.

### Managing the Gallery
The `gallery` array inside `roy.ts` accepts objects with `src`, `alt`, and `orientation`.
- `"portrait"` is for tall photos.
- `"landscape"` is for wide photos.
- `"square"` is for 1:1 photos.
This helps the placeholders look correct before you upload real photos.

### Adding Spotify Playlist
In `roy.ts`, look for `spotify: { playlistUrl: null }`. 
Replace `null` with the actual Spotify playlist URL (e.g., `"https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"`). The website will automatically render the interactive player.

## Admin Moderation
To review memories submitted by visitors:
1. Navigate to `/admin` in your browser.
2. Enter the administrator password (configured via `ADMIN_PASSWORD_HASH` Replit Secret).
3. Use the tabs to view Pending, Approved, and Rejected memories.
4. Click "אשר" (Approve) to publish a memory to the public site.
5. Click "מחק" (Delete) to permanently remove spam.