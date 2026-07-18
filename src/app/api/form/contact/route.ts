import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    /**
     * Actual URL
     * https://docs.google.com/forms/d/e/1FAIpQLSdFEmltBUhlLpit8HROoT6izkI6hUY-cFKqI9-VfBxaSZjNHA/viewform?usp=pp_url&entry.984298980=stevie&entry.959399503=stevie.257@gmail.com&entry.1038917063=087725144460&entry.1374313167=the+luxury+asia+group&entry.1332981723=saya+ingin+bekerjasama
     */
    const formData = await request.json();
    console.log('Form data:', formData);

    const formId = `1FAIpQLSdFEmltBUhlLpit8HROoT6izkI6hUY-cFKqI9-VfBxaSZjNHA`;
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    const formParams = new URLSearchParams();

    formParams.append('entry.984298980', formData.name);
    formParams.append('entry.959399503', formData.email);
    formParams.append('entry.1038917063', formData.phone);
    formParams.append('entry.1374313167', formData.company);
    formParams.append('entry.1332981723', formData.message);

    console.log('Submitting to URL:', formUrl);

    const response = await fetch(formUrl, {
      method: 'POST',
      body: formParams,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('Forms response status:', response.status);
    console.log('Forms response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`Failed to submit form: ${response.status}`);
    }

    console.log('Form submission details:', {
      url: formUrl,
      params: Object.fromEntries(formParams),
      status: response.status,
      ok: response.ok,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
