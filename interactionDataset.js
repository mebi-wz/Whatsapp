module.exports = {
    start: [
        {
          trigger: ['/start'],
          response: [
            '👋 Welcome to HagbesBot! I\'m here to assist you with registering your phone number and more.\n\nPlease select an option from the menu or let me know how I can help!',
           '🎉 Welcome to HagbesBot! I can help you with various tasks. Let me know how I can assist you today!'
          ]
        }
      ],
    greetings: [
      {
        trigger: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy','how are you'],
        response: [
          '👋 Hello! How can I assist you today?',
          '😊 Hi there! What can I do for you?',
          '🙋‍♂️ Hey! How are you doing?',
          '🌅 Good morning! How can I help you today?',
          '🤠 Howdy! How can I assist you?'
        ]
      }
    ],
    phone_number_explanation: [
        {
          trigger: ['why', 'why do I need to provide my phone number', 'why should I register my phone number'],
          response: [
            '📱 The phone number is required for employee registration at Hagbes. By registering, you can receive updates about your leave balance, assets, and other important details related to your employment. Please provide your phone number to proceed.',
            'We need your phone number to link it with your Hagbes employee record. This helps in giving you updates on leave balance, assets, and more! 😊',
          ],
        },
      ],
    registration: [
      {
        trigger: ['register', 'sign up', 'create account', 'registration','ok'],
        response: [
            '📱 I can help you register! Please share your phone number by clicking the button below.',
          ],
          action: 'share_contact',
      }
    ],
    introduction: [
        {
          trigger: ['who are you', 'what are you', 'who is this', 'what is this bot'], // Triggers for questions about the bot's identity
          response: [
            '🤖 I am a bot designed to assist with Hagbes-related tasks, such as registration, notifications, and more.',
            '👋 I am the Hagbes Assistant Bot! My job is to help you with registration, updates, and important notifications.',
            '🎉 Hello! I am the Hagbes bot, here to assist you with your needs related to Hagbes.',
            '💡 I am an automated assistant created for Hagbes to provide you with services like notifications and more. How can I assist you today?',
          ],
        },
      ],
    goodbye: [
      {
        trigger: ['goodbye', 'bye', 'see you later', 'take care'],
        response: [
          '👋 Goodbye! Have a great day! 🌟',
          '🌸 See you later! Take care! ',
          '👋 Bye! Hope to chat again soon! 🤗',
          '💐 Take care! Talk to you later! ✨'
        ]
      }
    ],
    contact: [
        {
          trigger: [], // No trigger since this is based on `msg.contact`
          response: ['Thank you for sharing your contact! Let me process it.'],
        },
      ],
    unknown: [
      {
        trigger: [''],
        response: [
          '🤔 I\'m not sure what you mean. Can you please clarify?',
          '😕 Sorry, I didn\'t quite catch that. Could you try again?',
          '🤖 I\'m not familiar with that. Could you rephrase?',
          '🧐 Hmm, I didn\'t understand that. Could you provide more details?'
        ]
      }
    ],
    faq: [
      {
        trigger: ['what can you do', 'what is your purpose', 'what is this bot for'],
        response: [
          '🤖 I can help you register your phone number and assist with various services.',
          '✨ This bot allows you to register and interact with our system. How can I help you today?'
        ]
      }
    ],
    welcome: [
        {
          trigger: ['welcome', 'hi', 'hello', 'start','/\/start/'],
          response: [
            '🎉 Welcome to HagbesBot! 🎉\n\nI am here to assist you with registration, leave balance, assets, and much more! Please let me know if you want to go to the main menu or select any other options.',
            '👋 Hello! Welcome to HagbesBot! I can help you register your phone number and assist with many other tasks. How can I assist you today?'
          ]
        }
      ]
  };
  