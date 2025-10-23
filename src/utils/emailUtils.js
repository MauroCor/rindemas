const CONTACT_EMAIL = 'rindemas.web@gmail.com';

const optimizeMessage = (message) => {
  const encoded = encodeURIComponent(message);
  return encoded.replace(/%0A/g, '%0D%0A');
};

export const generateMailto = (email, subject, message = '') => {
  if (!email) return '#';
  
  const encodedSubject = encodeURIComponent(subject);
  const optimizedBody = optimizeMessage(message);
  
  return `mailto:${email}?subject=${encodedSubject}&body=${optimizedBody}`;
};

export const generateAccountRequestMailto = () => {
  const message = `¡Hola! 👋
Quisiera solicitar una cuenta personal en Rinde+ 💰

Mis datos:
👤 Nombre completo:
📧 Email:
💡 Usuario deseado (opcional):
🤝 ¿Desea asesoramiento personalizado?:

¡Gracias!
Saludos.`;
  
  return generateMailto(CONTACT_EMAIL, 'Nuevo usuario | Rinde+', message);
};

export const generateContactMailto = (subject = 'Consultas | Rinde+') => {
  return generateMailto(CONTACT_EMAIL, subject);
};

export const generateCreatedUserMailto = (user, messageOnly = false) => {
  if (!user) return messageOnly ? '' : '#';
  
  const firstName = user.first_name || user.username || 'Usuario';
  const username = user.username || 'N/A';
  const password = user.password || 'N/A';
  
  const message = `¡Hola ${firstName}! 👋

Tu cuenta Rinde+ ha sido creada. 

¡Proyecta tu evolución! 🚀

Acceso:
• Link: maurocor.github.io/rindemas/
• Usuario: ${username}
• Contraseña: ${password}

💡 Actualizar esta contraseña genérica.
Puedes hacerlo al iniciar sesión en: Usuario > Perfil > Cambiar contraseña.

Cualquier consulta es bienvenida, estamos para asesorar.

Saludos,

Equipo Rinde+.`;
  
  if (messageOnly) {
    return message;
  }
  
  return generateMailto(user.email, 'Cuenta | Rinde+', message);
};

export const generateEditedUserMailto = (user, editedData, messageOnly = false) => {
  if (!user) return messageOnly ? '' : '#';
  
  const firstName = user.first_name || user.username || 'Usuario';
  
  const changes = [];
  if (editedData.first_name) changes.push(`• Nombre: ${editedData.first_name}`);
  if (editedData.last_name) changes.push(`• Apellido: ${editedData.last_name}`);
  if (editedData.username) changes.push(`• Usuario: ${editedData.username}`);
  if (editedData.email) changes.push(`• Email: ${editedData.email}`);
  if (editedData.password) changes.push(`• Contraseña: ${editedData.password}`);
  
  const message = `¡Hola ${firstName}! 👋

Actualizamos los datos de tu cuenta Rinde+.

Cambios realizados:
${changes.join('\n')}

Cualquier consulta es bienvenida, estamos para asesorar.

Saludos,

Equipo Rinde+.`;
  
  if (messageOnly) {
    return message;
  }
  
  return generateMailto(user.email, 'Cuenta | Rinde+', message);
};

export const generateToggledUserMailto = (user, toggledData, messageOnly = false) => {
  if (!user) return messageOnly ? '' : '#';
  
  const firstName = user.first_name || user.username || 'Usuario';
  const isActivated = toggledData.is_active;
  
  const statusMessage = isActivated ? 
    '✅ Tu cuenta Rinde+ ha sido activada.' : 
    '😔 Sentimos informar que su cuenta Rinde+ ha sido desactivada temporalmente.';
  
  const message = `¡Hola ${firstName}! 👋

${statusMessage}

Cualquier consulta es bienvenida, estamos para asesorar.

Saludos,

Equipo Rinde+.`;
  
  if (messageOnly) {
    return message;
  }
  
  return generateMailto(user.email, 'Cuenta | Rinde+', message);
};
