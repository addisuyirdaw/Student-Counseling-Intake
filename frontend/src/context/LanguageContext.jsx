import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation & Header
    nav_title: 'Student Counseling Intake',
    nav_subtitle: 'University Mental Health & Academic Support',
    nav_intake_form: 'Intake Form',
    nav_advisor_portal: 'Advisor Portal',
    nav_lang_toggle: 'አማርኛ',
    nav_lang_label: 'Language',

    // Support Info Panel
    panel_title: 'Student Counseling & Psychological Services',
    panel_subtitle: 'Compassionate, confidential academic & mental wellness care.',
    panel_confidential_badge: '100% Confidential & FERPA Compliant',
    panel_crisis_label: 'Immediate Crisis Hotline:',
    panel_crisis_hotline: '555-0199',
    panel_crisis_lifeline: 'Lifeline: 988',
    panel_tab_how_it_works: 'How It Works',
    panel_tab_faqs: 'Quick FAQs',
    panel_step1_title: 'Submit Intake',
    panel_step1_desc: 'Share your background, concerns, and meeting availability.',
    panel_step2_title: 'Advisor Review',
    panel_step2_desc: 'An authorized counselor reviews your case within 24–48 hours.',
    panel_step3_title: '1-on-1 Session',
    panel_step3_desc: 'Meet in-person or online for confidential, personalized support.',
    panel_faq1_q: 'Is this service free of charge?',
    panel_faq1_a: 'Yes, 100% free. Covered by university student health fees with zero co-pays or hidden fees.',
    panel_faq2_q: 'Who has access to my responses?',
    panel_faq2_a: 'Only licensed university counseling staff under FERPA/HIPAA. Never shared with parents or professors.',
    panel_faq3_q: 'How long are counseling sessions?',
    panel_faq3_a: 'Initial intake sessions last 45–50 minutes. Frequency is tailored around your class schedule.',

    // Steps
    step1_name: 'Student Info',
    step2_name: 'Context & Triage',
    step3_name: 'Availability',
    step4_name: 'Consent & Sign',
    step_indicator: 'Step {current} of 4: {title}',

    // Navigation buttons
    btn_back: 'Back',
    btn_continue: 'Continue',
    btn_submit: 'Submit Counseling Request',
    btn_submitting: 'Submitting...',

    // Step 1: Student Academic & Contact Details
    s1_title: 'Student Academic & Contact Details',
    s1_subtitle: 'Please provide your official university contact information.',
    s1_first_name: 'First Name *',
    s1_first_name_ph: 'e.g. Alex',
    s1_last_name: 'Last Name *',
    s1_last_name_ph: 'e.g. Rivera',
    s1_email: 'University Email *',
    s1_email_ph: 'student@university.edu',
    s1_phone: 'Phone Number *',
    s1_phone_ph: '(555) 000-0000',
    s1_student_id: 'Student ID *',
    s1_student_id_ph: 'e.g. 20240001',
    s1_gpa: 'Cumulative GPA (Optional)',
    s1_gpa_ph: 'e.g. 3.75',
    s1_department: 'Department / Program *',
    s1_department_select: 'Select Department',
    s1_dept_freshman: 'Freshman / Remedial',
    s1_dept_social: 'Social Sciences',
    s1_dept_natural: 'Natural Sciences',
    s1_dept_cs: 'Computer Science (CS)',
    s1_dept_se: 'Software Engineering (SE)',
    s1_dept_engineering: 'Engineering (Other)',
    s1_dept_other: 'Other (Specify Custom Department)',
    s1_custom_dept: 'Specify Custom Department / Major *',
    s1_custom_dept_ph: 'e.g. Biomedical Engineering, Architecture',
    s1_year: 'Year in School *',
    s1_year_select: 'Select Academic Year',
    s1_year_1: '1st Year',
    s1_year_2: '2nd Year',
    s1_year_3: '3rd Year',
    s1_year_4: '4th Year',
    s1_year_5: '5th Year',
    s1_year_other: 'Other (Specify Custom Year)',
    s1_custom_year: 'Specify Custom Academic Year *',
    s1_custom_year_ph: "e.g. Master's 1st Year, PhD Candidate",

    // Step 2: Context & Triage
    s2_title: 'Counseling Context & Triage',
    s2_subtitle: 'Help us understand your current challenges and urgency level.',
    s2_topic: 'Primary Counseling Topic *',
    s2_topic_select: 'Select a Topic',
    s2_topic_anxiety: 'Anxiety',
    s2_topic_depression: 'Depression',
    s2_topic_academic_pressure: 'Academic Pressure',
    s2_topic_relationship: 'Relationship Issues',
    s2_topic_career: 'Career Guidance',
    s2_topic_stress: 'Stress Management',
    s2_topic_grief: 'Grief/Loss',
    s2_topic_self_esteem: 'Self-Esteem',
    s2_topic_substance: 'Substance Abuse',
    s2_topic_sleep: 'Sleep Issues',
    s2_topic_family: 'Family Problems',
    s2_topic_other: 'Other',
    s2_custom_topic: 'Please Specify Your Topic *',
    s2_custom_topic_ph: 'Briefly describe your topic',
    s2_concern_desc: 'Reason for Request / Concern Description *',
    s2_concern_ph: 'Share what you are experiencing and what support would be most helpful...',
    s2_urgency_label: 'Urgency / Triage Level *',
    s2_urgency_low_title: 'Low Urgency',
    s2_urgency_low_desc: 'Routine guidance, study habits, general planning',
    s2_urgency_med_title: 'Medium Urgency',
    s2_urgency_med_desc: 'Noticeable stress, academic challenges, anxiety',
    s2_urgency_high_title: 'High Urgency',
    s2_urgency_high_desc: 'Acute distress, impending crisis, urgent priority',
    s2_previous_check: 'Have you had previous counseling or therapy?',
    s2_previous_details: 'Previous Counseling Background',
    s2_previous_details_ph: 'Tell us briefly about past experiences or what approaches helped you...',

    // Step 3: Availability
    s3_title: 'Availability & Meeting Preferences',
    s3_subtitle: 'Select all days and time slots that work best with your weekly class schedule.',
    s3_days_label: 'Preferred Meeting Days * (Select at least one)',
    s3_day_mon: 'Monday',
    s3_day_tue: 'Tuesday',
    s3_day_wed: 'Wednesday',
    s3_day_thu: 'Thursday',
    s3_day_fri: 'Friday',
    s3_slots_label: 'Preferred Time Slots * (Select at least one)',
    s3_slot_morning: 'Morning',
    s3_slot_afternoon: 'Afternoon',
    s3_slot_evening: 'Evening',
    s3_comments: 'Additional Notes or Special Accommodations (Optional)',
    s3_comments_ph: 'e.g. Prefer meeting via Zoom, wheelchair accessible room required, exam conflicts on Thursdays...',

    // Step 4: Consent & Sign
    s4_title: 'Consent & Electronic Signature',
    s4_subtitle: 'Please review the confidentiality terms and draw your signature below.',
    s4_agreement_title: 'Confidentiality & Care Agreement',
    s4_agreement_text: 'By submitting this intake form, I understand that all information provided is strictly confidential and protected in accordance with FERPA and university privacy standards. I understand this form is not a substitute for emergency medical services and that my responses will only be accessed by authorized counseling professionals. I consent to the collection and processing of my details for academic and wellness counseling.',
    s4_consent_check: 'I have read, understood, and agree to the terms above *',
    s4_signature_label: 'Electronic Signature *',
    s4_signature_ph: 'Sign here using your mouse, trackpad, or finger',
    s4_signature_note: 'Your digital signature validates this intake submission.',
    s4_signature_clear: 'Clear',

    // Success State
    success_received_title: 'Intake Request Received',
    success_thank_you: 'Thank you, {name}. Your intake form has been securely logged with our counseling and student affairs department.',
    success_lbl_student: 'Student:',
    success_lbl_dept: 'Department:',
    success_lbl_year: 'Year:',
    success_lbl_topic: 'Topic:',
    success_lbl_triage: 'Triage Level:',
    success_lbl_case_id: 'Case ID:',
    success_next_title: 'What Happens Next:',
    success_next_desc: 'An academic counseling specialist will review your intake and contact your university email ({email}) within 24 to 48 business hours to confirm your scheduled appointment time.',
    success_btn_another: 'Submit Another Request',

    // Standalone Success Page
    page_success_title: 'Request Submitted!',
    page_success_desc: 'Your counseling intake request has been successfully submitted.',
    page_success_req_id: 'Request ID:',
    page_success_review_note: 'A counselor will review your request within 24-48 hours.',
    page_success_back: 'Back to Form',

    // Validation Errors
    val_first_name: 'First name is required',
    val_last_name: 'Last name is required',
    val_email: 'Please enter a valid university email',
    val_phone: 'Please enter a valid phone number',
    val_student_id: 'Student ID is required',
    val_dept: 'Please select your department or program',
    val_dept_custom: 'Please specify your department',
    val_year: 'Please select your academic year',
    val_year_custom: 'Please specify your year in school',
    val_topic: 'Please select a primary counseling topic',
    val_topic_custom: 'Please specify your counseling topic',
    val_concern: 'Please provide a brief description of your concern (at least 5 characters)',
    val_days: 'Please select at least one preferred meeting day',
    val_slots: 'Please select at least one preferred time slot',
    val_consent: 'You must agree to the confidentiality and care terms',
    val_signature: 'Please provide your digital signature',
  },

  am: {
    // Navigation & Header
    nav_title: 'የተማሪዎች የምክር አገልግሎት ቅበላ',
    nav_subtitle: 'የዩኒቨርሲቲ የአእምሮ ጤና እና የአካዳሚክ ድጋፍ ማዕከል',
    nav_intake_form: 'የቅበላ ቅጽ',
    nav_advisor_portal: 'የአማካሪ ፖርታል',
    nav_lang_toggle: 'English',
    nav_lang_label: 'ቋንቋ',

    // Support Info Panel
    panel_title: 'የተማሪዎች የምክር እና ስነ-ልቦና አገልግሎት',
    panel_subtitle: 'አዛኝ፣ ሚስጥራዊ የአካዳሚክ እና የአእምሮ ጤንነት ክብካቤ።',
    panel_confidential_badge: '100% ሚስጥራዊ እና በህግ የተጠበቀ',
    panel_crisis_label: 'አስቸኳይ የእርዳታ መስመር:',
    panel_crisis_hotline: '555-0199',
    panel_crisis_lifeline: 'ነፃ መስመር: 988',
    panel_tab_how_it_works: 'እንዴት ይሰራል?',
    panel_tab_faqs: 'ተደጋጋሚ ጥያቄዎች',
    panel_step1_title: 'ቅጹን ያስገቡ',
    panel_step1_desc: 'የትምህርት መረጃዎን፣ የሚያሳስብዎትን ጉዳይ እና አመቺ ጊዜዎን ያጋሩ።',
    panel_step2_title: 'የአማካሪ ግምገማ',
    panel_step2_desc: 'ፈቃድ ያለው ባለሙያ አማካሪ ጉዳይዎን በ24–48 ሰዓታት ውስጥ ይመረምራል።',
    panel_step3_title: 'የ1-ለ-1 ምክር ክፍለ-ጊዜ',
    panel_step3_desc: 'በአካል ወይም በበይነመረብ በሚስጥር ለግል ድጋፍ ይገናኙ።',
    panel_faq1_q: 'ይህ አገልግሎት ክፍያ አለው?',
    panel_faq1_a: 'አይደለም፣ 100% ነፃ ነው። በተማሪዎች የጤና አገልግሎት ወጪ ሙሉ በሙሉ የተሸፈነ ሲሆን ምንም ዓይነት ተጨማሪ ክፍያ የለውም።',
    panel_faq2_q: 'መረጃዎቼን ማን ሊመለከት ይችላል?',
    panel_faq2_a: 'ፈቃድ ያላቸው የዩኒቨርሲቲው አማካሪ ባለሙያዎች ብቻ ናቸው። ለወላጆች ወይም ለአስተማሪዎች በጭራሽ አይገለጽም።',
    panel_faq3_q: 'የምክር ክፍለ-ጊዜው ምን ያህል ደቂቃ ይወስዳል?',
    panel_faq3_a: 'የመጀመሪያው የቅበላ ክፍለ-ጊዜ ከ45–50 ደቂቃዎች ይቆያል። ተከታታይ ቀጠሮዎች ከክፍል ሰዓትዎ ጋር ተጣጥመው ይዘጋጃሉ።',

    // Steps
    step1_name: 'የተማሪ መረጃ',
    step2_name: 'ሁኔታ እና ቅድሚያ',
    step3_name: 'አመቺ ጊዜ',
    step4_name: 'ስምምነት እና ፊርማ',
    step_indicator: 'ደረጃ {current} ከ 4: {title}',

    // Navigation buttons
    btn_back: 'ተመለስ',
    btn_continue: 'ቀጥል',
    btn_submit: 'የምክር አገልግሎት ጥያቄውን አስገባ',
    btn_submitting: 'በማስገባት ላይ...',

    // Step 1: Student Academic & Contact Details
    s1_title: 'የተማሪው የትምህርት እና የመገናኛ ዝርዝር መረጃ',
    s1_subtitle: 'እባክዎ ትክክለኛውን የዩኒቨርሲቲ መገናኛ መረጃዎን ያስገቡ።',
    s1_first_name: 'የመጀመሪያ ስም *',
    s1_first_name_ph: 'ምሳሌ፡ አበበ',
    s1_last_name: 'የአባት ስም *',
    s1_last_name_ph: 'ምሳሌ፡ ከበደ',
    s1_email: 'የዩኒቨርሲቲ ኢሜይል *',
    s1_email_ph: 'student@university.edu',
    s1_phone: 'ስልክ ቁጥር *',
    s1_phone_ph: '0911000000',
    s1_student_id: 'የተማሪ መታወቂያ (ID) *',
    s1_student_id_ph: 'ምሳሌ፡ 20240001 ወይም ETS0001/14',
    s1_gpa: 'አጠቃላይ የውጤት ነጥብ / GPA (አማራጭ)',
    s1_gpa_ph: 'ምሳሌ፡ 3.75',
    s1_department: 'የትምህርት ክፍል / ፕሮግራም *',
    s1_department_select: 'የትምህርት ክፍል ይምረጡ',
    s1_dept_freshman: 'የመጀመሪያ ዓመት / ሬሜዲያል (Freshman / Remedial)',
    s1_dept_social: 'ማህበራዊ ሳይንስ (Social Sciences)',
    s1_dept_natural: 'የተፈጥሮ ሳይንስ (Natural Sciences)',
    s1_dept_cs: 'ኮምፒውተር ሳይንስ (CS)',
    s1_dept_se: 'ሶፍትዌር ምህንድስና (SE)',
    s1_dept_engineering: 'ምህንድስና - ሌሎች (Engineering)',
    s1_dept_other: 'ሌላ (ብጁ የትምህርት ክፍል ይግለጹ)',
    s1_custom_dept: 'ብጁ የትምህርት ክፍል / ሙያ ይግለጹ *',
    s1_custom_dept_ph: 'ምሳሌ፡ ባዮሜዲካል ምህንድስና፣ አርክቴክቸር',
    s1_year: 'የትምህርት ዓመት *',
    s1_year_select: 'የትምህርት ዓመት ይምረጡ',
    s1_year_1: '1ኛ ዓመት',
    s1_year_2: '2ኛ ዓመት',
    s1_year_3: '3ኛ ዓመት',
    s1_year_4: '4ኛ ዓመት',
    s1_year_5: '5ኛ ዓመት',
    s1_year_other: 'ሌላ (ብጁ የትምህርት ዓመት ይግለጹ)',
    s1_custom_year: 'ብጁ የትምህርት ዓመት ይግለጹ *',
    s1_custom_year_ph: 'ምሳሌ፡ የማስተርስ 1ኛ ዓመት፣ የዶክትሬት እጩ',

    // Step 2: Context & Triage
    s2_title: 'የምክር ሁኔታ እና የቅድሚያ ደረጃ',
    s2_subtitle: 'ያጋጠመዎትን ፈተና እና የጉዳዩን አስቸኳይነት ደረጃ እንድንረዳ ያግዙን።',
    s2_topic: 'ዋናው የምክር ርዕስ *',
    s2_topic_select: 'ርዕስ ይምረጡ',
    s2_topic_anxiety: 'ጭንቀት (Anxiety)',
    s2_topic_depression: 'ድብርት (Depression)',
    s2_topic_academic_pressure: 'የትምህርት ጫና (Academic Pressure)',
    s2_topic_relationship: 'የግንኙነት ችግሮች (Relationship Issues)',
    s2_topic_career: 'የስራና ሙያ ምክር (Career Guidance)',
    s2_topic_stress: 'ውጥረትን መቆጣጠር (Stress Management)',
    s2_topic_grief: 'ሀዘን / የሰው ማጣት (Grief/Loss)',
    s2_topic_self_esteem: 'የራስ መተማመን (Self-Esteem)',
    s2_topic_substance: 'የሱስ ችግር (Substance Abuse)',
    s2_topic_sleep: 'የእንቅልፍ እክል (Sleep Issues)',
    s2_topic_family: 'የቤተሰብ ችግሮች (Family Problems)',
    s2_topic_other: 'ሌላ (Other)',
    s2_custom_topic: 'እባክዎ ርዕስዎን ይግለጹ *',
    s2_custom_topic_ph: 'ርዕስዎን በአጭሩ ይግለጹ',
    s2_concern_desc: 'የጥያቄው ምክንያት / የሚያሳስብዎት ጉዳይ ዝርዝር *',
    s2_concern_ph: 'የሚያጋጥምዎትን ስሜት ወይም ሁኔታ እና ምን ዓይነት ድጋፍ እንደሚፈልጉ ያጋሩ...',
    s2_urgency_label: 'የአስቸኳይነት / የቅድሚያ ደረጃ *',
    s2_urgency_low_title: 'ዝቅተኛ አጣዳፊነት',
    s2_urgency_low_desc: 'መደበኛ መመሪያ፣ የጥናት ልምዶች፣ አጠቃላይ እቅድ',
    s2_urgency_med_title: 'መካከለኛ አጣዳፊነት',
    s2_urgency_med_desc: 'የሚታይ ውጥረት፣ የትምህርት ፈተናዎች፣ ስጋት',
    s2_urgency_high_title: 'ከፍተኛ አጣዳፊነት',
    s2_urgency_high_desc: 'ከፍተኛ ጭንቀት፣ ቀውስ፣ አፋጣኝ ቅድሚያ የሚሰጠው',
    s2_previous_check: 'ከዚህ በፊት የምክር አገልግሎት ወይም የስነ-ልቦና ህክምና አግኝተዋል?',
    s2_previous_details: 'ያለፈው የምክር አገልግሎት ታሪክ',
    s2_previous_details_ph: 'ስላለፈው ተሞክሮዎ ወይም የትኞቹ ዘዴዎች እንደረዱዎት በአጭሩ ይንገሩን...',

    // Step 3: Availability
    s3_title: 'አመቺ ጊዜ እና የስብሰባ ምርጫዎች',
    s3_subtitle: 'ከሳምንታዊ የትምህርት መርሃ-ግብርዎ ጋር የሚስማሙትን ቀናት እና ሰዓቶች ይምረጡ።',
    s3_days_label: 'ተመራጭ የስብሰባ ቀናት * (ቢያንስ አንዱን ይምረጡ)',
    s3_day_mon: 'ሰኞ',
    s3_day_tue: 'ማክሰኞ',
    s3_day_wed: 'ረቡዕ',
    s3_day_thu: 'ሐሙስ',
    s3_day_fri: 'አርብ',
    s3_slots_label: 'ተመራጭ የሰዓት ክፍተቶች * (ቢያንስ አንዱን ይምረጡ)',
    s3_slot_morning: 'ጥዋት',
    s3_slot_afternoon: 'ከሰዓት',
    s3_slot_evening: 'ማታ',
    s3_comments: 'ተጨማሪ ማስታወሻዎች ወይም ልዩ ፍላጎቶች (አማራጭ)',
    s3_comments_ph: 'ምሳሌ፡ በዙም (Zoom) መገናኘት እመርጣለሁ፣ ምቹ የመሰብሰቢያ ክፍል፣ ሐሙስ የፈተና ጊዜ አለብኝ...',

    // Step 4: Consent & Sign
    s4_title: 'ስምምነት እና ዲጂታል ፊርማ',
    s4_subtitle: 'እባክዎ የምስጢራዊነት ደንቦቹን ያንብቡ እና ከታች ይፈርሙ።',
    s4_agreement_title: 'የምስጢራዊነት እና የክብካቤ ስምምነት',
    s4_agreement_text: 'ይህንን የቅበላ ቅጽ በማስገባት፣ የተሰጠው መረጃ በሙሉ በሚስጥር የተያዘ እና በዩኒቨርሲቲው የግላዊነት ደንቦች መሰረት የተጠበቀ መሆኑን ተረድቻለሁ። ይህ ቅጽ የአደጋ ጊዜ የህክምና አገልግሎት ምትክ እንዳልሆነ እና ምላሾቼ በተፈቀደላቸው አማካሪዎች ብቻ እንደሚታዩ እገነዘባለሁ። ለአካዳሚክ እና ለአእምሮ ደህንነት ምክር መረጃዬ እንዲሰበሰብና እንዲሰራበት እስማማለሁ።',
    s4_consent_check: 'ከላይ የተጠቀሱትን ውሎች አንብቤያለሁ፣ ተረድቻለሁ እና ተስማምቻለሁ *',
    s4_signature_label: 'ዲጂታል ፊርማ *',
    s4_signature_ph: 'በማውዝ፣ በትራክፓድ ወይም በጣትዎ እዚህ ይፈርሙ',
    s4_signature_note: 'የዲጂታል ፊርማዎ የዚህን የቅበላ ቅጽ ትክክለኛነት ያረጋግጣል።',
    s4_signature_clear: 'አጥፋ',

    // Success State
    success_received_title: 'የቅበላ ጥያቄዎ ደርሷል',
    success_thank_you: 'እናመሰግናለን {name}። የቅበላ ቅጽዎ ወደ ምክር እና ተማሪዎች ጉዳይ ክፍላችን በደህንነት ተልኳል።',
    success_lbl_student: 'ተማሪ:',
    success_lbl_dept: 'የትምህርት ክፍል:',
    success_lbl_year: 'ዓመት:',
    success_lbl_topic: 'ርዕስ:',
    success_lbl_triage: 'የቅድሚያ ደረጃ:',
    success_lbl_case_id: 'የጉዳይ መለያ (Case ID):',
    success_next_title: 'ቀጣይ እርምጃ:',
    success_next_desc: 'የአካዳሚክ ምክር ባለሙያ ቅጽዎን በመገምገም የቀጠሮ ሰዓትዎን ለማረጋገጥ በ24 እስከ 48 የስራ ሰዓታት ውስጥ በዩኒቨርሲቲ ኢሜይልዎ ({email}) ያነጋግርዎታል።',
    success_btn_another: 'ሌላ ጥያቄ ያስገቡ',

    // Standalone Success Page
    page_success_title: 'ጥያቄዎ ተልኳል!',
    page_success_desc: 'የምክር አገልግሎት ቅበላ ጥያቄዎ በተሳካ ሁኔታ ገብቷል።',
    page_success_req_id: 'የጥያቄ መለያ ቁጥር:',
    page_success_review_note: 'አማካሪ ጥያቄዎን በ24-48 ሰዓታት ውስጥ ይገመግማል።',
    page_success_back: 'ወደ ቅጹ ተመለስ',

    // Validation Errors
    val_first_name: 'የመጀመሪያ ስም ማስገባት ግዴታ ነው',
    val_last_name: 'የአባት ስም ማስገባት ግዴታ ነው',
    val_email: 'እባክዎ ትክክለኛ የዩኒቨርሲቲ ኢሜይል ያስገቡ',
    val_phone: 'እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ (ቢያንስ 7 ዲጂት)',
    val_student_id: 'የተማሪ መታወቂያ (ID) ማስገባት ግዴታ ነው',
    val_dept: 'እባክዎ የትምህርት ክፍልዎን ወይም ፕሮግራምዎን ይምረጡ',
    val_dept_custom: 'እባክዎ የትምህርት ክፍልዎን ይግለጹ',
    val_year: 'እባክዎ የትምህርት ዓመትዎን ይምረጡ',
    val_year_custom: 'እባክዎ የትምህርት ዓመትዎን ይግለጹ',
    val_topic: 'እባክዎ ዋናውን የምክር ርዕስ ይምረጡ',
    val_topic_custom: 'እባክዎ የምክር ርዕስዎን ይግለጹ',
    val_concern: 'እባክዎ የሚያሳስብዎትን ጉዳይ አጭር መግለጫ ያስገቡ (ቢያንስ 5 ፊደላት)',
    val_days: 'እባክዎ ቢያንስ አንድ ተመራጭ የስብሰባ ቀን ይምረጡ',
    val_slots: 'እባክዎ ቢያንስ አንድ ተመራጭ የሰዓት ክፍተት ይምረጡ',
    val_consent: 'በምስጢራዊነት እና የክብካቤ ደንቦች መስማማት አለብዎት',
    val_signature: 'እባክዎ ዲጂታል ፊርማዎን ያስገቡ',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved === 'am' ? 'am' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations['en']?.[key] || key;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((p) => {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
