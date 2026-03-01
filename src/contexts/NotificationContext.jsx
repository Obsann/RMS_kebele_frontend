import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Initial notification lists per role ──────────────────────────────────────

const adminInitial = [
  { id: 1, type: 'alert',    title: 'Urgent maintenance needed – Unit A-101',  body: 'Samson Tadesse reported a burst pipe. Immediate action required.',                                                                    time: '15 min ago',    read: false, date: '2026-03-01' },
  { id: 2, type: 'approval', title: 'Digital ID request — Samson Tadesse pending', body: 'Samson Tadesse (Unit A-101) has submitted a Digital ID request. Please review and approve.',                                       time: '1 hour ago',    read: false, date: '2026-03-01' },
  { id: 3, type: 'message',  title: 'Special Employee report submitted',         body: 'Temesgen Alemu submitted the monthly maintenance report for February 2026.',                                                     time: '3 hours ago',   read: false, date: '2026-03-01' },
  { id: 4, type: 'system',   title: 'New resident registered',                   body: 'Ramadan Oumer has registered as a new resident in Unit B-108. Account pending verification.',                                  time: 'Yesterday',     read: true,  date: '2026-02-28' },
  { id: 5, type: 'approval', title: 'Job #J-2041 completed',                     body: 'Samuel Fayisa completed "Install new electrical outlet – Unit A-204". Ready for verification.',                                  time: 'Yesterday',     read: true,  date: '2026-02-28' },
  { id: 6, type: 'alert',    title: '5 requests pending action',                  body: 'There are 5 maintenance requests that have been pending for more than 48 hours.',                                              time: '2 days ago',    read: true,  date: '2026-02-27' },
  { id: 7, type: 'system',   title: 'Monthly report ready',                       body: 'The February 2026 property management report is ready for review.',                                                            time: '3 days ago',    read: true,  date: '2026-02-26' },
];

