
const SessionExpiredModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-600">
        <div className="p-6 text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Sesión Vencida
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Por favor, inicie sesión nuevamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            style={{backgroundColor: '#27AE60'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#219653'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27AE60'}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
