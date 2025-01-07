# BotaniQ 🌱

**BotaniQ** is a plant management app that helps users track and care for their plants. With an easy-to-use interface, you can add, view, and manage your plants, and keep them thriving with personalized reminders and care tips.

![BotaniQ Logo](./BotaniQ/assets/images/botaniq-logo.png)  

---

## Features
- Add and manage plants
- View plant details and care instructions
- Keep track of watering and maintenance schedules
- Beautiful and simple UI to make plant care easier
- Google Signin feature and storing plants in realtime supabase database
- Automatically create google calendar event on plant creation, Receive email notification for plants

---

## Tech Stack
- **React Native** (via Expo)
- **Expo SDK** for faster development and easier deployment
- **NativeWind** for styling
- **Supabase** for backend and database
- **Google Console Api** for handling authentication 

---

## How to Run the App

### Prerequisites

Before running the app locally, you need to have the following installed:
- [Node.js](https://nodejs.org/) (with npm)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (install via `npm install -g expo-cli`)
- A mobile device or emulator to test the app

### Steps to Run the App

1. **Clone the repository**
2. **Must have Java Jdk and android adb installed**

   ```bash
   git clone https://github.com/Saimun-jd/BotaniQ.git
   cd BotaniQ
   npm i
   npx expo run:android
