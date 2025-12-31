import { XCircleIcon, CheckCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircleIcon,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircleIcon,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: ExclamationTriangleIcon,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: InformationCircleIcon,
    },
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.text} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`text-sm ${config.text}`}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`${config.text} hover:opacity-70 ml-3`}>
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;