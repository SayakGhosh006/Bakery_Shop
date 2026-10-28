# Smart Bakery Demand Predictor

A complete static HTML/CSS/JavaScript dashboard for small bakeries. No build, Python, API key, database or backend is required. All calculations run in the browser. Font downloads are optional; system fonts work offline.

## Folder structure

```text
Bakery_Shop/
  index.html        Accessible forms, dashboard and navigation
  style.css         Responsive warm bakery theme
  script.js         Data storage, charts, forecasting, CSV and planner
  README.md         Usage and deployment instructions
  .nojekyll         Static GitHub Pages publishing
  tests.cjs         Run with node tests.cjs
```

## Run locally

1. Keep index.html, style.css and script.js together in one folder.
2. Double-click index.html to open it in a modern browser. Browser storage behavior for file URLs varies; a local server is recommended for consistent persistence.
3. With VS Code, install the Live Server extension, right-click index.html, and choose **Open with Live Server**. Alternatively, if Node.js is installed, run `npx serve .` in this folder and open the printed local address. Python is not required.
4. Use the same address and browser each time. Different ports, browsers, file URLs and deployed domains have separate storage.

## Use the app

1. Choose **Load demo data** to explore 36 days of clearly labelled synthetic data across four products. The workspace starts empty by default. Demo loading replaces existing data only after confirmation.
2. Under **Products**, add a name, selling price in rupees, cost per item and batch size. Prices and costs allow two decimals. Existing sales retain their historical price/cost when a product price changes.
3. Under **Daily records**, enter a date, product, prepared and sold quantities, weather, holiday and optional event. Sales cannot exceed preparation. Only one record per product/date is allowed; use Edit to correct it. A day with all prepared items sold is marked as a sell-out.
4. Select the date range on **Dashboard**. Totals, the daily sales chart, product performance, leftovers report and forecast comparison use this range. Waste means recorded unsold items / prepared items; it does not measure eventual disposal or account for later inventory usage.
5. In **Demand forecast**, choose a future date (defaults to tomorrow), weather and optional assumptions. Click **Calculate & save forecast** to freeze a forecast for later comparison. Live preview changes are not saved until this button is clicked. Recalculating a saved date asks before replacing it.
6. In **Production planner**, use the date and assumptions selected in Demand forecast. Enter only usable, safe leftovers; the app does not infer shelf life or carry inventory automatically. Adjust the safety buffer and override quantities if needed, then save. Overrides are retained when reopening the saved plan; editing a quantity manually prevents subsequent inventory/buffer edits from replacing it during that editing session.
7. Under **Reports & data**, export/import CSV or download/restore a full JSON backup. Restoring, resetting and deleting ask for confirmation.

## Forecast method and limitations

For each product, take up to 28 recorded days strictly before the target date. Compute the weighted average of the most recent seven sales, with chronological weights 1..N. Blend 65% of that with 35% of the matching-weekday sales average. If no matching weekday exists, use the weighted average alone. The window is 28 observations, not necessarily 28 calendar days; missing dates are not treated as zero demand. With fewer than three observations, display an insufficient-history warning; without history, request a manual plan and do not save a forecast for that product.

Apply `max(0.1, 1 + (weather% + applicable holiday% + applicable event%) / 100)` and round to whole items. These adjustments are owner-configured assumptions, not learned correlations. Weather labels alone have no numeric effect. The holiday/event defaults are illustrative 10% uplifts and apply only when the holiday checkbox/event text is set; weather defaults to 0%.

This is statistical forecasting, not a trained AI model. Sell-outs can censor true demand, sparse records weaken weekday patterns, and changes in prices, opening hours and customer behavior are not modeled. There is no guaranteed accuracy or waste reduction. Reports compare saved predictions with actual sales using absolute error in items; they do not silently recalculate old forecasts. Forecasts can be saved only for future dates to avoid presenting a retrospective fit as a real prediction.

Production recommendation: `ceil(max(0, predicted * (1 + buffer / 100) - usableInventory) / batchSize) * batchSize`. Apply the safety buffer before subtracting inventory, then round to a full batch. Manual overrides may be any nonnegative whole quantity, even when not a complete batch. The planner is decision support; owners must check freshness and operational constraints.

