const client = stitch.Stitch.initializeDefaultAppClient("eleos-esrny");
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('posts');

if (client.auth.isLoggedIn) {
    window.location.href = "file:///Users/Ben/Documents/Eleos/docs/dashboard.html";
}

const {
    Stitch,
    UserPasswordCredential,
} = stitch;

function getLoginFormInfo() {
    const emailEl = document.getElementById("emailInput");
    const passwordEl = document.getElementById("passwordInput");
    const email = emailEl.value;
    const password = passwordEl.value;
    emailEl.value = "";
    passwordEl.value = "";
    return { email: email, password: password };
}

async function handleLogin() {
    const { email, password } = getLoginFormInfo();
    await emailPasswordAuth(email, password);
}

async function emailPasswordAuth(email, password) {
    if (!client.auth.isLoggedIn) {
      // Log the user in
      const credential = new UserPasswordCredential(email, password);
      await client.auth.loginWithCredential(credential).then((id) => {
        window.location.href = "file:///Users/Ben/Documents/Eleos/docs/dashboard.html";
      })
      .catch((err) => {
        let errorMsg = document.getElementById("login-credentials-error");
        errorMsg.style.display = "block";
      });
    }
  }