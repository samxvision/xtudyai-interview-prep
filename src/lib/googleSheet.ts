
export async function sendQuestionToGoogleSheet(
  question: string,
  mode: 'database' | 'hybrid' | 'ai'
) {
  try {
    await fetch(
      'https://script.google.com/macros/s/AKfycbwdl2TBklXbW8GYMKmyOXz1p266tztAJpJX-DF-YIuMOpXThxyl9C-vQDynLoNVhlOq/exec',
      {
        method: 'POST',
        mode: 'no-cors', // Fix for TypeError: Failed to fetch
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          mode,
        }),
      }
    );
  } catch (error) {
    // silent fail – user ko kuch nahi dikhana
    console.error('Google Sheet error:', error);
  }
}
