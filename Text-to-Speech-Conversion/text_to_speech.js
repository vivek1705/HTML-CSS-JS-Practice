
    function convertToSpeech() {
      var textToSpeak = document.getElementById('textToSpeak').value;
      var selectedVoice = document.getElementById('voiceSelect').value;

      // Check if the browser supports the Web Speech API
      if ('speechSynthesis' in window) {
        var synthesis = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Set the selected voice
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === selectedVoice);
        synthesis.speak(utterance);
      } 
      
      else {
        alert(' browser does not support the Web Speech API.');
      }
    }

/*
    LOGIC
    User Input: The user enters text into the textarea and selects a voice (male or female) from the dropdown menu.

  API Support Check: The code checks if the browser supports the Web Speech API. If supported, the logic continues; otherwise, an alert notifies the user of the lack of support.

  Text-to-Speech Setup: If the API is supported, the code creates a SpeechSynthesisUtterance object containing the entered text. It then sets the voice for the utterance based on the user's selection.

  Speech Synthesis: The browser is instructed to speak the provided text using the chosen voice. The result is an audible conversion of the entered text to speech.
*/