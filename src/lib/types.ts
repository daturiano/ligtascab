export type AttachmentDetails = {
  [key: string]: {
    file: File | null;
    documentId: string;
    documentTitle: string;
  };
};

export type Tricycle = {
  id: string;
  operator_id: string;
  tricycle_details: {
    model: string;
    year: string;
    seating_capacity: string;
    body_number: string;
    fuel_type: string;
    mileage: string;
    maintenance_status: string;
  };
  compliance_details: {
    registration_number: string;
    franchise_number: string;
    or_number: string;
    cr_number: string;
  };
  status?: string;
  plate_number: string;
  registration_expiration: Date;
  franchise_expiration: Date;
  last_maintenance_date: Date;
  image?: string;
  assigned_driver?: string;
  last_used_by?: string;
};

export type ShiftLog = {
  id?: string;
  driver_name: string;
  plate_number: string;
  shift_type: string;
  operator_id: string;
  driver_id: string;
  tricycle_id: string;
  created_at?: Date | string;
  revenue_collected?: string;
  shift_description?: string;
};

export type Operator = {
  id: string;
  first_name: string;
  last_name: string;
  coop_name?: string;
  phone_number: string;
  email?: string;
  image?: string;
  address: Address;
  birth_date: Date;
};

export type Driver = {
  id: string;
  operator_id: string;
  first_name: string;
  last_name: string;
  emergency_contact_number: string;
  emergency_contact_name: string;
  phone_number?: string;
  license_number: string;
  license_expiration: Date;
  status?: string;
  email?: string;
  image?: string;
  user_id?: string;
  address: string;
  birth_date: Date;
};

type Address = {
  address: string;
  province: string;
  postal_code: string;
  municipality: string;
};

export interface DocumentType {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export type Notification = {
  id: string;
  operator_id: string;
  driver_id?: string;
  tricycle_id?: string;
  plate_number?: string;
  driver_name?: string;
  expiration_type: string;
  read: boolean;
  created_at: string;
  expiration_date: Date;
};

export type MaintenanceRecords = {
  id?: string;
  tricycle_id: string;
  operator_id: string;
  type: string;
  plate_number: string;
  issue_description?: string;
  service_performed: string;
  cost: string;
  date: Date;
  created_at?: Date;
};

export type Log = {
  id: string;
  log_event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  driver_id: string;
  tricycle_id: string;
  operator_id: string;
  created_at: Date;
};

export type PendingRequest = {
  id: string;
  action_type: string;
  status: string;
  target_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  created_at: string;
};

export type SuperAdminStats = {
  totalOperators: number;
  suspendedOperators: number;
  totalDrivers: number;
  suspendedDrivers: number;
  totalTricycles: number;
  totalLogs: number;
};

export type AuthorityUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata: {
    role: string;
  };
  banned_until?: string;
};
