// Get references to the buttons and response area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const responseDiv = document.getElementById('response');

// This function shows an animated loading message
let loadingInterval; // To store the interval ID
function showLoading() {
  let dots = 0;
  // Array of fun loading messages
  const loadingMessages = [
    'Thinking',
    'Cooking up something cool',
    'Asking the AI',
    'Getting your answer',
    'One moment please',
    'Let me think'
  ];
  // Pick a random message each time
  const baseMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  responseDiv.textContent = baseMsg;
  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4; // Cycle through 0,1,2,3
    responseDiv.textContent = baseMsg + '.'.repeat(dots);
  }, 500); // Update every 0.5 seconds
}

// This function hides the loading message
function hideLoading() {
  clearInterval(loadingInterval);
}

// This function sends a prompt to OpenAI and updates the page with the response
async function getOpenAIResponse(prompt) {
  // Show an animated loading message
  showLoading();

  try {
    // Call the OpenAI API using fetch
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // apiKey comes from secrets.js
      },
      body: JSON.stringify({
        model: 'gpt-4.1', // Use the GPT-4.1 model
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100
      })
    });

    

    // Parse the JSON response
    const data = await res.json();

    // Get the assistant's reply
    const reply = data.choices && data.choices[0].message.content;
    // Hide the loading message
    hideLoading();
    // Show the reply or an error message
    responseDiv.textContent = reply || 'Sorry, no response.';
  } catch (error) {
    // Hide the loading message
    hideLoading();
    // Show an error message if something goes wrong
    responseDiv.textContent = 'Error: ' + error.message;
  }
}

// Add event listeners to each button
iceBtn.addEventListener('click', () => {
  // Ask for an icebreaker question
  getOpenAIResponse('Give me a fun, simple icebreaker question for a group.');
});

factBtn.addEventListener('click', () => {
  // Ask for a surprising fact
  getOpenAIResponse('Tell me a surprising, weird fact that most people don\'t know.');
});

jokeBtn.addEventListener('click', () => {
  // Ask for a friendly, clean joke
  getOpenAIResponse('Tell me a friendly, clean joke that anyone can enjoy.');
});

weatherBtn.addEventListener('click', () => {
  // Ask for a weather-related conversation starter
  getOpenAIResponse('Write a fun, friendly prompt that gets people to share what the weather is like where they are.');
});
