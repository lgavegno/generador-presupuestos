# MOD-01: REQUIREMENTS SPECIFICATION

**Status:** ACTIVE  
**Version:** 1.0  
**Last Updated:** Marzo 2026  

---

## FUNCTIONAL REQUIREMENTS (FR)

### FR-001: Form Data Collection
- [ ] Collect 11 sections of form data
- [ ] Support 45+ form fields
- [ ] Validate required fields
- [ ] Show validation errors

### FR-002: Price Calculation
- [ ] Calculate base price by type
- [ ] Add section prices ($40k each)
- [ ] Add feature prices ($50k each)
- [ ] Calculate 21% tax
- [ ] Show ARS and USD totals

### FR-003: Presupuesto Display
- [ ] Show live presupuesto as user selects
- [ ] Break down by component
- [ ] Update in real-time
- [ ] Show summary card

### FR-004: Prompt Generation
- [ ] Generate detailed WordPress prompt
- [ ] Include all form data
- [ ] Include pricing breakdown
- [ ] Include design specifications
- [ ] Include technical requirements

### FR-005: Google Sheets Integration
- [ ] Save all submissions to Sheet
- [ ] Create new row per submission
- [ ] Include timestamp
- [ ] Include unique submission ID
- [ ] Handle errors gracefully

### FR-006: Email Notifications
- [ ] Send email on submission
- [ ] Email to osvojag@gmail.com
- [ ] Include all form data
- [ ] Include presupuesto
- [ ] Include prompt
- [ ] Send within 5 seconds

### FR-007: User Feedback
- [ ] Show loading indicator
- [ ] Show success confirmation
- [ ] Show error messages
- [ ] Reset form on success
- [ ] Scroll to confirmation

### FR-008: Responsive Design
- [ ] Work on mobile devices
- [ ] Work on tablets
- [ ] Work on desktops
- [ ] Touch-friendly buttons
- [ ] Readable text sizes

---

## NON-FUNCTIONAL REQUIREMENTS (NFR)

### NFR-001: Performance
- [ ] Page load < 2 seconds
- [ ] Form submit < 5 seconds
- [ ] Email delivery < 5 seconds
- [ ] Smooth animations

### NFR-002: Reliability
- [ ] 99%+ uptime
- [ ] Error recovery
- [ ] Fallback behaviors
- [ ] Graceful degradation

### NFR-003: Security
- [ ] HTTPS on GitHub Pages
- [ ] No sensitive data in frontend
- [ ] No API keys exposed
- [ ] Input sanitization
- [ ] CORS handling

### NFR-004: Cost
- [ ] $0 monthly cost
- [ ] Google free tier only
- [ ] No premium services
- [ ] No paid dependencies

### NFR-005: Maintenance
- [ ] Easy to update
- [ ] Clear documentation
- [ ] SDD methodology
- [ ] Git history clean

### NFR-006: Scalability
- [ ] Handle 1000+ submissions/month
- [ ] No data limits
- [ ] Extensible architecture
- [ ] Ready for future features

---

## ACCEPTANCE CRITERIA

### A-001: Form Submission
**GIVEN:** User completes all required fields  
**WHEN:** User clicks "Enviar Cotización"  
**THEN:** Data saved to Google Sheets AND email sent AND confirmation shown

### A-002: Price Calculation
**GIVEN:** User selects type + sections + features  
**WHEN:** Selection changes  
**THEN:** Total price updates in real-time

### A-003: Email Delivery
**GIVEN:** Form submitted successfully  
**WHEN:** Email trigger fires  
**THEN:** Email arrives at osvojag@gmail.com within 5 seconds

### A-004: Data Persistence
**GIVEN:** User submits form  
**WHEN:** Email sent  
**THEN:** All data exists in Google Sheets row

---

**Related:** PROJECT_CONSTITUTION.md, MOD-02, PLAN-002
