import { Student, Teacher, Subject, TuitionClass, Branch, AttendanceRecord, PaymentRecord, ExpenseRecord, ExamRecord, AppNotification } from '../types';

export const initialBranches: Branch[] = [
  {
    id: 'BR-01',
    name: 'Nugegoda Main Campus',
    sinhalaName: 'නුගේගොඩ ප්‍රධාන ශාඛාව',
    address: '142, හයිලෙවල් පාර, නුගේගොඩ',
    phone: '011-2824500',
    contactPerson: 'කළමනාකරු එම්. වික්‍රමසිංහ'
  },
  {
    id: 'BR-02',
    name: 'Gampaha Branch',
    sinhalaName: 'ගම්පහ ශාඛාව',
    address: '58, කොළඹ පාර, ගම්පහ',
    phone: '033-2234900',
    contactPerson: 'කළමනාකරු එස්. දිසානායක'
  },
  {
    id: 'BR-03',
    name: 'Kandy Branch',
    sinhalaName: 'මහනුවර ශාඛාව',
    address: '22, පෙරදෙණිය පාර, මහනුවර',
    phone: '081-2245800',
    contactPerson: 'කළමනාකරු ආර්. හේරත්'
  }
];

export const initialSubjects: Subject[] = [
  {
    id: 'SUB-01',
    name: 'Combined Mathematics',
    sinhalaName: 'සංයුක්ත ගණිතය',
    code: 'C.MATH',
    grade: 'A/L',
    stream: 'Physical Science',
    defaultFee: 3500
  },
  {
    id: 'SUB-02',
    name: 'Physics',
    sinhalaName: 'භෞතික විද්‍යාව',
    code: 'PHY',
    grade: 'A/L',
    stream: 'Science / Maths',
    defaultFee: 3500
  },
  {
    id: 'SUB-03',
    name: 'Chemistry',
    sinhalaName: 'රසායන විද්‍යාව',
    code: 'CHEM',
    grade: 'A/L',
    stream: 'Science / Maths',
    defaultFee: 3500
  },
  {
    id: 'SUB-04',
    name: 'Biology',
    sinhalaName: 'ජීව විද්‍යාව',
    code: 'BIO',
    grade: 'A/L',
    stream: 'Biological Science',
    defaultFee: 3500
  },
  {
    id: 'SUB-05',
    name: 'Information Technology (ICT)',
    sinhalaName: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය',
    code: 'ICT',
    grade: 'A/L & O/L',
    stream: 'Common',
    defaultFee: 3000
  },
  {
    id: 'SUB-06',
    name: 'O/L Mathematics',
    sinhalaName: 'සාමාන්‍ය පෙළ ගණිතය',
    code: 'OL-MATH',
    grade: 'Grade 10-11',
    stream: 'Ordinary Level',
    defaultFee: 2500
  },
  {
    id: 'SUB-07',
    name: 'O/L Science',
    sinhalaName: 'සාමාන්‍ය පෙළ විද්‍යාව',
    code: 'OL-SCI',
    grade: 'Grade 10-11',
    stream: 'Ordinary Level',
    defaultFee: 2500
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'TCH-001',
    name: 'Dr. Nimal Senarathne',
    sinhalaName: 'ආචාර්ය නිමල් සේනාරත්න',
    phone: '0771234567',
    email: 'nimal.maths@tuitionpro.lk',
    nic: '782341209V',
    qualifications: 'B.Sc (Hons), Ph.D. (Mathematics), Colombo',
    subjectIds: ['SUB-01'],
    classIds: ['CLS-01', 'CLS-02'],
    salaryType: 'percentage',
    salaryRate: 80, // 80% of student fee
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    bankDetails: {
      bank: 'BOC - Bank of Ceylon',
      branch: 'Nugegoda',
      accountNumber: '839201948',
      accountName: 'N. S. Senarathne'
    },
    joinedDate: '2022-01-10'
  },
  {
    id: 'TCH-002',
    name: 'Eng. Supun Fernando',
    sinhalaName: 'ඉංජිනේරු සුපුන් ප්‍රනාන්දු',
    phone: '0719876543',
    email: 'supun.physics@tuitionpro.lk',
    nic: '851239871V',
    qualifications: 'B.Sc. Eng (Hons) University of Moratuwa',
    subjectIds: ['SUB-02'],
    classIds: ['CLS-03'],
    salaryType: 'percentage',
    salaryRate: 75,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    bankDetails: {
      bank: 'Commercial Bank',
      branch: 'Gampaha',
      accountNumber: '1092837461',
      accountName: 'K. S. Fernando'
    },
    joinedDate: '2022-03-15'
  },
  {
    id: 'TCH-003',
    name: 'Ranga Jayawardena',
    sinhalaName: 'රංග ජයවර්ධන ගුරුතුමා',
    phone: '0765544332',
    email: 'ranga.chem@tuitionpro.lk',
    nic: '883451290V',
    qualifications: 'B.Sc. (Chem Special), University of Kelaniya',
    subjectIds: ['SUB-03'],
    classIds: ['CLS-04'],
    salaryType: 'percentage',
    salaryRate: 80,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    bankDetails: {
      bank: 'Sampath Bank',
      branch: 'Kandy',
      accountNumber: '0019283746',
      accountName: 'R. Jayawardena'
    },
    joinedDate: '2023-01-05'
  },
  {
    id: 'TCH-004',
    name: 'Samanthi Gunaratne',
    sinhalaName: 'සමන්ති ගුණරත්න ගුරුතුමිය',
    phone: '0702233445',
    email: 'samanthi.ol@tuitionpro.lk',
    nic: '906781234V',
    qualifications: 'B.Sc. (Natural Science), NIE Dip in Education',
    subjectIds: ['SUB-06', 'SUB-07'],
    classIds: ['CLS-05'],
    salaryType: 'fixed_per_student',
    salaryRate: 2000,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    bankDetails: {
      bank: 'People\'s Bank',
      branch: 'Nugegoda City',
      accountNumber: '2048593821',
      accountName: 'S. Gunaratne'
    },
    joinedDate: '2023-06-01'
  }
];

