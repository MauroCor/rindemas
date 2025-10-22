import React from 'react';
import { formatDate } from '../../utils/adminUtils';

const UserTable = ({ users, onEditUser, onToggleUser, onDeleteUser }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-center">ID</th>
            <th className="px-4 py-3 text-center">Usuario</th>
            <th className="px-4 py-3 text-center">Nombre</th>
            <th className="px-4 py-3 text-center">Email</th>
            <th className="px-4 py-3 text-center">Activo</th>
            <th className="px-4 py-3 text-center">Superusuario</th>
            <th className="px-4 py-3 text-center">Registro</th>
            <th className="px-4 py-3 text-center">Login</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-750">
              <td className="px-4 py-3 text-center">{user.id}</td>
              <td className="px-4 py-3 text-center">{user.username}</td>
              <td className="px-4 py-3 text-center">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim()}</td>
              <td className="px-4 py-3 text-center">{user.email}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.is_active ? 'text-white' : 'bg-red-600 text-red-100'
                }`} style={user.is_active ? {background: '#16A085'} : {}}>
                  {user.is_active ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.is_superuser ? 'text-white' : 'bg-gray-600 text-gray-300'
                }`} style={user.is_superuser ? {background: '#16A085'} : {}}>
                  {user.is_superuser ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-300 text-center">
                {formatDate(user.date_joined)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-300 text-center">
                {formatDate(user.last_login)}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={() => onEditUser(user)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleUser(user)}
                    className={`text-sm ${
                      user.is_active
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'hover:opacity-80'
                    }`}
                    style={!user.is_active ? {color: '#16A085'} : {}}
                  >
                    {user.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  {!user.is_superuser && (
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
