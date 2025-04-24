export type Tricycle = {
  id: string;
  operator_id?: string;
  plate_number: string;
  registration_expiry: Date;
  registration_number: string;
  status: string;
  model: string;
  year: string;
};

export type Tricycle2 = {
  id?: string;
  operator_id?: string;
  tricycle_details?: {
    model?: string;
    year?: string;
    seating_capacity?: string;
    body_number?: string;
    fuel_type?: string;
    mileage?: string;
    maintenance_status?: string;
  };
  compliance_details?: {
    registration_number?: string;
    franchise_number?: string;
    or_number?: string;
    cr_number?: string;
  };
  registration_expiration?: Date;
  franchise_expiration?: Date;
  last_maintenance_date?: Date;
};

export type Operator = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_new_user: boolean;
  subscribe_to_newsletter?: boolean;
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
  phone_number: string;
  license_number: string;
  license_expiry: string;
  status: string;
  email?: string;
  image?: string;
  address: Address;
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