export const initialClasses: TuitionClass[] = [
  {
    id: 'CLS-01',
    name: '2026 A/L සංයුක්ත ගණිතය (Theory)',
    subjectId: 'SUB-01',
    teacherId: 'TCH-001',
    grade: 'Grade 12 - 2026 A/L',
    dayOfWeek: 'Sunday',
    startTime: '08:00',
    endTime: '12:30',
    hallNumber: 'ශාලාව 01 (මහල් 1)',
    monthlyFee: 3500,
    branchId: 'BR-01',
    status: 'active'
  },
  {
    id: 'CLS-02',
    name: '2025 A/L සංයුක්ත ගණිතය (Revision & Paper)',
    subjectId: 'SUB-01',
    teacherId: 'TCH-001',
    grade: 'Grade 13 - 2025 A/L',
    dayOfWeek: 'Saturday',
    startTime: '08:00',
    endTime: '13:00',
    hallNumber: 'ශාලාව 01 (මහල් 1)',
    monthlyFee: 3800,
    branchId: 'BR-01',
    status: 'active'
  },
  {
    id: 'CLS-03',
    name: '2026 A/L භෞතික විද්‍යාව (Theory)',
    subjectId: 'SUB-02',
    teacherId: 'TCH-002',
    grade: 'Grade 12 - 2026 A/L',
    dayOfWeek: 'Sunday',
    startTime: '13:30',
    endTime: '17:30',
    hallNumber: 'ශාලාව 02 (මහල් 2)',
    monthlyFee: 3500,
    branchId: 'BR-01',
    status: 'active'
  },
  {
    id: 'CLS-04',
    name: '2026 A/L රසායන විද්‍යාව (Theory)',
    subjectId: 'SUB-03',
    teacherId: 'TCH-003',
    grade: 'Grade 12 - 2026 A/L',
    dayOfWeek: 'Monday',
    startTime: '15:30',
    endTime: '19:00',
    hallNumber: 'ශාලාව 03 (විද්‍යාගාරය)',
    monthlyFee: 3500,
    branchId: 'BR-02',
    status: 'active'
  },
  {
    id: 'CLS-05',
    name: 'Grade 11 සාමාන්‍ය පෙළ ගණිතය & විද්‍යාව',
    subjectId: 'SUB-06',
    teacherId: 'TCH-004',
    grade: 'Grade 11 - O/L',
    dayOfWeek: 'Tuesday',
    startTime: '15:30',
    endTime: '18:30',
    hallNumber: 'ශාලාව 04',
    monthlyFee: 3000,
    branchId: 'BR-01',
    status: 'active'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'Kasun Perera',
    sinhalaName: 'කසුන් පෙරේරා',
    gender: 'male',
    phone: '0711122334',
    whatsapp: '0711122334',
    email: 'kasun.p@gmail.com',
    address: 'නො. 45, විජේරාම පාර, නුගේගොඩ',
    school: 'ආනන්ද විද්‍යාලය, කොළඹ',
    grade: 'Grade 12 - 2026 A/L',
    stream: 'Physical Science',
    parentName: 'සුනිල් පෙරේරා (පියා)',
    parentPhone: '0773344556',
    enrolledClassIds: ['CLS-01', 'CLS-03'],
    enrollmentDate: '2025-01-10',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    qrCode: 'TP-STU-001',
    barcode: '98401001',
    hasFreeCard: false,
    discountPercent: 0,
    notes: 'විශිෂ්ට සාමාර්ථ අපේක්ෂා කරන දක්ෂ ශිෂ්‍යයෙකි.',
    createdAt: '2025-01-10T08:30:00Z',
    updatedAt: '2025-01-10T08:30:00Z'
  },
  {
    id: 'STU-002',
    name: 'Nipun De Silva',
    sinhalaName: 'නිපුන් ද සිල්වා',
    gender: 'male',
    phone: '0772233445',
    whatsapp: '0772233445',
    email: 'nipun.silva@gmail.com',
    address: '12/A, ගාලු පාර, මොරටුව',
    school: 'නාලන්දා විද්‍යාලය, කොළඹ',
    grade: 'Grade 12 - 2026 A/L',
    stream: 'Physical Science',
    parentName: 'චමින්ද ද සිල්වා (පියා)',
    parentPhone: '0718899001',
    enrolledClassIds: ['CLS-01', 'CLS-03', 'CLS-04'],
    enrollmentDate: '2025-01-12',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    qrCode: 'TP-STU-002',
    barcode: '98401002',
    hasFreeCard: false,
    discountPercent: 10,
    notes: 'විෂයයන් 3ක් හැදෑරීම වෙනුවෙන් 10% වට්ටමක් ලබාදී ඇත.',
    createdAt: '2025-01-12T09:15:00Z',
    updatedAt: '2025-01-12T09:15:00Z'
  },
  {
    id: 'STU-003',
    name: 'Sachini Fernando',
    sinhalaName: 'සචිනි ප්‍රනාන්දු',
    gender: 'female',
    phone: '0783344556',
    whatsapp: '0783344556',
    email: 'sachini.f@gmail.com',
    address: '89, පන්සල පාර, මහරගම',
    school: 'විශාකා විද්‍යාලය, කොළඹ',
    grade: 'Grade 12 - 2026 A/L',
    stream: 'Physical Science',
    parentName: 'කුමාරි ප්‍රනාන්දු (මව)',
    parentPhone: '0775566778',
    enrolledClassIds: ['CLS-01', 'CLS-04'],
    enrollmentDate: '2025-01-15',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    qrCode: 'TP-STU-003',
    barcode: '98401003',
    hasFreeCard: false,
    discountPercent: 0,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'STU-004',
    name: 'Dinesh Wickramasinghe',
    sinhalaName: 'දිනේෂ් වික්‍රමසිංහ',
    gender: 'male',
    phone: '0754455667',
    whatsapp: '0754455667',
    address: '15/2, ස්ටේෂන් පාර, කෝට්ටේ',
    school: 'රාජකීය විද්‍යාලය, කොළඹ',
    grade: 'Grade 13 - 2025 A/L',
    stream: 'Physical Science',
    parentName: 'ධම්මික වික්‍රමසිංහ (පියා)',
    parentPhone: '0714455667',
    enrolledClassIds: ['CLS-02'],
    enrollmentDate: '2024-02-01',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    qrCode: 'TP-STU-004',
    barcode: '98401004',
    hasFreeCard: true, // Scholarship free card
    notes: 'ශිෂ්‍යත්ව හිමි සිසුවෙකි - නොමිලේ කාඩ්පතක් (Free Card) හිමිය.',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z'
  },
  {
    id: 'STU-005',
    name: 'Thilini Wijekoon',
    sinhalaName: 'තිලිණි විජේකෝන්',
    gender: 'female',
    phone: '0701122339',
    whatsapp: '0701122339',
    address: '74, මල් පාර, පිළියන්දල',
    school: 'සිරිමාවෝ බණ්ඩාරනායක විද්‍යාලය',
    grade: 'Grade 11 - O/L',
    stream: 'Ordinary Level',
    parentName: 'මාලිනී විජේකෝන් (මව)',
    parentPhone: '0779988776',
    enrolledClassIds: ['CLS-05'],
    enrollmentDate: '2025-01-20',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    status: 'active',
    qrCode: 'TP-STU-005',
    barcode: '98401005',
    hasFreeCard: false,
    discountPercent: 0,
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  },
  {
    id: 'STU-006',
    name: 'Malith Bandara',
    sinhalaName: 'මලිත් බණ්ඩාර',
    gender: 'male',
    phone: '0767788990',
    address: '23, පන්විල පාර, කඩවත',
    school: 'ධර්මාලෝක විද්‍යාලය, කැලණිය',
    grade: 'Grade 12 - 2026 A/L',
    stream: 'Physical Science',
    parentName: 'ජගත් බණ්ඩාර (පියා)',
    parentPhone: '0712233441',
    enrolledClassIds: ['CLS-01', 'CLS-04'],
    enrollmentDate: '2025-02-01',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    status: 'inactive', // Inactive test
    qrCode: 'TP-STU-006',
    barcode: '98401006',
    hasFreeCard: false,
    discountPercent: 0,
    notes: 'පදිංචිය මාරු කිරීම නිසා තාවකාලිකව පන්ති නැවැත්වීය.',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-15T12:00:00Z'
  }
];