const seInitial = [
  { id: 1, type: 'message',      source: 'admin',    title: 'New job assigned: Fix leaking pipe – Unit A-101',         body: 'Obsan Habtamu has assigned you a new job. Resident Samson Tadesse reported a burst pipe. Please coordinate with your team and assign to the appropriate employee.',                      time: '20 min ago',    read: false, date: '2026-03-01' },
  { id: 2, type: 'id_request',   source: 'admin',    title: 'Digital ID request — Samson Tadesse (A-101)',                 body: 'Admin has approved the Digital ID request for Samson Tadesse (Unit A-101). Please assign an employee to issue the ID and set a due date.',                                            time: '1 hour ago',    read: false, date: '2026-03-01' },
  { id: 3, type: 'urgent',       source: 'admin',    title: 'Urgent: 5 requests pending over 48 hours',                 body: 'There are 5 maintenance requests that have been in "pending" status for over 48 hours. Please review and take action immediately.',                                                   time: '3 hours ago',   read: false, date: '2026-03-01' },
  { id: 4, type: 'job_completed',source: 'employee', title: 'Samuel Fayisa completed: Fix door lock – Unit C-201',       body: 'Employee Samuel Fayisa has marked the job "Fix door lock – Unit C-201" as completed. Please verify and update the status.',                                                          time: 'Yesterday, 5:00 PM', read: true,  date: '2026-02-28' },
  { id: 5, type: 'job_assigned', source: 'admin',    title: 'Install new outlets – Unit A-204 assigned to you',         body: 'Obsan Habtamu assigned job #J-2041 to you (Installation of electrical outlets – Unit A-204). Please assign to an available electrician.',                                             time: 'Yesterday, 2:00 PM', read: true,  date: '2026-02-28' },
  { id: 6, type: 'job_completed',source: 'employee', title: 'Biruk Woldemariam completed: AC maintenance – Unit C-312', body: 'Employee Biruk Woldemariam completed "AC maintenance – Unit C-312". The resident has confirmed the AC is now working properly.',                                                    time: '2 days ago',    read: true,  date: '2026-02-27' },
  { id: 7, type: 'message',      source: 'admin',    title: 'Monthly performance review reminder',                       body: 'Admin: Monthly performance reviews are due this Friday. Please ensure all job statuses are updated and submit your team report by EOD Thursday.',                                   time: '2 days ago',    read: true,  date: '2026-02-27' },
  { id: 8, type: 'id_request',   source: 'admin',    title: 'Digital ID request — Mulugeta Haile (C-312)',               body: 'A new approved Digital ID request from Admin: Mulugeta Haile (Unit C-312) needs a replacement ID. Please assign employee and set due date.',                                        time: '3 days ago',    read: true,  date: '2026-02-26' },
  { id: 9, type: 'info',         source: 'admin',    title: 'Team briefing – Monday 9:00 AM',                            body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the management office. Your attendance is required.',                                                  time: '3 days ago',    read: true,  date: '2026-02-26' },
];

const employeeInitial = [
  { id: 1, type: 'urgent',       title: 'Urgent: Pipe burst in Unit A-101',            body: 'Resident Samson Tadesse has reported a burst pipe in the bathroom. This requires immediate attention. Please report to Unit A-101 as soon as possible.',                                     time: '10 minutes ago',     read: false, date: '2026-03-01' },
  { id: 2, type: 'job_assigned', title: 'New job assigned: Replace ceiling fan',        body: 'You have been assigned a new maintenance job — replace the ceiling fan in Unit B-305. Resident: Olyad Amanuel. Due date: 2026-03-03.',                                                    time: '1 hour ago',         read: false, date: '2026-03-01' },
  { id: 3, type: 'message',      title: 'Message from Supervisor Temesgen Alemu',       body: 'Please make sure to update job statuses by end of shift today. The monthly report will be generated tomorrow morning.',                                                                     time: '3 hours ago',        read: false, date: '2026-03-01' },
  { id: 4, type: 'job_assigned', title: 'New job assigned: Install new electrical outlet', body: 'Job #J-2041 has been assigned to you. Location: Unit A-204. Category: Electrical. Priority: Medium. Due: 2026-03-02.',                                                               time: 'Yesterday, 4:30 PM', read: true,  date: '2026-02-28' },
  { id: 5, type: 'job_completed',title: 'Job #J-2035 marked as verified',                body: 'Your completed job "Fix door lock – Unit C-201" has been reviewed and verified by admin. Great work!',                                                                                   time: 'Yesterday, 11:00 AM',read: true,  date: '2026-02-28' },
  { id: 6, type: 'info',         title: 'Schedule reminder: AC maintenance round',       body: 'Your monthly AC maintenance inspection round is scheduled for this Friday, 2026-03-06. Buildings B and C are on the list.',                                                              time: '2 days ago',         read: true,  date: '2026-02-27' },
  { id: 7, type: 'message',      title: 'Resident feedback received',                    body: 'Resident Mulugeta Haile (Unit C-312) has left positive feedback for your work on the HVAC repair. "Very professional and prompt service."',                                              time: '2 days ago',         read: true,  date: '2026-02-27' },
  { id: 8, type: 'info',         title: 'Team meeting — Monday 9:00 AM',                 body: 'There will be a mandatory team briefing on Monday, 2026-03-02 at 9:00 AM in the maintenance office. Please attend on time.',                                                            time: '3 days ago',         read: true,  date: '2026-02-26' },
  { id: 9, type: 'job_completed',title: 'Job #J-2028 verified: Replace light bulbs',     body: 'Job "Replace light bulbs – Unit B-108" has been marked as verified by Samuel Tolasa. Thank you for completing it on time.',                                                           time: '4 days ago',         read: true,  date: '2026-02-25' },
];

const residentInitial = [
  { id: 1, type: 'info', title: 'Digital ID request received', body: 'Your Digital ID request has been received and is currently under review by the administration. You will be notified once it is approved or if any additional documents are required.', time: '2 hours ago', read: false, date: '2026-03-01' },
  { id: 2, type: 'info', title: 'Maintenance request update',  body: 'Your maintenance request #MR-2045 (Leaking faucet – bathroom) has been assigned to an employee and will be addressed within 24 hours.',                                                 time: 'Yesterday',   read: true,  date: '2026-02-28' },
];

// ── Context ──────────────────────────────────────────────────────────────────

export const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [store, setStore] = useState({
    admin:            adminInitial,
    'special-employee': seInitial,
    employee:         employeeInitial,
    resident:         residentInitial,
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
