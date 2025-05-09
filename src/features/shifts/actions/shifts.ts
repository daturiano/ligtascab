'use server';

import { getTricycleByPlateNumber } from '@/features/tricycles/db/tricycles';
import { ShiftLog } from '@/lib/types';
import {
  checkDriverStatus,
  createShiftLog,
  getAvailableTricycles,
  getDriverAssignedVehicle,
  updateDriverStatus,
  updateTricycleStatus,
} from '../db/shifts';

export const fetchAllAvailableTricyclesFromOperator = async () => {
  const { data: availableVehicles, error } = await getAvailableTricycles();

  if (error) throw new Error('Unable to fetch all tricycles');

  return availableVehicles;
};

export async function createNewShiftLog(data: ShiftLog) {
  try {
    const log = {
      driver_name: data.driver_name,
      plate_number: data.plate_number,
      shift_type: data.shift_type,
      operator_id: data.operator_id,
      driver_id: data.driver_id,
      tricycle_id: '',
    };

    const status = `${data.shift_type === 'Time-in' ? 'active' : 'inactive'}`;

    if (log.shift_type === 'Time-out') {
      const isActive = await checkDriverStatus(log.driver_id);
      if (!isActive) {
        return { error: 'Driver is not active.' };
      }
      const { data: assignedVehicle, error: assignedError } =
        await getDriverAssignedVehicle(log.driver_id);
      if (assignedError)
        return { error: 'Cannot get driver assigned vehicle', assignedError };
      log.tricycle_id = assignedVehicle.tricycle_id;
      const isCreated = await createShiftLog(log);
      if (!isCreated) {
        return { error: 'Log was not created' };
      }
    }

    if (log.shift_type === 'Time-in') {
      const { data, error: getTricycleError } = await getTricycleByPlateNumber(
        log.plate_number
      );
      if (getTricycleError || data.id == undefined)
        return {
          error: 'Cannot get tricycle using plate number',
          getTricycleError,
        };
      log.tricycle_id = data.id;
      const isActive = await checkDriverStatus(log.driver_id);
      if (isActive) {
        return { error: 'Driver is currently active.' };
      }
      const isCreated = await createShiftLog(log);
      if (!isCreated) {
        return { error: 'Log was not created' };
      }
    }

    const isDriverUpdated = await updateDriverStatus(log.driver_id, status);
    if (!isDriverUpdated) {
      return { message: 'Cannot update driver status.' };
    }
    const isTricycleUpdated = await updateTricycleStatus(
      log.plate_number,
      status
    );
    if (!isTricycleUpdated) {
      return { message: 'Cannot update vehicle status.' };
    }

    return {
      message: 'Shift Log Attendance Recorded!',
    };
  } catch (error) {
    console.error('Error creating new log:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.',
    };
  }
}
