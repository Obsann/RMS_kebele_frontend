import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Initial notification lists per role ──────────────────────────────────────

const adminInitial = [
  { id: 1, type: 'alert', title: 'Urgent: Sewage overflow – Block A entrance', body: 'Samson Tadesse reported a sewage overflow near the Block A entrance. Immediate action required to prevent health risks.', time: '15 min ago', read: false, date: '2026-03-01' },
  { id: 2, type: 'approval', title: 'Digital ID request — Samson Tadesse pending', body: 'Samson Tadesse (Unit A-101) has submitted a Digital ID request. Please review and approve.', time: '1 hour ago', read: false, date: '2026-03-01' },
  { id: 3, type: 'message', title: 'Special Employee report submitted', body: 'Temesgen Alemu submitted the monthly community issues report for February 2026.', time: '3 hours ago', read: false, date: '2026-03-01' },
  { id: 4, type: 'system', title: 'New resident registered', body: 'Ramadan Oumer has registered as a new resident in Unit B-108. Account pending verification.', time: 'Yesterday', read: true, date: '2026-02-28' },
  { id: 5, type: 'approval', title: 'Task completed: Streetlight repair – Block B road', body: 'Samuel Fayisa completed "Repair broken streetlights – Block B road". Ready for verification.', time: 'Yesterday', read: true, date: '2026-02-28' },
  { id: 6, type: 'alert', title: '5 community issues pending action', body: 'There are 5 community issue reports that have been pending for more than 48 hours.', time: '2 days ago', read: true, date: '2026-02-27' },
  { id: 7, type: 'system', title: 'Monthly report ready', body: 'The February 2026 community management report is ready for review.', time: '3 days ago', read: true, date: '2026-02-26' },
];

