const API_BASE_URL =
  window.SEOULODY_API_BASE_URL ||
  (["5500", "5501"].includes(window.location.port)
    ? "http://localhost:8000/api"
    : `${window.location.origin}/api`);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const userIdInput = document.getElementById("user-id");
  const userPwInput = document.getElementById("user-pw");
  const findAccountBtn = document.getElementById("btn-find-account");
  const loginBtn = document.getElementById("login-btn");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = userIdInput.value.trim();
    const password = userPwInput.value;

    if (!username) {
      alert("아이디를 입력해 주세요.");
      userIdInput.focus();
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해 주세요.");
      userPwInput.focus();
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "로그인 중...";

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "로그인에 실패했습니다.");
      }

      localStorage.setItem("userId", String(data.userId || data.user?.id || username));
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("authHeader", data.authHeader || `Token ${data.token}`);
      localStorage.setItem("username", data.user?.username || username);

      window.location.href = "../main/main.html";
    } catch (error) {
      console.error(error);
      alert(error.message || "서버 연결에 실패했습니다. 백엔드 서버를 확인해 주세요.");
      loginBtn.disabled = false;
      loginBtn.textContent = "로그인";
    }
  });

  findAccountBtn?.addEventListener("click", () => {
    alert("아이디/비밀번호 찾기 기능은 준비 중입니다.");
  });
});
