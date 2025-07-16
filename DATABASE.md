# Wess-Serves Database Structure

## Overview
Wess-Serves uses **Google Cloud Firestore** as its NoSQL database. The database stores service hour records with user authentication integration through Firebase Auth.

## Database Configuration

### Firebase Project Details
- **Project ID**: `wessmanservice`
- **Database**: Cloud Firestore in Native mode
- **Authentication**: Firebase Auth with Google OAuth and Email/Password
- **Hosting**: Firebase Hosting (optional)

## Collections

### 1. `serviceHours` Collection

This is the main collection storing all service hour records.

#### Document Structure
```typescript
interface ServiceHour {
  id: string                    // Auto-generated document ID
  userId: string               // Firebase Auth UID (required)
  title: string                // Service activity title
  organization: string         // Organization name
  description: string          // Activity description
  startTime: Timestamp         // When service started
  endTime: Timestamp | null    // When service ended (null if ongoing)
  duration: number             // Duration in minutes
  category: string             // Service category
  isCompleted: boolean         // Whether session is finished
  notes?: string              // Optional notes
  supervisor?: string         // Optional supervisor name
  location?: string           // Optional location
  createdAt: Timestamp        // Document creation time
  updatedAt?: Timestamp       // Last update time
}
```

#### Sample Document
```json
{
  "userId": "abc123xyz789",
  "title": "Food Bank Volunteer",
  "organization": "Community Food Bank",
  "description": "Sorting and packing food donations",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T12:00:00Z",
  "duration": 180,
  "category": "Community Service",
  "isCompleted": true,
  "notes": "Helped pack 200 food boxes",
  "supervisor": "Jane Smith",
  "location": "123 Main St, City",
  "createdAt": "2024-01-15T12:05:00Z",
  "updatedAt": "2024-01-15T12:05:00Z"
}
```

## Security Rules

The database uses comprehensive security rules located in `firestore.rules`:

### Key Security Features
- **User Isolation**: Users can only access their own service hours
- **Authentication Required**: All operations require valid Firebase Auth
- **Data Validation**: Enforces proper data structure and types
- **CRUD Permissions**: 
  - **Create**: Users can create records for themselves
  - **Read**: Users can read only their own records
  - **Update**: Users can update only their own records
  - **Delete**: Users can delete only their own records

### Rule Highlights
```javascript
// Users can only read their own service hours
allow read: if request.auth != null && request.auth.uid == resource.data.userId;

// Users can only create service hours for themselves
allow create: if request.auth != null 
  && request.auth.uid == request.resource.data.userId
  && validateServiceHour(request.resource.data);
```

## Database Indexes

Optimized indexes for efficient querying (defined in `firestore.indexes.json`):

### 1. User + Time Index
- **Fields**: `userId` (ASC), `startTime` (DESC)
- **Purpose**: Fetch user's service hours ordered by most recent

### 2. User + Completion + Time Index
- **Fields**: `userId` (ASC), `isCompleted` (ASC), `startTime` (DESC)
- **Purpose**: Filter completed/incomplete sessions by user

### 3. User + Category + Time Index
- **Fields**: `userId` (ASC), `category` (ASC), `startTime` (DESC)
- **Purpose**: Filter service hours by category per user

## Queries Used in Application

### 1. Fetch User's Service Hours
```typescript
const q = query(
  collection(db, 'serviceHours'),
  where('userId', '==', user.uid),
  orderBy('startTime', 'desc')
)
```

### 2. Real-time Listener
```typescript
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const hours: ServiceHour[] = []
  querySnapshot.forEach((doc) => {
    hours.push({ id: doc.id, ...doc.data() })
  })
  setServiceHours(hours)
})
```

### 3. Add New Service Hour
```typescript
await addDoc(collection(db, 'serviceHours'), {
  ...serviceHour,
  userId: user.uid,
  createdAt: serverTimestamp(),
})
```

## Setup Instructions

### 1. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

### 3. Environment Configuration
Ensure your `lib/firebase.ts` has the correct config:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "wessmanservice.firebaseapp.com",
  projectId: "wessmanservice",
  storageBucket: "wessmanservice.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

## Statistics Calculation

The app calculates statistics client-side from the fetched data:

### Metrics Computed
- **Total Hours**: Sum of all completed session durations
- **This Week Hours**: Hours from sessions this calendar week
- **This Month Hours**: Hours from sessions this calendar month
- **Completed Sessions**: Count of finished service sessions
- **Current Streak**: Days of consecutive service (currently mocked)

### Performance Notes
- Statistics are calculated in-memory for real-time updates
- Large datasets (1000+ records) may benefit from server-side aggregation
- Consider implementing Cloud Functions for complex analytics

## Future Enhancements

### Potential New Collections
1. **`organizations`**: Store organization details and verification
2. **`badges`**: Achievement system for gamification
3. **`teams`**: Group service tracking for organizations
4. **`goals`**: Personal and team service hour goals

### Advanced Features
- **Offline Support**: Enable offline writes with Firestore offline persistence
- **Backup Strategy**: Automated exports for data backup
- **Analytics**: Integration with Firebase Analytics for usage tracking
- **Push Notifications**: Remind users to log service hours

## Monitoring & Maintenance

### Key Metrics to Monitor
- **Read/Write Operations**: Track Firestore usage and costs
- **Security Rule Violations**: Monitor failed access attempts
- **Query Performance**: Ensure indexes are being used effectively
- **Data Growth**: Plan for scaling as user base grows

### Maintenance Tasks
- Regular security rule audits
- Index optimization based on query patterns
- Data cleanup for test/development records
- Performance monitoring and optimization 