const seInitial = [
  { id: 1, type: 'message', source: 'admin', title: 'New issue assigned: Sewage overflow – Block A', body: 'Obsan Habtamu has assigned you a new community issue. Residents near Block A entrance reported a sewage overflow. Please coordinate with your team and assign to the appropriate employee.', time: '20 min ago', read: false, date: '2026-03-01' },
  { id: 2, type: 'id_request', source: 'admin', title: 'Digital ID request — Samson Tadesse (A-101)', body: 'Admin has approved the Digital ID request for Samson Tadesse (Unit A-101). Please assign an employee to issue the ID and set a due date.', time: '1 hour ago', read: false, date: '2026-03-01' },
  { id: 3, type: 'urgent', source: 'admin', title: 'Urgent: 5 issues pending over 48 hours', body: 'There are 5 community issue reports that have been in "pending" status for over 48 hours. Please review and take action immediately.', time: '3 hours ago', read: false, date: '2026-03-01' },
  { id: 4, type: 'task_completed', source: 'employee', title: 'Samuel Fayisa completed: Fix drainage – Block C', body: 'Employee Samuel Fayisa has marked the task "Fix drainage issue – Block C entrance" as completed. Please verify and update the status.', time: 'Yesterday, 5:00 PM', read: true, date: '2026-02-28' },
  { id: 5, type: 'task_assigned', source: 'admin', title: 'Clear sewage blockage – Block A assigned to you', body: 'Obsan Habtamu assigned this community issue to you. Please assign to an available maintenance staff member.', time: 'Yesterday, 2:00 PM', read: true, date: '2026-02-28' },
  { id: 6, type: 'task_completed', source: 'employee', title: 'Biruk Woldemariam completed: Pothole repair – Block C', body: 'Employee Biruk Woldemariam completed "Fill pothole – Access road near Block C". Verified by resident.', time: '2 days ago', read: true, date: '2026-02-27' },
  { id: 7, type: 'message', source: 'admin', title: 'Monthly performance review reminder', body: 'Admin: Monthly performance reviews are due this Friday. Please ensure all task statuses are updated and submit your team report by EOD Thursday.', time: '2 days ago', read: true, date: '2026-02-27' },
  { id: 8, type: 'id_request', source: 'admin', title: 'Digital ID request — Mulugeta Haile (C-312)', body: 'A new approved Digital ID request from Admin: Mulugeta Haile (Unit C-312) needs a replacement ID. Please assign employee and set due date.', time: '3 days ago', read: true, date: '2026-02-26' },
  { id: 9, type: 'info', source: 'admin', title: 'Team briefing – Monday 9:00 AM', body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the management office. Your attendance is required.', time: '3 days ago', read: true, date: '2026-02-26' },
];

const employeeInitial = [
  { id: 1, type: 'urgent', title: 'Urgent: Sewage overflow near Block A gate', body: 'A sewage overflow has been reported near the Block A entrance. This requires immediate attention. Please report to the location as soon as possible.', time: '10 minutes ago', read: false, date: '2026-03-01' },
  { id: 2, type: 'task_assigned', title: 'New task assigned: Repair streetlights – Block B', body: 'You have been assigned a new community maintenance task – repair the broken streetlights on Block B road. Due date: 2026-03-03.', time: '1 hour ago', read: false, date: '2026-03-01' },
  { id: 3, type: 'message', title: 'Message from Supervisor Temesgen Alemu', body: 'Please make sure to update task statuses by end of shift today. The monthly report will be generated tomorrow morning.', time: '3 hours ago', read: false, date: '2026-03-01' },
  { id: 4, type: 'task_assigned', title: 'New task assigned: Fix water main valve – Block A', body: 'Task has been assigned to you. Location: Block A water main. Category: Water Supply. Priority: High. Due: 2026-03-02.', time: 'Yesterday, 4:30 PM', read: true, date: '2026-02-28' },
  { id: 5, type: 'task_completed', title: 'Task verified: Drainage repair – Block C', body: 'Your completed task "Fix drainage issue – Block C entrance" has been reviewed and verified by admin. Great work!', time: 'Yesterday, 11:00 AM', read: true, date: '2026-02-28' },
  { id: 6, type: 'info', title: 'Schedule reminder: Road inspection round', body: 'Your monthly road and infrastructure inspection round is scheduled for this Friday, 2026-03-06. Blocks B and C are on the list.', time: '2 days ago', read: true, date: '2026-02-27' },
  { id: 7, type: 'message', title: 'Resident feedback received', body: 'Resident Mulugeta Haile (Block C) has left positive feedback for your work on the sanitation cleanup. "Very professional and prompt service."', time: '2 days ago', read: true, date: '2026-02-27' },
  { id: 8, type: 'info', title: 'Team meeting — Monday 9:00 AM', body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the maintenance office. Please attend on time.', time: '3 days ago', read: true, date: '2026-02-26' },
  { id: 9, type: 'task_completed', title: 'Task verified: Community notice board – Block B', body: 'Task "Replace community notice board – Block B" has been marked as verified by Samuel Tolasa. Thank you for completing it on time.', time: '4 days ago', read: true, date: '2026-02-25' },
];

const residentInitial = [
  { id: 1, type: 'info', title: 'Digital ID request received', body: 'Your Digital ID request has been received and is currently under review by the administration. You will be notified once it is approved or if any additional documents are required.', time: '2 hours ago', read: false, date: '2026-03-01' },
  { id: 2, type: 'info', title: 'Community issue update', body: 'Your report #CR-2045 (Water supply interruption – Block A) has been assigned to a maintenance staff member and will be addressed within 24 hours.', time: 'Yesterday', read: true, date: '2026-02-28' },
];

// ── Context ──────────────────────────────────────────────────────────────────

export const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [store, setStore] = useState({
    admin: adminInitial,
    'special-employee': seInitial,
    employee: employeeInitial,
    resident: residentInitial,
  });

  const getNotifications = useCallback((role) => store[role] ?? [], [store]);

  const getUnreadCount = useCallback(
    (role) => (store[role] ?? []).filter((n) => !n.read).length,
    [store]
  );

  const markAsRead = useCallback((role, id) => {
    setStore((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllAsRead = useCallback((role) => {
    setStore((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const dismiss = useCallback((role, id) => {
    setStore((prev) => ({
      ...prev,
      [role]: prev[role].filter((n) => n.id !== id),
    }));
  }, []);

  const pushNotification = useCallback((role, notification) => {
    const newNotif = {
      ...notification,
      id: Date.now() + Math.random(),
      read: false,
      date: '2026-03-01',
      time: 'Just now',
    };
    setStore((prev) => ({
      ...prev,
      [role]: [newNotif, ...(prev[role] ?? [])],
    }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ getNotifications, getUnreadCount, markAsRead, markAllAsRead, dismiss, pushNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
