const client = stitch.Stitch.initializeDefaultAppClient("eleos-esrny");
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('posts');

if (!client.auth.isLoggedIn) {
    window.location.href = "file:///Users/Ben/Documents/Eleos/docs/index.html";
}

async function logout() {
    await client.auth.logout();
    window.location.href = "file:///Users/Ben/Documents/Eleos/docs/index.html";
}