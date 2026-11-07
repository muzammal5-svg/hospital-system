const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'docs', 'dashboard-redesign');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function runCapture() {
  console.log('--- Starting Comprehensive Staff UI Redesign Screenshot Capture ---');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  async function loginAs(email, password, viewport) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await page.waitForTimeout(1200);
    return { context, page };
  }

  // 1. DESKTOP CAPTURES (1440x900)
  console.log('Capturing Desktop 1440px screenshots...');
  const desktopVp = { width: 1440, height: 900 };

  // A. Admin Overview
  const adminDesk = await loginAs('admin@naseemijaz.pk', 'Admin@123', desktopVp);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '01_desktop_overview_admin.png'), fullPage: true });

  // Patients Directory & Drawer
  await adminDesk.page.goto('http://localhost:3000/dashboard/patients', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '05_desktop_patients_directory.png'), fullPage: true });
  // Open patient drawer
  const viewFirstPatientBtn = await adminDesk.page.$('table tbody tr:first-child button:has-text("View")');
  if (viewFirstPatientBtn) {
    await viewFirstPatientBtn.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '06_desktop_patients_drawer.png'), fullPage: false });
    // Close drawer
    await adminDesk.page.keyboard.press('Escape');
    await adminDesk.page.waitForTimeout(500);
  }

  // Appointments Roster (List & Grid & Modal)
  await adminDesk.page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '07_desktop_appointments_list.png'), fullPage: true });
  // Switch to Grid view
  const gridViewBtn = await adminDesk.page.$('button:has-text("Time-Slot Grid")');
  if (gridViewBtn) {
    await gridViewBtn.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '08_desktop_appointments_grid.png'), fullPage: true });
  }
  // Open Booking Modal
  const bookModalBtn = await adminDesk.page.$('button:has-text("Book Appointment")');
  if (bookModalBtn) {
    await bookModalBtn.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '09_desktop_appointments_modal.png'), fullPage: false });
    await adminDesk.page.keyboard.press('Escape');
    await adminDesk.page.waitForTimeout(500);
  }

  // Live Queue (3 columns)
  await adminDesk.page.goto('http://localhost:3000/dashboard/queue', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '14_desktop_live_queue_kanban.png'), fullPage: true });

  // Billing & Cash Counter (Table, Refund Modal, Cash Closing)
  await adminDesk.page.goto('http://localhost:3000/dashboard/billing', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '15_desktop_billing_invoices_table.png'), fullPage: true });
  // Open Cash Closing Handover panel
  const cashClosingBtn = await adminDesk.page.$('button:has-text("Cash Closing Handover")');
  if (cashClosingBtn) {
    await cashClosingBtn.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '16_desktop_billing_cash_closing_drawer.png'), fullPage: false });
    await adminDesk.page.keyboard.press('Escape');
    await adminDesk.page.waitForTimeout(500);
  }
  // Open Refund Modal
  const refundBtn = await adminDesk.page.$('table tbody tr:first-child button:has-text("Refund")');
  if (refundBtn) {
    await refundBtn.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '17_desktop_billing_refund_modal.png'), fullPage: false });
    await adminDesk.page.keyboard.press('Escape');
    await adminDesk.page.waitForTimeout(500);
  }

  // Reports (Analytics, Audit Log, Inquiries)
  await adminDesk.page.goto('http://localhost:3000/dashboard/reports', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '18_desktop_reports_analytics.png'), fullPage: true });
  const auditTab = await adminDesk.page.$('button:has-text("System Audit Log")');
  if (auditTab) {
    await auditTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '19_desktop_reports_audit_log.png'), fullPage: true });
  }
  const inquiryTab = await adminDesk.page.$('button:has-text("Website Inquiries")');
  if (inquiryTab) {
    await inquiryTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '20_desktop_reports_inquiries.png'), fullPage: true });
  }

  // Settings Tabs
  await adminDesk.page.goto('http://localhost:3000/dashboard/settings', { waitUntil: 'domcontentloaded' });
  await adminDesk.page.waitForTimeout(1000);
  await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '21_desktop_settings_profile.png'), fullPage: true });
  const docTab = await adminDesk.page.$('button:has-text("Doctors & Roaming")');
  if (docTab) {
    await docTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '22_desktop_settings_doctors.png'), fullPage: true });
  }
  const usersTab = await adminDesk.page.$('button:has-text("Staff Users & RBAC")');
  if (usersTab) {
    await usersTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '23_desktop_settings_users.png'), fullPage: true });
  }
  const printTab = await adminDesk.page.$('button:has-text("Printing & Slips")');
  if (printTab) {
    await printTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '24_desktop_settings_printing.png'), fullPage: true });
  }
  const backupTab = await adminDesk.page.$('button:has-text("Database & System")');
  if (backupTab) {
    await backupTab.click();
    await adminDesk.page.waitForTimeout(800);
    await adminDesk.page.screenshot({ path: path.join(OUT_DIR, '25_desktop_settings_backup.png'), fullPage: true });
  }
  await adminDesk.context.close();

  // B. Receptionist Overview & Intake Desk Details
  const recDesk = await loginAs('reception@naseemijaz.pk', 'Reception@123', desktopVp);
  await recDesk.page.screenshot({ path: path.join(OUT_DIR, '02_desktop_overview_receptionist.png'), fullPage: true });

  await recDesk.page.goto('http://localhost:3000/dashboard/reception', { waitUntil: 'domcontentloaded' });
  await recDesk.page.waitForTimeout(1000);
  // Empty Intake desk
  await recDesk.page.screenshot({ path: path.join(OUT_DIR, '26_desktop_intake_empty.png'), fullPage: true });

  // Filled Intake desk
  await recDesk.page.fill('input[placeholder="e.g. Muhammad Asif"]', 'طارق بشیر ملک');
  await recDesk.page.fill('input[placeholder="e.g. Abdul Rasheed"]', 'بشیر احمد');
  await recDesk.page.fill('input[placeholder="34"]', '42');
  await recDesk.page.fill('input[placeholder="35201-1234567-1"]', '35201-8877665-3');
  await recDesk.page.fill('input[placeholder="0300-1234567"]', '0300-4455667');
  await recDesk.page.fill('input[placeholder="House / Street / Area"]', 'گلبرگ 3، فیروزپور روڈ، لاہور');
  await recDesk.page.waitForTimeout(800);
  await recDesk.page.screenshot({ path: path.join(OUT_DIR, '27_desktop_intake_filled.png'), fullPage: true });

  // Duplicate warning test
  await recDesk.page.fill('input[placeholder="0300-1234567"]', '03001234567');
  await recDesk.page.waitForTimeout(1200);
  await recDesk.page.screenshot({ path: path.join(OUT_DIR, '28_desktop_intake_duplicate_warning.png'), fullPage: false });

  // Search Results
  await recDesk.page.click('button:has-text("Search Master Directory")');
  await recDesk.page.waitForTimeout(600);
  await recDesk.page.fill('input[placeholder*="MR Number"]', 'NIH');
  await recDesk.page.press('input[placeholder*="MR Number"]', 'Enter');
  await recDesk.page.waitForTimeout(1000);
  await recDesk.page.screenshot({ path: path.join(OUT_DIR, '29_desktop_intake_search_results.png'), fullPage: true });

  // Token Modal: Select from search results first
  const selectBtn = await recDesk.page.$('button:has-text("Select")');
  if (selectBtn) {
    await selectBtn.click();
    await recDesk.page.waitForTimeout(600);
  } else {
    await recDesk.page.click('button:has-text("Issue Token (F4)")');
    await recDesk.page.waitForTimeout(600);
  }
  const issueSlipBtn = await recDesk.page.$('button:has-text("Issue Token & Print 80mm Slip")');
  if (issueSlipBtn && await issueSlipBtn.isEnabled()) {
    await issueSlipBtn.click();
    await recDesk.page.waitForTimeout(1500);
    await recDesk.page.screenshot({ path: path.join(OUT_DIR, '30_desktop_intake_token_modal.png'), fullPage: false });
    await recDesk.page.keyboard.press('Escape');
    await recDesk.page.waitForTimeout(500);
  }
  await recDesk.context.close();

  // C. Doctor Overview & Clinical Suite
  const docDesk = await loginAs('doctor@naseemijaz.pk', 'Doctor@123', desktopVp);
  await docDesk.page.screenshot({ path: path.join(OUT_DIR, '03_desktop_overview_doctor.png'), fullPage: true });

  await docDesk.page.goto('http://localhost:3000/dashboard/doctor', { waitUntil: 'domcontentloaded' });
  await docDesk.page.waitForTimeout(1000);
  await docDesk.page.screenshot({ path: path.join(OUT_DIR, '10_desktop_doctor_vitals_tab.png'), fullPage: true });

  const notesTab = await docDesk.page.$('button:has-text("Consultation Notes")');
  if (notesTab) {
    await notesTab.click();
    await docDesk.page.waitForTimeout(600);
    await docDesk.page.screenshot({ path: path.join(OUT_DIR, '11_desktop_doctor_notes_tab.png'), fullPage: true });
  }

  const rxTab = await docDesk.page.$('button:has-text("Prescription (Rx)")');
  if (rxTab) {
    await rxTab.click();
    await docDesk.page.waitForTimeout(600);
    await docDesk.page.screenshot({ path: path.join(OUT_DIR, '12_desktop_doctor_prescription_tab.png'), fullPage: true });
  }

  const labTab = await docDesk.page.$('button:has-text("Lab Orders")');
  if (labTab) {
    await labTab.click();
    await docDesk.page.waitForTimeout(600);
    await docDesk.page.screenshot({ path: path.join(OUT_DIR, '13_desktop_doctor_lab_orders_tab.png'), fullPage: true });
  }
  await docDesk.context.close();

  // D. Accountant Overview
  const accDesk = await loginAs('accountant@naseemijaz.pk', 'Accountant@123', desktopVp);
  await accDesk.page.screenshot({ path: path.join(OUT_DIR, '04_desktop_overview_accountant.png'), fullPage: true });
  await accDesk.context.close();

  // 2. MOBILE CAPTURES (390x844 - iPhone 14 / modern smartphone)
  console.log('Capturing Mobile 390px screenshots...');
  const mobileVp = { width: 390, height: 844 };

  const adminMob = await loginAs('admin@naseemijaz.pk', 'Admin@123', mobileVp);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '31_mobile_overview_admin.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/reception', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '32_mobile_intake_desk.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/patients', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '33_mobile_patients_directory.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '34_mobile_appointments.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/queue', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '35_mobile_queue.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/billing', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '36_mobile_billing.png'), fullPage: true });

  await adminMob.page.goto('http://localhost:3000/dashboard/doctor', { waitUntil: 'domcontentloaded' });
  await adminMob.page.waitForTimeout(1000);
  await adminMob.page.screenshot({ path: path.join(OUT_DIR, '37_mobile_doctor_suite.png'), fullPage: true });

  await adminMob.context.close();

  await browser.close();
  console.log(`Successfully captured all screenshots in ${OUT_DIR}!`);
}

runCapture().catch(console.error);
