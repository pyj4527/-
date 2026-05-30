const API_BASE_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const idInput = document.getElementById('user-id');
  const pwInput = document.getElementById('user-pw');
  const pwConfirmInput = document.getElementById('user-pw-confirm');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const authCodeInput = document.getElementById('auth-code');
  const btnCheckId = document.getElementById('btn-check-id');
  const btnRequestEmail = document.getElementById('btn-request-email');
  const btnVerifyCode = document.getElementById('btn-verify-code');
  const submitBtn = document.getElementById('btn-submit');
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-upper');
  const reqSpecial = document.getElementById('req-special');

  let isIdChecked = false;
  let checkedId = '';
  let isEmailSent = false;
  let isCodeVerified = false;

  const hasSpecialChar = (value) => /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"\s]/.test(value);
  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  function toggleReqStyle(element, isValid) {
    element.classList.toggle('active', isValid);
  }

  function validatePassword() {
    const password = pwInput.value;
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = hasSpecialChar(password);

    toggleReqStyle(reqLength, hasLength);
    toggleReqStyle(reqUpper, hasUpper);
    toggleReqStyle(reqSpecial, hasSpecial);

    return hasLength && hasUpper && hasSpecial;
  }

  function validateFormStatus() {
    const isPwValid = validatePassword();
    const isConfirmValid = pwInput.value === pwConfirmInput.value && pwConfirmInput.value !== '';
    const isNameValid = nameInput.value.trim() !== '';
    const isEmailFilled = isEmailValid(emailInput.value.trim());

    submitBtn.disabled = !(isIdChecked && isPwValid && isConfirmValid && isNameValid && isEmailFilled && isCodeVerified);
    submitBtn.classList.toggle('active', !submitBtn.disabled);
  }

  pwInput.addEventListener('input', validateFormStatus);
  pwConfirmInput.addEventListener('input', validateFormStatus);
  nameInput.addEventListener('input', validateFormStatus);

  idInput.addEventListener('input', () => {
    isIdChecked = false;
    checkedId = '';
    validateFormStatus();
  });

  emailInput.addEventListener('input', () => {
    isEmailSent = false;
    isCodeVerified = false;
    validateFormStatus();
  });

  authCodeInput.addEventListener('input', validateFormStatus);

  btnCheckId.addEventListener('click', async () => {
    const username = idInput.value.trim();

    if (!username) {
      alert('아이디를 입력해 주세요.');
      idInput.focus();
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || '아이디 중복 확인에 실패했습니다.');
      }

      if (!data.isAvailable) {
        alert('이미 사용 중인 아이디입니다.');
        isIdChecked = false;
        checkedId = '';
        validateFormStatus();
        return;
      }

      alert('사용 가능한 아이디입니다.');
      isIdChecked = true;
      checkedId = username;
      validateFormStatus();
    } catch (err) {
      console.error(err);
      alert(err.message || '서버 연결에 실패했습니다.');
    }
  });

  btnRequestEmail.addEventListener('click', () => {
    if (!isEmailValid(emailInput.value.trim())) {
      alert('올바른 이메일 형식을 입력해 주세요.');
      emailInput.focus();
      return;
    }

    alert('인증코드가 발송되었습니다. MVP에서는 아무 코드나 입력 후 확인할 수 있습니다.');
    isEmailSent = true;
    isCodeVerified = false;
    validateFormStatus();
  });

  btnVerifyCode.addEventListener('click', () => {
    if (!isEmailSent) {
      alert('이메일 인증요청을 먼저 진행해 주세요.');
      return;
    }

    if (!authCodeInput.value.trim()) {
      alert('인증코드를 입력해 주세요.');
      authCodeInput.focus();
      return;
    }

    alert('인증이 완료되었습니다.');
    isCodeVerified = true;
    validateFormStatus();
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = idInput.value.trim();
    const password = pwInput.value;

    if (!isIdChecked || checkedId !== username) {
      alert('아이디 중복 확인을 완료해 주세요.');
      return;
    }

    if (password !== pwConfirmInput.value) {
      alert('비밀번호가 일치하지 않습니다.');
      pwConfirmInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '처리 중...';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: emailInput.value.trim(),
          password,
          password_confirm: pwConfirmInput.value,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '회원가입 처리 중 오류가 발생했습니다.');
      }

      alert('회원가입이 완료되었습니다. 로그인 후 서비스를 이용해 주세요.');
      window.location.href = '../login/login.html';
    } catch (error) {
      console.error(error);
      alert(error.message || '네트워크 연결을 확인해 주세요.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.add('active');
      submitBtn.textContent = '회원가입하기';
      validateFormStatus();
    }
  });

  validateFormStatus();
});
