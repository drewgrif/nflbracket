# NFL Playoff Bracket Pool Tracker

A web-based system for tracking NFL playoff bracket submissions, scoring picks, and displaying a public leaderboard.

## Features

- **Bracket Picker** (`bracket-picker.html`): Visual interface for users to fill out their picks
- **Tracker** (`index.html`): Public leaderboard and admin panel for managing submissions and results
- **Auto-reseeding**: Properly implements NFL playoff reseeding rules
- **Serverless Backend**: Uses Netlify Functions and Netlify Blobs for data storage
- **No Database Required**: Data stored in Netlify Blobs (key-value store)

## Quick Start

### 1. Deploy to Netlify

1. Push this code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Click "Add new site" → "Import an existing project"
4. Choose your GitHub repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Click "Deploy site"

That's it! Netlify will:
- Install dependencies from `package.json`
- Deploy the serverless functions from `netlify/functions/`
- Host your static files
- Set up Netlify Blobs automatically

### 2. Change the Admin Password

**IMPORTANT**: Before using, update the admin password in TWO places:

1. **`index.html`** (line 653):
   ```javascript
   const ADMIN_PASSWORD = 'admin123'; // Change this!
   ```

2. **`netlify/functions/results.js`** (line 4):
   ```javascript
   const ADMIN_PASSWORD = "admin123"; // Change this!
   ```

3. **`netlify/functions/admin.js`** (line 4):
   ```javascript
   const ADMIN_PASSWORD = "admin123"; // Change this!
   ```

After changing, commit and push to GitHub. Netlify will automatically redeploy.

### 3. Share the Bracket Picker

Send your friends to: `https://your-site.netlify.app/bracket-picker.html`

They will:
1. Fill out their picks
2. Click "Download Bracket"
3. Send you the JSON file (via email, text, etc.)

### 4. Upload Brackets (Admin)

1. Go to `https://your-site.netlify.app/`
2. Scroll to "Admin Panel" and click to expand
3. Enter your password
4. In "Data Management", click "Import Bracket Files"
5. Select all the JSON files people sent you
6. They'll be uploaded and appear on the leaderboard

### 5. Mark Game Results (Admin)

As games are played:
1. Log into the admin panel
2. Under "Mark Game Results", click the winning team for each game
3. Scores update in real-time
4. Click "Save Results" to persist changes
5. Everyone can see the updated leaderboard

## File Structure

```
bracket/
├── index.html                     # Main tracker with leaderboard & admin panel
├── bracket-picker.html            # Visual bracket picker for participants
├── package.json                   # Dependencies
├── netlify.toml                   # Netlify configuration
├── netlify/functions/
│   ├── data.js                    # GET/POST bracket data
│   ├── results.js                 # POST game results (admin only)
│   └── admin.js                   # Import/clear operations (admin only)
└── README.md                      # This file
```

## API Endpoints

Once deployed, these endpoints are available:

- `GET /api/data` - Fetch all brackets and results
- `POST /api/data` - Submit a bracket (requires `{name, picks}`)
- `POST /api/results` - Update game results (requires `{password, results}`)
- `POST /api/admin` - Admin operations:
  - `{password, operation: "import", data}` - Import full backup
  - `{password, operation: "clear"}` - Clear all data

## Data Management

### Export Backup
Click "Export Data (JSON)" in the admin panel to download a complete backup.

### Import Backup
Click "Import Backup JSON" and select a previously exported file to restore data.

### Clear All Data
Click "Clear All Data" to reset everything (cannot be undone).

## Customization

### Change Team Information
Update team names, seeds, and matchups in both files:
- `index.html` (lines 380-377, 702-705)
- `bracket-picker.html` (similar sections)

### Modify Scoring
Default: 1 point per correct pick. To change, edit the `calculateScore()` function in `index.html` (around line 530).

## Troubleshooting

### Brackets not appearing after upload
- Check the browser console for errors
- Verify the JSON file format matches the expected structure
- Ensure you clicked "Save Results" after marking games

### Admin panel won't unlock
- Verify you changed the password in ALL THREE files
- Make sure you redeployed after changing the password
- Check that the password matches exactly (case-sensitive)

### Data not persisting
- Netlify Blobs requires a paid Netlify plan OR being within free tier limits
- Free tier: 1GB storage, plenty for 20-100 participants
- Check Netlify dashboard for any errors

## Local Development

To test locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Install dependencies
npm install

# Run local dev server
netlify dev
```

Access at `http://localhost:8888`

## Support

For issues or questions, check:
- Netlify documentation: https://docs.netlify.com
- Netlify Blobs docs: https://docs.netlify.com/blobs/overview/

## License

Free to use and modify for your bracket pool!
# nflbracket
