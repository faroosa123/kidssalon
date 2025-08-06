# WhatsApp Clone MVP

A minimal viable product (MVP) clone of WhatsApp built with modern web technologies including React (Next.js), Firebase, and TypeScript.

## 🚀 Features

### ✅ Implemented Features

- **User Authentication**: Email/phone number login & signup using Firebase Auth
- **Contact Sync**: Fetch and discover registered users
- **One-to-One Chat**: Real-time text messaging using Firebase Firestore
- **Push Notifications**: Browser notifications for new messages
- **Online/Offline Status**: Show last seen and active status
- **Responsive UI**: Clean, mobile-first design similar to WhatsApp
- **Real-time Updates**: Live chat updates and message delivery
- **Message Status**: Read receipts (single/double check marks)
- **Contact Search**: Find contacts by name, email, or phone number

### 🎯 Core Components

1. **Authentication System**
   - Email/password signup and login
   - User profile management
   - Session persistence

2. **Contact Management**
   - User discovery
   - Contact list with online status
   - Search functionality

3. **Chat System**
   - Real-time messaging
   - Message timestamps
   - Read receipts
   - Auto-scroll to new messages

4. **Notification System**
   - Browser push notifications
   - Foreground message alerts
   - Background message handling

5. **Responsive Design**
   - Mobile-first approach
   - Desktop and mobile layouts
   - WhatsApp-like UI/UX

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Firebase Functions (optional)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation
- **State Management**: React Context + Custom Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Enable Cloud Messaging
   - Get your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.local` and update with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
   ```

5. **Update Firebase service worker**
   - Update `public/firebase-messaging-sw.js` with your Firebase config

6. **Set up Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null; // Allow reading other users for contacts
       }
       
       // Chat documents - users can read/write chats they participate in
       match /chats/{chatId} {
         allow read, write: if request.auth != null && 
           request.auth.uid in resource.data.participants;
       }
       
       // Messages - users can read/write messages in chats they participate in
       match /messages/{messageId} {
         allow read, write: if request.auth != null && 
           (request.auth.uid == resource.data.senderId || 
            request.auth.uid == resource.data.receiverId);
       }
     }
   }
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Navigate to `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup Details

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Optionally enable Phone provider for phone number authentication

2. **Firestore Database**
   - Create a Firestore database in production mode
   - Set up the security rules as shown above

3. **Cloud Messaging**
   - Go to Project Settings > Cloud Messaging
   - Generate a Web Push certificate (VAPID key)
   - Add your domain to authorized domains

4. **Hosting (Optional)**
   - Set up Firebase Hosting for easy deployment
   - Configure custom domain if needed

## 📱 Usage

1. **Sign Up/Login**
   - Create a new account with email and password
   - Add display name and optional phone number

2. **Find Contacts**
   - Click the contacts button to see registered users
   - Search by name, email, or phone number

3. **Start Chatting**
   - Select a contact to start a conversation
   - Send real-time messages
   - See online status and read receipts

4. **Notifications**
   - Allow browser notifications when prompted
   - Receive notifications for new messages
   - Background notifications work even when tab is closed

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── chat/             # Chat-related components
│   └── layout/           # Layout components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   ├── useChats.ts       # Chat management
│   ├── useContacts.ts    # Contact management
│   └── useMessages.ts    # Message management
├── lib/                  # Utilities and configurations
│   └── firebase.ts       # Firebase configuration
├── services/             # External services
│   └── notificationService.ts # Push notifications
└── types/                # TypeScript type definitions
    └── index.ts          # App-wide types
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 🔮 Future Enhancements

- **Group Chats**: Multi-user conversations
- **Media Sharing**: Images, videos, and files
- **Voice Messages**: Audio recording and playback
- **Video Calls**: WebRTC integration
- **Message Encryption**: End-to-end encryption
- **Status Updates**: WhatsApp-style status stories
- **Dark Mode**: Theme switching
- **Message Search**: Full-text search across chats
- **Chat Backup**: Export/import chat history
- **Admin Panel**: User management dashboard

## 🐛 Known Issues

- Push notifications require HTTPS in production
- Service worker needs manual update for Firebase config changes
- Phone number authentication requires additional setup
- Media messages not yet implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Next.js for the React framework
- Tailwind CSS for styling
- Lucide React for icons
- WhatsApp for design inspiration

---

**Note**: This is an educational project and MVP. For production use, consider additional security measures, error handling, and performance optimizations.
