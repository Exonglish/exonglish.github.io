const toggle=document.querySelector(".nav-toggle");
const links=document.getElementById("nav-links");
if(toggle&&links){
  toggle.addEventListener("click",()=>{
    const open=toggle.classList.toggle("is-open");
    links.classList.toggle("show",open);
    toggle.setAttribute("aria-expanded",open?"true":"false");
  });
}

// Subscribe form functionality
document.addEventListener('DOMContentLoaded', function() {
  const subscribeForm = document.getElementById('subscribe-form');
  const subscribeSuccess = document.getElementById('subscribe-success');
  
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = subscribeForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.textContent = 'Subscribing...';
      submitButton.disabled = true;
      
      const formData = new FormData(subscribeForm);
      
      fetch(subscribeForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Show success message
          subscribeForm.style.display = 'none';
          subscribeSuccess.style.display = 'block';
          
          // Reset form
          subscribeForm.reset();
        } else {
          throw new Error('Subscription failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Sorry, there was an error with your subscription. Please try again.');
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
    });
  }
  
  // Check if user just subscribed (URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('subscribed') === 'true' && subscribeSuccess) {
    subscribeSuccess.style.display = 'block';
  }
});




