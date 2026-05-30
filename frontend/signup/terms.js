document.addEventListener('DOMContentLoaded', () => {
  const checkAll = document.getElementById('check-all');
  const subCheckboxes = document.querySelectorAll('.sub-check');
  const requiredCheckboxes = document.querySelectorAll('.sub-check[data-required="true"]');
  const nextBtn = document.getElementById('btn-next');
  
  const accordionToggle = document.getElementById('accordion-toggle');
  const accordionContent = document.getElementById('accordion-content');
  const arrowIcon = accordionToggle.querySelector('.arrow-icon');

  checkAll.addEventListener('change', () => {
    subCheckboxes.forEach(cb => {
      cb.checked = checkAll.checked;
    });
    validateRequiredTerms();
  });


  subCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const allChecked = Array.from(subCheckboxes).every(item => item.checked);
      checkAll.checked = allChecked;   
      validateRequiredTerms();
    });
  });


  function validateRequiredTerms() {
    const allRequiredChecked = Array.from(requiredCheckboxes).every(item => item.checked);
    
    if (allRequiredChecked) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
    }
  }

  accordionToggle.addEventListener('click', () => {
    arrowIcon.classList.toggle('rotate');
    
    if (accordionContent.style.maxHeight && accordionContent.style.maxHeight !== '0px') {
      accordionContent.style.maxHeight = '0px';
    } else {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
    }
  });


  nextBtn.addEventListener('click', () => {
    const agreementStatus = {
      userTerms: document.getElementById('check-required-1').checked,
      locationTerms: document.getElementById('check-optional-1').checked,
      privacyTerms: document.getElementById('check-optional-2').checked,
      marketingAd: document.getElementById('check-ad').checked
    };
    
    localStorage.setItem('user_agreements', JSON.stringify(agreementStatus));

    window.location.href = 'signup.html';
  });
});