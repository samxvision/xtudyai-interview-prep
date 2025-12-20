
export async function sendQuestionToAutomation(question: string) {
  try {
    await fetch("https://hook.eu1.make.com/1vmcx0bm16xcasj3rhsisgf92ljasl4x", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });
  } catch (err) {
    console.error("Automation webhook failed", err);
  }
}

