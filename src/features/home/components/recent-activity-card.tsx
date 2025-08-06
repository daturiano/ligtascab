import { Log } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import {
  AlarmClockMinus,
  CarFront,
  CircleCheckBig,
  Edit,
  FileText,
  LucideIcon,
  Trash2,
  Upload,
  UserMinus,
  UserPlus,
} from 'lucide-react';

type RecentActivityCardProps = {
  activity: Log;
};

const recentActivityConfig: Record<
  string,
  {
    icon: LucideIcon;
    getMessage: (log: Log) => string;
    getDate: (log: Log) => string;
    color: string;
  }
> = {
  time_in: {
    icon: CircleCheckBig,
    getMessage: (log) =>
      `${log.data.driver_name} started shift - ${log.data.plate_number}`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  time_out: {
    icon: AlarmClockMinus,
    getMessage: (log) =>
      `Shift completed - ${log.data.driver_name} earned ₱${log.data.revenue_collected}`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  delete_driver: {
    icon: UserMinus,
    getMessage: (log) =>
      `Driver ${log.data.driver_name} was removed from the system`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  create_driver: {
    icon: UserPlus,
    getMessage: (log) =>
      `New driver added: ${log.data.first_name} ${log.data.last_name}`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  delete_tricycle: {
    icon: Trash2,
    getMessage: (log) =>
      `Tricycle ${
        log.data.plate_number || log.data.vehicle_id
      } was removed from the system`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  update_tricycle: {
    icon: Edit,
    getMessage: (log) =>
      `Tricycle ${
        log.data.plate_number || log.data.vehicle_id
      } information was updated`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  create_tricycle: {
    icon: CarFront,
    getMessage: (log) =>
      `New tricycle registered: ${
        log.data.plate_number || log.data.vehicle_id
      }`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  operator_documents: {
    icon: FileText,
    getMessage: (log) =>
      `Operator documents updated: ${
        log.data.document_type || 'Document uploaded'
      }`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7 ',
  },
  driver_documents: {
    icon: Upload,
    getMessage: (log) =>
      `Driver ${log.data.driver_name || 'document'} updated: ${
        log.data.document_type || 'Document uploaded'
      }`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
  tricycle_documents: {
    icon: FileText,
    getMessage: (log) =>
      `Tricycle ${
        log.data.plate_number || log.data.vehicle_id
      } documents updated: ${log.data.document_type || 'Document uploaded'}`,
    getDate: (log) =>
      `${formatDateTime(log.created_at.toLocaleString(), true)}`,
    color: '#b9e1d7',
  },
};

export default function RecentActivityCard({
  activity,
}: RecentActivityCardProps) {
  const config = recentActivityConfig[activity.log_event];

  if (!config) {
    console.warn(`Unknown log_event: ${activity.log_event}`);
    return null;
  }

  const { icon: Icon, getMessage, getDate, color } = config;

  return (
    <div
      className={`flex flex-row text-start items-center justify-between rounded-lg gap-4
      `}
    >
      <div
        className={`size-12 rounded-xl flex items-center justify-center`}
        style={{ backgroundColor: color }}
      >
        <Icon size={20} />
      </div>
      <div className="flex flex-col flex-1 justify-between gap-1">
        <p className="text-sm font-normal">{getMessage(activity)}</p>
        <p className="text-muted-foreground text-sm text-pretty">
          {getDate(activity)}
        </p>
      </div>
    </div>
  );
}
