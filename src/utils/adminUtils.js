export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
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
