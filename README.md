---

# **TripTracker 🌍✈️**

A modern, offline-first expense tracker built for travelers.
Built using **React, Vite, Tailwind CSS, and Capacitor** with native Android support.

---

## ✨ Features

* **📊 Expense Tracking** – log spending by category, payment method, and day
* **📈 Visual Analytics** – daily breakdown and spending distribution charts
* **📄 PDF Export** – generate a professional trip report with one tap
* **🌙 Dark Mode** – responsive light/dark themes
* **💾 Offline First** – persists data locally; internet not required
* **📱 Android Native Functions** – haptics, file system backup, native sharing

---

## 🛠️ Requirements

Before starting, make sure you have:

* Node.js v18 or higher
* Android Studio installed
* Java JDK 17 (required for Gradle builds)

---

## 🚀 Installation & Setup

### **Clone the repository**

```bash
git clone https://github.com/yourusername/TripTracker.git
cd TripTracker
```

### **Install dependencies**

```bash
npm install
```

### **Run development server**

```bash
npm run dev
```

Your app will be available at:

```
http://localhost:5173
```

---

## 📱 Build for Android

### Build web assets

```bash
npm run build
```

### Sync with Capacitor

```bash
npx cap sync
```

### Open Android Studio

```bash
npx cap open android
```

### Run app on Android device/emulator

1. Plug in device via USB
2. Enable USB debugging
3. Press **▶ Run** inside Android Studio

---

## 📦 Build a Signed Release APK (GUI Method)

To prevent Android flagging your APK as *Harmful/Unrecognized*, sign it with your own private key. The easiest way is inside Android Studio using the signing wizard.

---

### **Prerequisites**

Before creating a signed APK, build the latest web assets and sync Capacitor:

```bash
npm run build
npx cap sync
```

Open the Android project in Android Studio:

```bash
npx cap open android
```

---

## 🧩 Step 1 — Start the Signing Wizard

Inside Android Studio:

1. Click **Build** in the top menu
2. Select **Generate Signed Bundle / APK…**
3. Choose **APK**
4. Click **Next**

---

## 🔑 Step 2 — Create a New Key Store

On the "Key store path" screen:

1. Click **Create new…**
2. Click the folder icon 📁
3. Choose a safe location (Desktop works)
4. Name the file:

   ```
   trip_tracker_key.jks
   ```
5. Enter a password (example: `123456`) in both fields

Key section:

* Alias: keep default `key0` or name it `upload`
* Password: same password (`123456`)

Certificate fields:

* First and Last Name: e.g.,

  ```
  TripTracker Dev
  ```
* Leave other fields empty

Click **OK**

---

## ⚙️ Step 3 — Build the APK

You will return to the signing screen.

1. Enable **Remember passwords** (optional)
2. Click **Next**
3. Build Variant: select **release**
4. Click **Create**

Android Studio will now build a signed APK.

---

## 📍 Step 4 — Locate Your Release APK

After a successful build, look for the notification:

> “APK(s) generated successfully.”

Click the **locate** link inside the notification.
This opens the folder containing your final:

```
app-release.apk
```

This file can be transferred to a phone via WhatsApp, Drive, or USB.

---

## ⚠️ Important Notes

* The `.jks` file you created is your developer identity.
  **Do not lose it** — you will need it to upload or update the app.

* Play Protect might still show:
  *“Unrecognized Developer”*
  This is normal for personal keys. Tap **Install anyway**.

---

## 📂 Project Structure

```
/
├── android/                # Native Android project (generated)
├── public/                 # Static assets (logo, icons)
├── src/
│   ├── components/         # UI components
│   │   ├── dashboard/      # Charts + tables
│   │   ├── layout/         # Navbar + drawers
│   │   └── modals/         # trip setup + pdf export
│   ├── context/            # Global state context
│   ├── hooks/              # Custom hooks
│   ├── utils/              # helper logic + PDF
│   └── App.jsx             # entry point
├── dist/                   # build output
├── capacitor.config.json
├── package.json
└── vite.config.js
```
---
## Snapshots
1. Setup
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/setup.png)

2. Main Menu
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/mainMenu.png)

3. Hamburger Menu
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/hamburgerMenu.png)

4. Daily Analysis
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/dailyAnalysis.png)

5. Day wise Analysis
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/dayAnalysis.png)

6. Overall Stats
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/overallStats.png)

7. Load Trip
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/loadFile.png)

8. Export Report as PDF
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/exportReport.png)

9. PDF Snap
![image alt](https://github.com/sriinath20/TripTracker/blob/42d136a9e5679eb5d0a7927de78207473ba43358/images/reportPdf.png)
---
---

## 🤝 Contributing

1. Fork the repository
2. Create a branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit changes

   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push branch

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Submit Pull Request

---