// Today's date string YYYY-MM-DD
const todayStr = new Date().toISOString().split('T')[0];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'ATT-101',
    studentId: 'STU-001',
    classId: 'CLS-01',
    date: todayStr,
    time: '07:52:14',
    status: 'present',
    method: 'qr_scanner',
    markedBy: 'Gate Scanner 01'
  },
  {
    id: 'ATT-102',
    studentId: 'STU-002',
    classId: 'CLS-01',
    date: todayStr,
    time: '07:58:45',
    status: 'present',
    method: 'qr_scanner',
    markedBy: 'Gate Scanner 01'
  },
  {
    id: 'ATT-103',
    studentId: 'STU-003',
    classId: 'CLS-01',
    date: todayStr,
    time: '08:12:30',
    status: 'late',
    method: 'qr_scanner',
    markedBy: 'Gate Scanner 01',
    notes: 'මිනිත්තු 12ක් ප්‍රමාද විය'
  },
  {
    id: 'ATT-104',
    studentId: 'STU-004',
    classId: 'CLS-02',
    date: todayStr,
    time: '07:45:00',
    status: 'present',
    method: 'manual',
    markedBy: 'ගුරු සහයක'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'PAY-001',
    receiptNumber: 'REC-2026-0001',
    studentId: 'STU-001',
    classId: 'CLS-01',
    month: '2026-03',
    feeAmount: 3500,
    discount: 0,
    paidAmount: 3500,
    dueAmount: 0,
    paymentDate: '2026-03-01 09:30',
    paymentMethod: 'cash',
    status: 'paid',
    cashierName: 'කැෂියර් 01 (සරත්)',
    notes: 'මාර්තු මස පන්ති ගාස්තු සම්පූර්ණයෙන් ගෙවා ඇත.'
  },
  {
    id: 'PAY-002',
    receiptNumber: 'REC-2026-0002',
    studentId: 'STU-001',
    classId: 'CLS-03',
    month: '2026-03',
    feeAmount: 3500,
    discount: 0,
    paidAmount: 3500,
    dueAmount: 0,
    paymentDate: '2026-03-01 09:32',
    paymentMethod: 'cash',
    status: 'paid',
    cashierName: 'කැෂියර් 01 (සරත්)'
  },
  {
    id: 'PAY-003',
    receiptNumber: 'REC-2026-0003',
    studentId: 'STU-002',
    classId: 'CLS-01',
    month: '2026-03',
    feeAmount: 3500,
    discount: 350, // 10% discount
    paidAmount: 3150,
    dueAmount: 0,
    paymentDate: '2026-03-02 11:15',
    paymentMethod: 'card',
    status: 'paid',
    cashierName: 'කැෂියර් 02 (ප්‍රියන්ත)'
  },
  {
    id: 'PAY-004',
    receiptNumber: 'REC-2026-0004',
    studentId: 'STU-003',
    classId: 'CLS-01',
    month: '2026-03',
    feeAmount: 3500,
    discount: 0,
    paidAmount: 2000,
    dueAmount: 1500,
    paymentDate: '2026-03-03 14:00',
    paymentMethod: 'cash',
    status: 'partial',
    cashierName: 'කැෂියර් 01 (සරත්)',
    notes: 'රු. 1500 ක ඉතිරි මුදල ලබන සතියේ ගෙවීමට එකඟ විය.'
  },
  {
    id: 'PAY-005',
    receiptNumber: 'REC-2026-0005',
    studentId: 'STU-004',
    classId: 'CLS-02',
    month: '2026-03',
    feeAmount: 3800,
    discount: 3800,
    paidAmount: 0,
    dueAmount: 0,
    paymentDate: '2026-03-01 10:00',
    paymentMethod: 'cash',
    status: 'free_card',
    cashierName: 'පරිපාලක',
    notes: 'ශිෂ්‍යත්ව හිමි නොමිලේ කාඩ්පත (Free Card)'
  },
  {
    id: 'PAY-006',
    receiptNumber: 'REC-2026-0006',
    studentId: 'STU-005',
    classId: 'CLS-05',
    month: '2026-03',
    feeAmount: 3000,
    discount: 0,
    paidAmount: 3000,
    dueAmount: 0,
    paymentDate: '2026-03-04 15:20',
    paymentMethod: 'bank_transfer',
    status: 'paid',
    cashierName: 'කැෂියර් 02 (ප්‍රියන්ත)'
  }
];

