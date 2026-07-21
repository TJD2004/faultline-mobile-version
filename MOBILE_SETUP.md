# Running the Faultline mobile app — complete beginner's guide

This assumes you know **nothing** about React Native or Expo. Every step is
spelled out. You'll use VS Code's built-in terminal for everything — no
separate command prompt needed.

You will need **your phone** and **your computer on the same Wi-Fi network**.

---

## Part 1 — One-time setup on your phone

1. On your phone, open the **App Store** (iPhone) or **Play Store** (Android).
2. Search for **"Expo Go"** and install it. This is a free app made by Expo —
   it's what lets your phone run this project without you needing to build a
   real `.ipa`/`.apk` file yet.
3. Open Expo Go once just to confirm it installed. You can create a free
   Expo account if it asks, or skip that — not required for what we're doing.

---

## Part 2 — Open the project in VS Code

1. Unzip the `mobile.zip` file you were given, anywhere on your computer
   (e.g. your Desktop).
2. Open **VS Code**.
3. Go to **File → Open Folder…** and select the unzipped `mobile` folder.
4. Open the built-in terminal: **Terminal → New Terminal** (or press
   `` Ctrl+` `` on Windows). A terminal panel opens at the bottom of VS Code —
   this is where every command below gets typed.

---

## Part 3 — Install the project's dependencies

In the VS Code terminal, type:

```powershell
npm install
```

Press Enter. This downloads everything the app needs (React Native, Expo,
navigation libraries, etc.) into a `node_modules` folder. It can take a few
minutes the first time — that's normal. You'll see a progress bar and lots of
text scroll by; that's expected.

**Note:** if you get an error saying `npm` is not recognized, you need
Node.js installed first — download it from https://nodejs.org (the "LTS"
version), install it, then close and reopen VS Code and try again.

---

## Part 4 — Find your computer's local network address

Your phone can't reach your computer using the word `localhost` — it needs
your computer's actual address on your Wi-Fi network. Find it like this:

**On Windows:**
1. In the VS Code terminal, type:
   ```powershell
   ipconfig
   ```
2. Look for a section called **"Wireless LAN adapter Wi-Fi"**.
3. Find the line that says **IPv4 Address**. It'll look something like
   `192.168.1.42`. **Write this number down** — you'll need it in the next step.

**On Mac:**
1. Open **System Settings → Wi-Fi → Details** (or run `ipconfig getifaddr en0`
   in the terminal).
2. Note the IP address shown, e.g. `192.168.1.42`.

---

## Part 5 — Point the app at your backend

1. In VS Code's file explorer (left sidebar), open:
   `src/api/axios.js`
2. Find this line near the top:
   ```js
   const API_URL = "http://localhost:5000/api";
   ```
3. Replace `localhost` with the IP address you wrote down in Part 4. For
   example, if your IP was `192.168.1.42`, change it to:
   ```js
   const API_URL = "http://192.168.1.42:5000/api";
   ```
4. Save the file (`Ctrl+S`).

---

## Part 6 — Make sure the backend is actually running

The mobile app is a *client* — it needs the Faultline backend server running
somewhere it can reach. In a **separate** VS Code window (or a second
terminal tab), go to your `backend` folder from the main project and run:

```powershell
npm run dev
```

You should see:
```
✓ Connected to MongoDB database "faultline"
Faultline API listening on http://localhost:5000
```

**Leave this running** the whole time you're testing the mobile app — if you
close this terminal, the app has nothing to talk to.

---

## Part 7 — Start the mobile app

Back in the terminal for the **mobile** folder, run:

```powershell
npx expo start
```

Wait for it to finish starting up. You'll see a big **QR code** appear
directly in the terminal, along with a menu of options.

---

## Part 8 — Open it on your phone

1. Make sure your **phone and computer are on the same Wi-Fi network**
   (this is the #1 cause of it not working — check this first if anything
   fails).
2. Open the **Expo Go** app on your phone.
3. Tap **"Scan QR code"** inside Expo Go, and point your camera at the QR
   code in the VS Code terminal.
   - **iPhone alternative:** you can also just open your regular Camera app,
     point it at the QR code, and tap the notification that appears — it'll
     open directly in Expo Go.
4. Wait a moment — the app will download and launch on your phone (the first
   time takes longer, maybe 30–60 seconds).

You should land on the Faultline login screen. Try signing up or logging in
— if the backend is reachable, it'll work exactly like the website.

---

## Troubleshooting

**"Network request failed" / can't log in / spinner never stops**
→ 90% of the time this means Part 5 or Part 6 wasn't done right. Double check:
- Backend terminal is still running and shows no errors
- `API_URL` in `src/api/axios.js` uses your real IP, not `localhost`
- Phone and computer are on the **same** Wi-Fi (not phone on mobile data)

**QR code won't scan / times out**
→ Some Wi-Fi networks (especially public/office ones) block phone-to-computer
connections. Try your home Wi-Fi, or a personal mobile hotspot with your
computer connected to it instead.

**Windows Firewall popup appeared when you ran `npx expo start`**
→ Click **"Allow access"**. If you accidentally clicked "Cancel" or blocked
it, your phone won't be able to reach your computer. Fix: Windows Security →
Firewall & network protection → Allow an app through firewall → find
"Node.js" and check both Private and Public boxes.

**Something changed and now nothing works**
→ Stop the terminal (`Ctrl+C`), then run `npx expo start -c` (the `-c` clears
a cache that sometimes gets stuck).

**Google Sign-In doesn't work on mobile**
→ This needs real Google OAuth credentials configured in the backend's
`.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) — same as the website.
If those work on web already, mobile Google sign-in should work too once the
IP address is set correctly, since it goes through the same backend route.

---

## What you can do from here

- Every time you edit a file and save it, the app **automatically reloads**
  on your phone — no need to re-scan the QR code. This is called "Fast Refresh."
- If something looks broken after an edit, shake your phone gently — Expo Go
  shows a developer menu with a "Reload" option.
- To stop the app, click into the terminal and press `Ctrl+C`.