## Storage and backup

The key `smart-bakery-v1` stores data in localStorage. It stays only in this browser/profile and origin on this device; there is no syncing or server backup. Private browsing or blocked/full storage may prevent persistence; save failures are reported. Clearing browser data deletes records. CSV backs up sales and product fields; full JSON additionally preserves forecasts and production plans. Store backups somewhere safe before resetting, changing devices, or changing hosting domains. Do not upload personal sales backups to a public repository.

CSV headers (all required):

```csv
date,product,prepared,sold,weather,holiday,event,price,cost,batch
2026-01-12,Butter croissant,30,25,Clear,false,,90,35,6
```

Dates use YYYY-MM-DD and must be today or earlier. Quantities are nonnegative whole numbers. Weather is Clear, Rainy, Hot or Cold; holiday accepts true/false/1/0. Prices and costs are nonnegative. Batch size is a positive integer. Quoted commas, embedded newlines, escaped quotes, CRLF and UTF-8 BOM are supported. Imports validate all rows before saving; a bad row rejects the file without partial changes. Unknown products are created. Existing product details stay unchanged, but imported record prices/costs are preserved. Duplicate product/date rows update that record; the last row wins within a file. Exported text starting with spreadsheet formula characters gets a protective apostrophe; the importer removes it for round-tripping. Maximum import size is 5 MB.

## Deploy with GitHub Pages

1. Sign in to GitHub and create a new public repository, for example `smart-bakery-demand-predictor`.
2. Choose **Add file → Upload files**. Upload index.html, style.css, script.js and .nojekyll at the repository root (README is optional). Choose **Commit changes**. Never upload backups containing your private sales.
3. Open the repository **Settings → Pages**.
4. Under **Build and deployment → Source**, select **Deploy from a branch**.
5. Select branch **main**, folder **/(root)**, and click **Save**.
6. Wait for the Pages deployment to finish (check the Actions tab if necessary), then use **Visit site** in Settings → Pages. A project repository normally publishes at `https://YOUR-USERNAME.github.io/smart-bakery-demand-predictor/`.
7. To update, upload changed source files to the same branch and commit. Pages republishes automatically.

See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Deploy with Netlify

1. Put index.html, style.css and script.js directly in one folder, not inside a nested subfolder.
2. Sign in at Netlify and open [Netlify Drop](https://app.netlify.com/drop).
3. Drag that folder onto the deploy dropzone. No build command or dependencies are needed.
4. Open the resulting `https://…netlify.app` address after deployment succeeds. You can change the project name in its configuration.
5. For updates, open the project's **Deploys** page and drop the updated folder into the manual deployment area.

For automatic deployment, choose **Add new project → Import an existing project**, connect the GitHub repository, use no build command and set the publish directory to `.`. Deploy the main branch. See [Netlify's project instructions](https://docs.netlify.com/manage/projects/add-new-project/) and [manual deployments](https://docs.netlify.com/deploy/create-deploys/).

## Optional Vercel deployment

Import the GitHub repository as a new Vercel project, select the **Other** framework preset, leave the build command unset and use `.` as the output directory. No environment variables or server functions are needed.

## Optional future Python ML backend

Keep this static frontend and host a separate Python API (for example FastAPI). Add authenticated endpoints to store products/records and request a forecast, then replace the local `forecast()` calculation with an asynchronous fetch. Train on a sufficiently large, cleaned dataset using time-based validation; compare a learned model with this statistical baseline. Include weekday, holidays, weather and events only if their information is available at prediction time, and account for sell-outs. Return predicted quantity, uncertainty, model version and historical error. Keep API secrets on the server, configure CORS for your deployed frontend, add authorization per bakery, and persist data in a database. Python cannot run as a backend on GitHub Pages; host the API separately. Introduce cloud synchronization only with explicit user consent.

## Verification

Run `node --check script.js` and `node tests.cjs`. Tests cover weighted/weekday forecasting, cutoff dates, low-history behavior, assumption adjustments, batch planning, CSV quoting/round trips, atomic import rejection and duplicate handling. Charts are dependency-free SVG; table values provide the exact numbers. Layout responds to mobile and desktop widths.
