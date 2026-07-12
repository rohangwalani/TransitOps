// Map city coordinates for Leaflet display
export const CITY_COORDINATES = {
  Depot: [19.0760, 72.8777], // Mumbai depot
  Mumbai: [19.0760, 72.8777],
  Pune: [18.5204, 73.8567],
  Nashik: [19.9975, 73.7898],
  Thane: [19.2183, 72.9781],
  Nagpur: [21.1458, 79.0882],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311]
};

export const initialVehicles = [
  {
    id: 'V-402',
    name: 'Freightliner Cascadia',
    registrationNumber: 'MH-12-PQ-4020',
    type: 'Heavy Duty',
    capacity: 45000,
    odometer: 120500,
    cost: 135000,
    status: 'Available'
  },
  {
    id: 'V-119',
    name: 'Specialized Delivery Van',
    registrationNumber: 'MH-43-AS-1190',
    type: 'Light Duty',
    capacity: 8000,
    odometer: 45200,
    cost: 42000,
    status: 'On Trip'
  },
  {
    id: 'V-088',
    name: 'Mack Anthem',
    registrationNumber: 'MH-15-DR-0880',
    type: 'Heavy Duty',
    capacity: 50000,
    odometer: 95400,
    cost: 148000,
    status: 'On Trip'
  },
  {
    id: 'V-331',
    name: 'Volvo FH16',
    registrationNumber: 'MH-12-XY-3310',
    type: 'Heavy Duty',
    capacity: 48000,
    odometer: 182000,
    cost: 155000,
    status: 'In Shop'
  },
  {
    id: 'V-102',
    name: 'EV Sprinter',
    registrationNumber: 'MH-04-EV-1020',
    type: 'Electric',
    capacity: 5000,
    odometer: 12100,
    cost: 65000,
    status: 'In Shop'
  },
  {
    id: 'V-222',
    name: 'Fleet Van #22',
    registrationNumber: 'MH-03-FV-2220',
    type: 'Light Duty',
    capacity: 6000,
    odometer: 88400,
    cost: 35000,
    status: 'Available'
  },
  {
    id: 'V-045',
    name: 'Semi-Trailer #45',
    registrationNumber: 'MH-12-ST-4500',
    type: 'Heavy Duty',
    capacity: 40000,
    odometer: 154000,
    cost: 110000,
    status: 'Available'
  },
  {
    id: 'V-009',
    name: 'Ford Transit #09',
    registrationNumber: 'MH-12-FT-0900',
    type: 'Light Duty',
    capacity: 7000,
    odometer: 32500,
    cost: 38000,
    status: 'Available'
  }
];

export const initialDrivers = [
  {
    id: 'TR-9021',
    name: 'Marcus Thorne',
    licenseNumber: 'DL-902100456',
    licenseExpiry: '2026-12-15',
    contact: '+91 98765 43210',
    safetyScore: 98,
    experience: 8,
    role: 'Lead Hauler',
    status: 'Available'
  },
  {
    id: 'TR-4452',
    name: 'Elena Sokolov',
    licenseNumber: 'DL-445200789',
    licenseExpiry: '2025-08-22',
    contact: '+91 98765 43211',
    safetyScore: 92,
    experience: 4,
    role: 'Cargo Specialist',
    status: 'Available'
  },
  {
    id: 'TR-1102',
    name: 'Jackson Wu',
    licenseNumber: 'DL-110200123',
    licenseExpiry: '2026-07-09', // Expired based on 2026-07-12
    contact: '+91 98765 43212',
    safetyScore: 78,
    experience: 2,
    role: 'Fleet Driver',
    status: 'Available'
  },
  {
    id: 'TR-5529',
    name: 'Sarah Jenkins',
    licenseNumber: 'DL-552900987',
    licenseExpiry: '2027-04-18',
    contact: '+91 98765 43213',
    safetyScore: 95,
    experience: 15,
    role: 'Regional Manager',
    status: 'On Trip'
  },
  {
    id: 'TR-6782',
    name: 'Leo Martinez',
    licenseNumber: 'DL-678200321',
    licenseExpiry: '2024-11-30', // Expired
    contact: '+91 98765 43214',
    safetyScore: 89,
    experience: 3,
    role: 'Last Mile Expert',
    status: 'Available'
  },
  {
    id: 'TR-3391',
    name: 'David Chen',
    licenseNumber: 'DL-339100654',
    licenseExpiry: '2026-05-20',
    contact: '+91 98765 43215',
    safetyScore: 91,
    experience: 6,
    role: 'Heavy Duty Operator',
    status: 'Available'
  },
  {
    id: 'TR-2281',
    name: 'Rachel Adams',
    licenseNumber: 'DL-228100159',
    licenseExpiry: '2025-10-10',
    contact: '+91 98765 43216',
    safetyScore: 96,
    experience: 10,
    role: 'Logistics Driver',
    status: 'Available'
  },
  {
    id: 'TR-9901',
    name: 'New Hire Pending',
    licenseNumber: 'Verifying...',
    licenseExpiry: '',
    contact: '+91 98765 43217',
    safetyScore: 0,
    experience: 0,
    role: 'Awaiting Documentation',
    status: 'Suspended'
  }
];

