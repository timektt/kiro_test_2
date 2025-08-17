# Task 05: Real-time Chat System

## 📋 Overview
**Priority:** Medium  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Basic app functionality, WebSocket support  

## 🎯 Objective
พัฒนาระบบแชทแบบ real-time สำหรับให้ผู้ใช้สามารถสนทนากันได้ทันที รองรับทั้ง private messages และ group chats

## 📝 Task Details

### Step 1: Database Schema Update
1. **เพิ่ม Chat Models ใน Prisma Schema**
   ```prisma
   // เพิ่มใน prisma/schema.prisma
   model ChatRoom {
     id          String   @id @default(cuid())
     name        String?
     type        ChatType @default(PRIVATE)
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     // Relations
     participants ChatParticipant[]
     messages     ChatMessage[]
     
     @@map("chat_rooms")
   }
   
   model ChatParticipant {
     id         String   @id @default(cuid())
     userId     String
     chatRoomId String
     joinedAt   DateTime @default(now())
     lastSeen   DateTime?
     
     // Relations
     user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
     chatRoom ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
     
     @@unique([userId, chatRoomId])
     @@map("chat_participants")
   }
   
   model ChatMessage {
     id         String      @id @default(cuid())
     content    String
     type       MessageType @default(TEXT)
     senderId   String
     chatRoomId String
     createdAt  DateTime    @default(now())
     updatedAt  DateTime    @updatedAt
     
     // Relations
     sender   User     @relation(fields: [senderId], references: [id], onDelete: Cascade)
     chatRoom ChatRoom @relation(fields: [chatRoomId], references: [id], onDelete: Cascade)
     
     @@map("chat_messages")
   }
   
   enum ChatType {
     PRIVATE
     GROUP
   }
   
   enum MessageType {
     TEXT
     IMAGE
     FILE
   }
   ```

2. **อัพเดท User Model**
   ```prisma
   model User {
     // ... existing fields
     
     // Chat relations
     chatParticipants ChatParticipant[]
     sentMessages     ChatMessage[]
   }
   ```

3. **รัน Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Step 2: WebSocket Server Setup
1. **ติดตั้ง Socket.IO**
   ```bash
   npm install socket.io socket.io-client
   npm install -D @types/socket.io
   ```

2. **สร้าง Socket.IO Server**
   ```bash
   # สร้างไฟล์ socket server
   touch src/lib/socket.ts
   touch src/app/api/socket/route.ts
   ```

3. **ตั้งค่า Next.js Custom Server (ถ้าจำเป็น)**
   ```bash
   touch server.js
   ```

### Step 3: Chat API Endpoints
1. **สร้าง Chat API Routes**
   ```bash
   mkdir -p src/app/api/chat
   touch src/app/api/chat/rooms/route.ts
   touch src/app/api/chat/messages/route.ts
   touch src/app/api/chat/participants/route.ts
   ```

2. **Chat Service Layer**
   ```bash
   mkdir -p src/lib/services
   touch src/lib/services/chat.ts
   ```

### Step 4: Frontend Chat Components
1. **สร้าง Chat Components**
   ```bash
   mkdir -p src/components/chat
   touch src/components/chat/chat-room.tsx
   touch src/components/chat/message-list.tsx
   touch src/components/chat/message-input.tsx
   touch src/components/chat/chat-sidebar.tsx
   touch src/components/chat/user-list.tsx
   ```

2. **Chat Hooks**
   ```bash
   mkdir -p src/hooks
   touch src/hooks/use-socket.ts
   touch src/hooks/use-chat.ts
   ```

3. **Chat Store (Zustand)**
   ```bash
   touch src/store/chat-store.ts
   ```

### Step 5: Chat Pages
1. **สร้าง Chat Pages**
   ```bash
   mkdir -p src/app/chat
   touch src/app/chat/page.tsx
   touch src/app/chat/[roomId]/page.tsx
   touch src/app/chat/layout.tsx
   ```

2. **Chat Navigation**
   ```bash
   # เพิ่ม chat link ใน navigation
   # อัพเดท src/components/layout/navbar.tsx
   ```

### Step 6: Real-time Features
1. **Socket Event Handlers**
   - `join_room`: เข้าร่วม chat room
   - `leave_room`: ออกจาก chat room
   - `send_message`: ส่งข้อความ
   - `receive_message`: รับข้อความ
   - `user_typing`: แสดงสถานะกำลังพิมพ์
   - `user_online`: แสดงสถานะออนไลน์

2. **Message Features**
   - Text messages
   - Image sharing
   - File sharing
   - Message reactions
   - Message editing/deletion

3. **Notification System**
   - Real-time message notifications
   - Unread message count
   - Sound notifications

## ✅ Checklist

### Database Schema
- [ ] เพิ่ม ChatRoom model แล้ว
- [ ] เพิ่ม ChatParticipant model แล้ว
- [ ] เพิ่ม ChatMessage model แล้ว
- [ ] เพิ่ม ChatType และ MessageType enums แล้ว
- [ ] อัพเดท User model relations แล้ว
- [ ] รัน migration สำเร็จ

