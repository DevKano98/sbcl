# AWS Student Builder Campus Registration

A mobile-first registration flow using React and Vite. Google Sheets stores registrations through a bound Google Apps Script Web App. There is no separate backend or login.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set the deployed Apps Script URL:

   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   VITE_AWS_REFERRAL_URL=https://bit.ly/4hWkXKR
   ```

3. Start the site:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

Restart Vite after editing `.env.local`. The URL is public frontend configuration; never put a secret in a `VITE_` variable.

## Set up Google Sheets and Apps Script

1. Open the existing Google Sheet. Select the **Registrations** tab.
2. Confirm row 1 has these exact headers in this exact order:

   ```text
   registration_id | full_name | email | phone | college | branch | year | aws_builder_alias | aws_display_name | status | created_at | updated_at
   ```

3. In the sheet, choose **Extensions → Apps Script**. This creates a script bound to the sheet.
4. Replace the editor contents with [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Save.
5. Click **Deploy → New deployment**.
6. Select **Web app** as the deployment type.
7. Set **Execute as: Me**. For access, choose **Anyone** so students can submit without a Google login. Confirm your organization's policy permits this public form.
8. Deploy and authorize the script when prompted.
9. Copy the **Web app URL** ending in `/exec`. Put it in `.env.local` as `VITE_APPS_SCRIPT_URL`.
10. Restart the local dev server and submit a test registration. Check that the new row appears in **Registrations**.

The frontend sends a normal JSON string POST with `Content-Type: text/plain` to avoid a browser preflight request. The script reads `e.postData.contents` and responds through `ContentService`. Use the `/exec` URL, not the editor URL or `/dev` URL. Apps Script redirects its response; browser `fetch` follows it automatically. Do not add custom CORS headers to Apps Script.

### Update Apps Script later

After changing `Code.gs`, save, then choose **Deploy → Manage deployments → Edit → New version → Deploy**. Editing the code alone does not update the existing public deployment.

## Test the full flow

With a deployed Apps Script URL, use a browser to:

1. Open the landing page and start registration.
2. Try an empty form and invalid email/phone; inline validation should appear.
3. Submit valid details; confirm one `started` row with the registration ID.
4. Open AWS Builder Center; confirm a new tab uses `https://bit.ly/4hWkXKR` and the row changes to `aws_opened`.
5. Return and submit an alias and AWS display name; confirm the **same row** changes to `completed`.
6. Check the success screen, refresh it, and check the alias and ID remain visible.
7. Try at 375px wide and confirm the page does not scroll horizontally.
8. Repeated submits for one registration ID are idempotent in Apps Script. The form also disables its button while a request runs.

The Apps Script uses a lock around sheet writes and finds columns from row 1 headers. It keeps a completed row completed if a delayed AWS-click request arrives afterward. `aws_builder_alias` is submitted for organizer review; the website does not verify AWS identity.

## Deploy the frontend to Vercel

1. Push the project to a Git repository and import it into Vercel.
2. Use the Vite defaults: build command `npm run build`, output directory `dist`.
3. Add `VITE_APPS_SCRIPT_URL` and `VITE_AWS_REFERRAL_URL` in the Vercel project environment variables, using the same values as `.env.local`.
4. Deploy. `vercel.json` rewrites route refreshes to `index.html` for React Router.
5. Run the full flow on the deployed site and inspect the Google Sheet.

This public form has no authentication or spam protection. Keep edit access to the sheet restricted to organizers and monitor submissions if the campaign link is broadly shared.
"# sbcl" 
