const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Attendance = require('../models/Attendance');

const DATA_DIR = path.join(__dirname, '../data');

const isUsingMockDb = () => {
  return mongoose.connection.readyState === 0;
};

const readJSON = (collectionName) => {
  const filepath = path.join(DATA_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filepath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8') || '[]');
  } catch (e) {
    return [];
  }
};

// @desc    Generate a PDF performance report for a specific employee
// @route   GET /api/reports/employee/:id
// @access  Private (Admin, Manager)
const generateEmployeeReport = async (req, res) => {
  const employeeId = req.params.id;

  try {
    let employee, completedTasksCount, totalTasksCount, uniqueProjectsCount, totalHours, attendanceRate;

    if (isUsingMockDb()) {
      // Mock data aggregates
      const users = readJSON('users');
      const tasks = readJSON('tasks');
      const attendances = readJSON('attendances');

      employee = users.find(u => u._id === employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const empTasks = tasks.filter(t => t.assignedTo && t.assignedTo.toString() === employeeId);
      completedTasksCount = empTasks.filter(t => t.status === 'Completed').length;
      totalTasksCount = empTasks.length;

      const projectIds = [...new Set(empTasks.map(t => t.project?.toString()))];
      uniqueProjectsCount = projectIds.filter(Boolean).length;

      const empAtt = attendances.filter(a => a.user && a.user.toString() === employeeId);
      totalHours = empAtt.reduce((sum, current) => sum + (current.workHours || 0), 0);
      
      const presentCount = empAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
      attendanceRate = empAtt.length > 0 ? Math.round((presentCount / empAtt.length) * 100) : 100;

    } else {
      // MongoDB aggregates
      employee = await User.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      completedTasksCount = await Task.countDocuments({ assignedTo: employeeId, status: 'Completed' });
      totalTasksCount = await Task.countDocuments({ assignedTo: employeeId });
      
      const projectIds = await Task.distinct('project', { assignedTo: employeeId });
      uniqueProjectsCount = projectIds.length;

      const empAtt = await Attendance.find({ user: employeeId });
      totalHours = empAtt.reduce((sum, current) => sum + (current.workHours || 0), 0);

      const presentCount = empAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
      attendanceRate = empAtt.length > 0 ? Math.round((presentCount / empAtt.length) * 100) : 100;
    }

    // Performance score calculations
    const taskCompletionRatio = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) : 1.0;
    const taskScore = taskCompletionRatio * 60; // 60% weight
    const attendanceScore = (attendanceRate / 100) * 40; // 40% weight
    const performanceScore = Math.round(taskScore + attendanceScore);

    let rating = 'Satisfactory';
    if (performanceScore >= 90) rating = 'Excellent';
    else if (performanceScore >= 75) rating = 'Very Good';
    else if (performanceScore < 50) rating = 'Needs Improvement';

    // PDFKit Document setup
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Performance_Report_${employee.name.replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // Styling elements
    const blueColor = '#1e3a8a';
    const darkGray = '#1e293b';
    const lightGray = '#f8fafc';

    // Corporate Header Banner
    doc.rect(0, 0, 612, 100).fill(blueColor);
    doc.fillColor('#ffffff')
       .fontSize(18)
       .font('Helvetica-Bold')
       .text('EPWMS ENTERPRISE PORTAL', 50, 30)
       .fontSize(10)
       .font('Helvetica')
       .text('WORKFORCE PERFORMANCE AUDIT REPORT', 50, 55);

    // Profile Details
    doc.fillColor(darkGray)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('EMPLOYEE PROFILE', 50, 130);

    doc.moveTo(50, 150).lineTo(562, 150).stroke('#cbd5e1');

    doc.fontSize(10).font('Helvetica').fillColor('#64748b');
    doc.text('Name:', 50, 165);
    doc.text('Email Address:', 50, 185);
    doc.text('Department:', 50, 205);
    doc.text('Designation:', 50, 225);

    doc.font('Helvetica-Bold').fillColor(darkGray);
    doc.text(employee.name, 150, 165);
    doc.text(employee.email, 150, 185);
    doc.text(employee.department || 'General', 150, 205);
    doc.text(employee.designation || 'Staff', 150, 225);

    // Summary Performance Metrics Section
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor(darkGray)
       .text('MONTHLY SUMMARY METRICS', 50, 265);

    doc.moveTo(50, 285).lineTo(562, 285).stroke('#cbd5e1');

    // Metrics Table Layout
    const tableTop = 300;
    
    // Draw table headers background
    doc.rect(50, tableTop, 512, 22).fill('#3b82f6');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
    doc.text('Metric Parameter', 60, tableTop + 6);
    doc.text('Evaluated Performance State', 350, tableTop + 6);

    // Table rows
    const drawRow = (y, label, val) => {
      doc.rect(50, y, 512, 20).fill(lightGray);
      doc.fillColor(darkGray).font('Helvetica').fontSize(9);
      doc.text(label, 60, y + 6);
      doc.font('Helvetica-Bold').text(val, 350, y + 6);
    };

    drawRow(tableTop + 22, 'Total Tasks Mapped (This Month)', totalTasksCount.toString());
    drawRow(tableTop + 42, 'Completed Tasks (Closed Tickets)', completedTasksCount.toString());
    drawRow(tableTop + 62, 'Active Project Mappings', uniqueProjectsCount.toString());
    drawRow(tableTop + 82, 'Total Working Hours Logged', `${totalHours.toFixed(1)} hrs`);
    drawRow(tableTop + 102, 'Corporate Attendance Rate %', `${attendanceRate}%`);

    // Performance Score Banner
    const bannerTop = 440;
    doc.rect(50, bannerTop, 512, 60).fill('#e0f2fe');
    doc.fillColor('#0369a1')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('PERFORMANCE SCORE AUDIT', 70, bannerTop + 15)
       .fontSize(22)
       .text(`${performanceScore} / 100`, 70, bannerTop + 30);

    doc.fillColor('#0369a1')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text(`Rating Status: ${rating}`, 380, bannerTop + 25);

    // Professional Footer Note
    doc.moveTo(50, 700).lineTo(562, 700).stroke('#cbd5e1');
    doc.fillColor('#94a3b8')
       .fontSize(8)
       .font('Helvetica')
       .text('Confidential - Generated by EPWMS automated payroll analytics audit engine.', 50, 715)
       .text(`Generated Date: ${new Date().toLocaleDateString()}`, 400, 715);

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateEmployeeReport,
};