### WebSocket Setup
- [ ] ติดตั้ง Socket.IO แล้ว
- [ ] สร้าง socket server แล้ว
- [ ] ตั้งค่า socket connection แล้ว
- [ ] ทดสอบ WebSocket connection สำเร็จ

### API Endpoints
- [ ] สร้าง chat rooms API แล้ว
- [ ] สร้าง messages API แล้ว
- [ ] สร้าง participants API แล้ว
- [ ] สร้าง chat service layer แล้ว
- [ ] ทดสอบ API endpoints สำเร็จ

### Frontend Components
- [ ] สร้าง ChatRoom component แล้ว
- [ ] สร้าง MessageList component แล้ว
- [ ] สร้าง MessageInput component แล้ว
- [ ] สร้าง ChatSidebar component แล้ว
- [ ] สร้าง UserList component แล้ว

### Hooks & Store
- [ ] สร้าง useSocket hook แล้ว
- [ ] สร้าง useChat hook แล้ว
- [ ] สร้าง chat store แล้ว
- [ ] ทดสอบ state management สำเร็จ

### Pages & Navigation
- [ ] สร้าง chat pages แล้ว
- [ ] เพิ่ม chat navigation แล้ว
- [ ] ตั้งค่า routing แล้ว
- [ ] ทดสอบ navigation สำเร็จ

### Real-time Features
- [ ] Socket event handlers ทำงาน
- [ ] Real-time messaging ทำงาน
- [ ] Typing indicators ทำงาน
- [ ] Online status ทำงาน
- [ ] Message notifications ทำงาน

## 🚨 Common Issues

### WebSocket Connection Issues
```bash
# Error: WebSocket connection failed
# Solution: ตรวจสอบ server configuration และ CORS settings
```

### Database Migration Issues
```bash
# Error: Migration failed due to foreign key constraints
# Solution: ตรวจสอบ relations และ cascade settings
npx prisma db push --force-reset
```

### Socket.IO Issues
```bash
# Error: Socket.IO not connecting in production
# Solution: ตรวจสอบ transport settings และ polling fallback
```

### Performance Issues
```bash
# Error: High memory usage with many connections
# Solution: Implement connection pooling และ message cleanup
```

## 🔧 Commands

```bash
# Quick chat system setup
npm run task:chat-setup

# Manual setup steps
npm install socket.io socket.io-client
npx prisma db push
npx prisma generate
npm run dev

# Test chat functionality
npm run test:chat

# Monitor WebSocket connections
npm run monitor:sockets
```

## 📱 Chat Features

### Core Features
- **Private Messages**: 1-on-1 conversations
- **Group Chats**: Multiple participants
- **Real-time Messaging**: Instant message delivery
- **Typing Indicators**: Show when users are typing
- **Online Status**: Show user online/offline status
- **Message History**: Persistent message storage

### Advanced Features
- **Message Reactions**: Emoji reactions to messages
- **File Sharing**: Upload and share files
- **Image Sharing**: Upload and display images
- **Message Search**: Search through chat history
- **Message Editing**: Edit sent messages
- **Message Deletion**: Delete messages

### UI/UX Features
- **Responsive Design**: Works on mobile and desktop
- **Dark/Light Mode**: Theme support
- **Notification Sounds**: Audio notifications
- **Unread Badges**: Show unread message count
- **Auto-scroll**: Scroll to latest messages

## 🔍 Testing Chat System

### Manual Testing
1. **สร้าง Chat Room**
   - ไปที่ `/chat`
   - สร้าง private chat กับ user อื่น
   - สร้าง group chat

2. **ทดสอบ Real-time Messaging**
   - เปิด 2 browser windows
   - Login ด้วย users ต่างกัน
   - ส่งข้อความและตรวจสอบ real-time delivery

3. **ทดสอบ Features**
   - Typing indicators
   - Online status
   - Message notifications
   - File/image sharing

### Automated Testing
```bash
# Unit tests
npm run test:chat-components

# Integration tests
npm run test:chat-api

# E2E tests
npm run test:chat-e2e
```

## 📊 Performance Considerations

### Optimization Strategies
- **Message Pagination**: Load messages in chunks
- **Connection Pooling**: Manage WebSocket connections efficiently
- **Message Cleanup**: Archive old messages
- **Caching**: Cache frequently accessed chat rooms
- **Compression**: Compress WebSocket messages

### Monitoring
- **Active Connections**: Monitor concurrent WebSocket connections
- **Message Throughput**: Track messages per second
- **Memory Usage**: Monitor server memory consumption
- **Response Time**: Track message delivery latency

## 📚 References

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Next.js WebSocket Integration](https://nextjs.org/docs/api-routes/introduction)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Real-time Chat Best Practices](https://socket.io/docs/v4/tutorial/step-1)

## ➡️ Next Task
หลังจากเสร็จ task นี้แล้ว ให้ไปทำ [Task 06: Advanced Search Feature](./06-advanced-search.md)

---
**Status:** ⏳ Pending  
**Last Updated:** $(date)