export const initialExpenses: ExpenseRecord[] = [
  {
    id: 'EXP-01',
    title: 'නුගේගොඩ ගොඩනැගිලි මාසික කුලිය',
    category: 'building_rent',
    amount: 150000,
    date: '2026-03-01',
    paidTo: 'එච්. පීරිස් මහතා (ගොඩනැගිලි හිමිකරු)',
    receiptRef: 'RENT-2026-03',
    notes: 'නුගේගොඩ ශාඛාවේ මාර්තු මස කුලිය'
  },
  {
    id: 'EXP-02',
    title: 'විදුලි බිල සහ ජල බිල',
    category: 'electricity_water',
    amount: 28500,
    date: '2026-03-02',
    paidTo: 'ලංකා විදුලිබල මණ්ඩලය / ජල සම්පාදන',
    receiptRef: 'CEB-983411',
    notes: 'වායු සමීකරණ සහ විදුලි පහන් වියදම'
  },
  {
    id: 'EXP-03',
    title: 'ආචාර්ය නිමල් සේනාරත්න - පෙබරවාරි ගුරු ගෙවීම',
    category: 'teacher_payout',
    amount: 98000,
    date: '2026-03-05',
    paidTo: 'ආචාර්ය නිමල් සේනාරත්න',
    teacherId: 'TCH-001',
    receiptRef: 'TCH-PAY-01',
    notes: '80% කොමිස් මුදල ගිණුමට බැර කරන ලදී'
  },
  {
    id: 'EXP-04',
    title: 'ටියුට් සහ නිබන්ධන මුද්‍රණ වියදම් (Paper & Printing)',
    category: 'stationery_printing',
    amount: 42000,
    date: '2026-03-06',
    paidTo: 'සුප්‍රීම් ප්‍රින්ටර්ස්, නුගේගොඩ',
    receiptRef: 'PRN-4421',
    notes: 'සංයුක්ත ගණිතය සහ භෞතික විද්‍යාව ටියුට්'
  }
];

