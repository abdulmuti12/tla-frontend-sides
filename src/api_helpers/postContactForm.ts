export async function postContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}) {
  return fetch('/api/form/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
}