export const initialTrips = [
  {
    id: 'TR-8821',
    origin: 'Mumbai',
    destination: 'Pune',
    status: 'On Schedule',
    driverId: 'TR-9021',
    driverName: 'Marcus Thorne',
    vehicleId: 'V-402',
    cargoWeight: 28000,
    progress: 65,
    eta: '14:45',
    speed: '58mph',
    fuel: '74%',
    distance: 150
  },
  {
    id: 'TR-8825',
    origin: 'Mumbai',
    destination: 'Thane',
    status: 'Delayed',
    driverId: 'TR-4452',
    driverName: 'Elena Sokolov',
    vehicleId: 'V-119',
    cargoWeight: 5000,
    progress: 22,
    eta: '+45m',
    speed: '12mph',
    fuel: '88%',
    distance: 30,
    alertText: 'Traffic Congestion (I-95)'
  },
  {
    id: 'TR-8830',
    origin: 'Pune',
    destination: 'Nashik',
    status: 'On Schedule',
    driverId: 'TR-5529',
    driverName: 'Sarah Jenkins',
    vehicleId: 'V-088',
    cargoWeight: 42000,
    progress: 92,
    eta: '11:15',
    speed: '62mph',
    fuel: '41%',
    distance: 210
  }
];

export const initialMaintenance = [
  {
    id: 'SERVICE-402',
    vehicleId: 'V-045',
    vehicleName: 'Semi-Trailer #45',
    title: 'Semi-Trailer #45: Brake Inspection',
    description: 'Quarterly safety inspection for the main haulage unit.',
    status: 'Scheduled',
    type: 'service',
    cost: 350,
    date: '2026-07-24'
  },
  {
    id: 'REPAIR-129',
    vehicleId: 'V-009',
    vehicleName: 'Ford Transit #09',
    title: 'Ford Transit #09: Oil Change',
    description: 'Standard 15k mile service and fluids check.',
    status: 'Scheduled',
    type: 'repair',
    cost: 120,
    date: 'Overdue',
    overdue: true
  },
  {
    id: 'MAINT-882',
    vehicleId: 'V-222',
    vehicleName: 'Fleet Van #22',
    title: 'Fleet Wash & Detail',
    description: 'Monthly cleaning for East District vehicles.',
    status: 'Scheduled',
    type: 'maint',
    cost: 50,
    date: '2026-07-28'
  },
  {
    id: 'REPAIR-331',
    vehicleId: 'V-331',
    vehicleName: 'Mack Anthem',
    title: 'Mack Anthem: Transmission',
    description: 'Replacing clutch assembly and fluid flush.',
    status: 'In Progress',
    type: 'repair',
    cost: 1450,
    progress: 65,
    timeElapsed: '4h 20m',
    assignee: 'M. Rivera'
  },
  {
    id: 'MAINT-102',
    vehicleId: 'V-102',
    vehicleName: 'EV Sprinter',
    title: 'EV Sprinter: Firmware Update',
    description: 'Updating navigation and battery management systems.',
    status: 'In Progress',
    type: 'maint',
    cost: 0,
    isAutoUpdate: true,
    wifiConnected: true
  },
  {
    id: 'SERVICE-398',
    vehicleId: 'V-331',
    vehicleName: 'Volvo FH16',
    title: 'Volvo FH16: Tire Rotation',
    description: 'Complete 12-wheel rotation and alignment check.',
    status: 'Completed',
    type: 'service',
    cost: 180,
    date: '2026-07-22'
  },
  {
    id: 'REPAIR-320',
    vehicleId: 'V-222',
    vehicleName: 'Fleet Van #22',
    title: 'Fleet Van #22: Headlight',
    description: 'Replaced shattered driver-side housing.',
    status: 'Completed',
    type: 'repair',
    cost: 95,
    date: '2026-07-21'
  }
];

export const initialFuel = [
  {
    id: 'F-001',
    vehicleId: 'V-402',
    fuel: 120,
    cost: 144,
    date: '2026-07-10'
  },
  {
    id: 'F-002',
    vehicleId: 'V-119',
    fuel: 45,
    cost: 54,
    date: '2026-07-11'
  },
  {
    id: 'F-003',
    vehicleId: 'V-088',
    fuel: 160,
    cost: 192,
    date: '2026-07-12'
  }
];
