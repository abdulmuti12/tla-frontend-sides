import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    /**
     * Actual URL
     * https://docs.google.com/forms/d/e/1FAIpQLScMCp-AzVE3zzxHEvZT7_L95u9iNijeQy8p7oW4dpR0V_wIGQ/viewform?usp=pp_url&entry.14584678=stevie.257@gmail.com
     */

    const formData = await request.json();
    console.log('Form data:', formData);

    const formId = '1FAIpQLScMCp-AzVE3zzxHEvZT7_L95u9iNijeQy8p7oW4dpR0V_wIGQ';
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    const formParams = new URLSearchParams();
    formParams.append('entry.14584678', formData.email);

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
