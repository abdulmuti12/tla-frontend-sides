export async function postSubscribeForm(formData: { email: string }) {
  return fetch('/api/form/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
}