export const initialExams: ExamRecord[] = [
  {
    id: 'EXAM-01',
    title: '2026 A/L සංයුක්ත ගණිතය - මාසික ඇගයීම් පරීක්ෂණය 01',
    classId: 'CLS-01',
    date: '2026-02-28',
    totalMarks: 100,
    marksList: [
      { studentId: 'STU-001', marks: 94, grade: 'A', rank: 1, remarks: 'විශිෂ්ට සාමාර්ථයකි. දිගටම පවත්වාගන්න.' },
      { studentId: 'STU-002', marks: 86, grade: 'A', rank: 2, remarks: 'ඉතා හොඳයි. ජ්‍යාමිතිය කොටස තවදුරටත් පුහුණු වන්න.' },
      { studentId: 'STU-003', marks: 74, grade: 'B', rank: 3, remarks: 'හොඳයි. කාල කළමනාකරණය දියුණු කරගන්න.' }
    ]
  },
  {
    id: 'EXAM-02',
    title: '2026 A/L භෞතික විද්‍යාව - යාන්ත්‍ර විද්‍යාව පරීක්ෂණය',
    classId: 'CLS-03',
    date: '2026-03-02',
    totalMarks: 100,
    marksList: [
      { studentId: 'STU-001', marks: 88, grade: 'A', rank: 1, remarks: 'ඉතා විශිෂ්ටයි.' },
      { studentId: 'STU-002', marks: 78, grade: 'B', rank: 2, remarks: 'හොඳ සාමාර්ථයකි.' }
    ]
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'අද දින පන්ති කාලසටහන සූදානම්',
    message: 'අද දින පන්ති 2ක් නුගේගොඩ ශාඛාවේ පැවැත්වීමට නියමිතයි. ශාලා සූදානම් කර ඇත.',
    type: 'info',
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    id: 'NOTIF-02',
    title: 'නව ගෙවීමක් ලැබුණි - රු. 3,500',
    message: 'කසුන් පෙරේරා (STU-001) මාර්තු මස පන්ති ගාස්තු ගෙවා ඇත.',
    type: 'payment',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'NOTIF-03',
    title: 'QR පැමිණීමේ වාර්තාව',
    message: 'අද දින සිසුන් 3 දෙනෙකු QR මගින් සාර්ථකව පන්තියට ඇතුළත් විය.',
    type: 'attendance',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: true
  }
];
