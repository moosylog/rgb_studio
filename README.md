# 🎹 RGB Lighting Studio

**Design keyboard RGB lighting in your web browser. No coding skills needed to use it.**

This tool shows a picture of a keyboard on your screen. You can make the keys glow, change color, and move — just like a real RGB keyboard. You can also make keys react when you press a real key on your own keyboard.

It is made for people who build custom keyboards (like Glove80, Go60, and others) and want to test lighting ideas before putting them on real hardware.

---

## 📸 What it looks like

*(Add a screenshot or short video here so people can see it before they try it.)*

---

## 🧩 What's inside this repo

This project is **3 files**. Keep all 3 in the **same folder**. Do not rename them.

| File | What it is |
|---|---|
| `rgb-lighting-studio.html` | The app itself. **Open this one.** |
| `keyboard-layouts.js` | The shapes of the keyboards (Go60, Glove80, etc.) |
| `effects-library.js` | The list of lighting effects |

You do not need internet access to run it, except that a few small design fonts load from the internet the first time.

---

## ▶️ How to open it (no install needed)

1. Click the green **Code** button on this GitHub page, then click **Download ZIP**.
2. Find the ZIP file on your computer (usually in your "Downloads" folder) and unzip it.
3. Open the unzipped folder.
4. Double-click the file named **`rgb-lighting-studio.html`**.
5. It will open in your web browser (Chrome, Edge, Firefox, or Safari all work).

That's it! No installation. No account. No command line.

> 💡 **Tip:** Always keep the 3 files together in the same folder. If you move only the `.html` file somewhere else, the app will not work correctly.

---

## 🕹️ How to use it

At the top of the page (the toolbar) you will find:

- **🌗 Theme** — switch between dark and light background.
- **Keyboard dropdown** — pick which keyboard shape to preview (Go60, Glove80, Corne, Voyager, ANSI 60%).
- **Labels** — show or hide the letter/name printed on each key.
- **Zoom** — make the picture bigger or smaller.
- **🌊 Ambient** — a checkbox and a dropdown. This is lighting that moves on its own (like a rainbow or a wave), all the time.
- **⚡ Reactive** — a checkbox and a dropdown. This is lighting that responds when you **press a real key** on your keyboard.
- **💡 AI Prompt Guides** — click this to open instructions you can give to an AI (like Claude or ChatGPT) to write new effects for you. More on this below.

### Try this first

1. Leave both **🌊 Ambient** and **⚡ Reactive** checked (turned on).
2. Click once anywhere on the page (so your browser is "listening" to your keyboard).
3. Press a letter key, like **E**, on your real keyboard.
4. Watch the matching key on the screen light up and fade.

You can turn Ambient off to see Reactive alone, or turn Reactive off to see Ambient alone.

---

## 🎨 Changing effects (no coding)

Just use the two dropdown menus in the toolbar:

- The **🌊 Ambient** dropdown changes the moving background lighting.
- The **⚡ Reactive** dropdown changes what happens when you press a key.

Pick any option and the picture updates right away.

---

## 🛠️ Adding your own new effect (a little bit of coding)

You do **not** need to know how to code to *use* this tool. But if you want to **add a new effect**, here is the simple version:

1. Open the file **`effects-library.js`** using any plain text editor (Notepad on Windows, TextEdit on Mac — set TextEdit to "Plain Text" mode — or a code editor like [VS Code](https://code.visualstudio.com/), which is free).
2. Find the list called `REACTIVE_PRESETS` (for key-press effects) or `AMBIENT_PRESETS` (for always-moving effects).
3. Copy one of the existing effects, paste it, and give it a new name.
4. Change the numbers and colors to make it look different.
5. Save the file.
6. Refresh the `rgb-lighting-studio.html` page in your browser.
7. Your new effect will now appear automatically in the dropdown menu — you do **not** need to touch the `.html` file at all.

### Don't want to write the code yourself? Ask an AI.

This tool has a **built-in prompt** you can copy and give to an AI chat assistant (such as Claude). The AI will write the effect code for you.

1. Click **💡 AI Prompt Guides** in the toolbar.
2. Click **📋 Copy Prompt** under either "Ambient" or "Reactive".
3. Paste it into an AI chat, and add your own idea at the end — for example:
   *"I want an effect that looks like: falling snow"*
4. The AI will give you back a block of code.
5. Paste that code into `effects-library.js`, following the steps above.

---

## ❓ Troubleshooting (common problems)

**The screen is black / nothing is moving.**
Make sure you opened `rgb-lighting-studio.html` with all 3 files still in the same folder, and that you have an internet connection (a few fonts and small helper scripts load from the internet).

**Pressing keys does nothing (Reactive effect).**
- Click once on the page first. Your browser needs to know the page is "active" before it listens to your keyboard.
- Make sure the **⚡ Reactive** checkbox is turned on.
- Make sure your cursor is not inside a text box or a dropdown menu when you press the key.

**I changed the code and now it's broken.**
Undo your last change, save the file, and refresh the browser page. If you're not sure what went wrong, you can always re-download a clean copy of the files from this repo.

**Can I use this on my phone or tablet?**
It works best on a computer. Phones and tablets do not have a physical keyboard to trigger the Reactive effects, so only the Ambient (moving) effects will really work there.

---

## ⚙️ Exporting for real hardware (advanced)

If you build ZMK-based keyboards (like MoErgo Glove80), the **Ambient** effect tab also has:

- **⚙️ ZMK Procedural** — generates C code you can use in your firmware.
- **🔥 Baked LUT (.dtsi)** — "bakes" the animation into a pre-calculated table your firmware can play back.

These two only work for the **Ambient** layer right now. **Reactive** (key-press) effects are a preview inside this app only — real keyboard firmware normally handles key-press lighting a different way, closer to the keyboard's own software.

---

## 🙋 Questions or ideas?

Open an [Issue](../../issues) on this repository, or start a [Discussion](../../discussions) if this repo has that feature enabled.
