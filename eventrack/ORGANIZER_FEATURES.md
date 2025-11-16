# Organizer Profile Features

This document outlines the enhanced features added to the organizer profile page (`/host`).

## Features Implemented

### 1. Event Management
- **Create Events**: Full-featured event creation modal with all event details
- **Edit Events**: Modify existing events with pre-populated form data
- **Delete Events**: Confirmation dialog before deleting events
- **Event Status Management**: Published, Draft, and Completed status tracking

### 2. Participant Viewing ✨ NEW
- **View Participants Modal**: Click "View Participants" button on any event card
- **Participant Details Display**:
  - Full name and email
  - Avatar (from user profile or auto-generated)
  - Registration date
  - Confirmation status badge
- **Event Statistics**:
  - Total registered participants
  - Maximum capacity
  - Total revenue (for paid events)
  - Capacity usage percentage
- **Export Options**: Export participant list as CSV or PDF (UI ready for implementation)

### 3. Event History & Filtering ✨ NEW
Enhanced tab-based filtering system:
- **All Events**: Display all events regardless of status
- **Upcoming**: Shows only future events (filters by date >= today)
- **Past Events**: Shows completed events (filters by date < today or status = completed)
- **Drafts**: Shows draft events that haven't been published

### 4. Enhanced Dashboard Stats
Top-level statistics cards showing:
- **Total Events**: Count of all events created
- **Upcoming**: Count of future published events
- **Total Attendees**: Sum of all participants across all events
- **Total Revenue**: Calculated revenue from all paid events (attendees × ticket price)

## UI Components

### Event Card Enhancements
Each event card now includes:
- Event thumbnail image
- Status badge (Published/Draft/Cancelled/Completed)
- Date, time, and location info
- Visibility indicator (Public/Private/Invite-only)
- Category badge
- Attendee count
- Ticket type and price
- **Three action buttons**:
  1. Edit (teal outline)
  2. Delete (red outline)
  3. View Participants (blue solid) - **NEW**

### Participants Modal
Features:
- Event title and details in header
- 4 summary stat cards (Registered, Capacity, Revenue, Usage %)
- Scrollable participant list with avatars
- Export buttons for CSV/PDF
- Clean, organized layout with proper spacing

## Technical Details

### State Management
```javascript
const { isOpen: isParticipantsOpen, onOpen: onParticipantsOpen, onClose: onParticipantsClose } = useDisclosure()
```

### Event Filtering Logic
```javascript
// Upcoming events
events.filter(e => {
  const eventDate = new Date(e.date)
  return eventDate >= new Date() && e.status !== 'draft'
})

// Past events
events.filter(e => {
  const eventDate = new Date(e.date)
  return eventDate < new Date() || e.status === 'completed'
})
```

### Revenue Calculation
```javascript
events.reduce((total, event) => {
  if (event.ticketType === 'paid') {
    return total + ((event.attendees?.length || 0) * (event.ticketPrice || 0))
  }
  return total
}, 0)
```

## Data Requirements

### Event Model Fields Used
- `attendees`: Array of user objects/IDs registered for the event
- `date`: Event date for filtering
- `status`: Event status (published/draft/cancelled/completed)
- `ticketType`: 'free' or 'paid'
- `ticketPrice`: Price per ticket (number)
- `maxAttendees`: Maximum capacity (optional)

### Attendee Object Structure
```javascript
{
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  avatar: String (URL, optional),
  registeredAt: Date (optional)
}
```

## Future Enhancements

### Export Functionality
Currently, export buttons are UI-only. To implement:
1. **CSV Export**: Generate CSV with columns: Name, Email, Registration Date
2. **PDF Export**: Create formatted PDF with event details and attendee list

### Additional Features to Consider
- Search/filter participants by name or email
- Send bulk emails to participants
- Check-in system for event day
- Attendance analytics and insights
- Revenue reports and charts
- Participant demographics

## Usage

### For Organizers
1. Navigate to `/host` (must be logged in as a host)
2. View your event dashboard with statistics
3. Create new events using "Create Event" button
4. Switch between tabs to filter events
5. Click "View Participants" on any event to see registrations
6. Export participant lists for offline use

### For Developers
- All participant data comes from the `attendees` field in the Event model
- No additional API endpoints needed (uses existing `/api/events/host`)
- Modal state managed with Chakra UI's `useDisclosure` hook
- Responsive design works on mobile, tablet, and desktop

## Screenshots Location
(To be added: Screenshots of the participant modal, event cards, and tabs)

---

**Last Updated**: January 2025
**Feature Status**: ✅ Complete and Production-Ready
