export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const generateUserMessage = (user, type, data = {}) => {
  if (!user) return '';
  
  const firstName = user.first_name || user.username || 'Usuario';
  const username = user.username || 'N/A';
  
  const greeting = `¡Hola ${firstName}! 👋`;
  
  const closing = `Cualquier consulta es bienvenida, estamos para asesorar.

Saludos,

Equipo Rinde+.`;
  
  let content = '';
  
  switch (type) {
    case 'created':
      const password = user.password || 'N/A';
      content = `Tu cuenta Rinde+ ha sido creada. ¡Proyecta tu evolución! 🚀

Acceso:
• Link: maurocor.github.io/rindemas/
• Usuario: ${username}
• Contraseña: ${password}

💡 Actualizar esta contraseña genérica.
Puedes hacerlo al iniciar sesión en: Usuario > Perfil > Cambiar contraseña.`;
      break;
      
    case 'edited':
      const changes = [];
      if (data.first_name) changes.push(`• Nombre: ${data.first_name}`);
      if (data.last_name) changes.push(`• Apellido: ${data.last_name}`);
      if (data.username) changes.push(`• Usuario: ${data.username}`);
      if (data.email) changes.push(`• Email: ${data.email}`);
      if (data.password) changes.push(`• Contraseña: ${data.password}`);
      
      content = `Actualizamos los datos de tu cuenta Rinde+.

Cambios realizados:
${changes.join('\n')}`;
      break;
      
    case 'toggled':
      const isActivated = data.is_active;
      content = isActivated ? 
        '✅ Tu cuenta Rinde+ ha sido activada.' : 
        '😔 Sentimos informar que su cuenta Rinde+ ha sido desactivada temporalmente.';
      break;
      
    default:
      return '';
  }
  
  return `${greeting}

${content}

${closing}`;
};

export const generateCreatedUserMessage = (user) => generateUserMessage(user, 'created');
export const generateEditedUserMessage = (user, editedData) => generateUserMessage(user, 'edited', editedData);
export const generateToggledUserMessage = (user, toggledData) => generateUserMessage(user, 'toggled', toggledData);

export const generateMailtoLink = (email, message) => {
  if (!email) return '#';
  const subject = encodeURIComponent('Rinde+ - Información de cuenta');
  const body = encodeURIComponent(message);
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

export const sortUsers = (users) => {
  return (users || []).sort((a, b) => {
    if (a.is_superuser !== b.is_superuser) {
      return b.is_superuser - a.is_superuser;
    }
    const nameA = a.full_name || `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.username;
    const nameB = b.full_name || `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.username;
    return nameA.localeCompare(nameB);
  });
};
