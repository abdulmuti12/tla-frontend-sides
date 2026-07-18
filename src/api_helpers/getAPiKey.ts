export const getAPIKey = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('TLA_API_KEY') || '';
};
