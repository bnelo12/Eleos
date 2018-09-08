const client = stitch.Stitch.initializeDefaultAppClient("eleos-esrny");
const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('posts');
const usersDB = db.collection("users");
const donationDB = db.collection("donations");
const requestsDB = db.collection("needs");

if (!client.auth.isLoggedIn) {
    window.location.href = "file:///Users/Ben/Documents/Eleos/docs/index.html";
}

var userId = client.auth.user.id;
var userName = "";
var donationsList = [];
var requestsList = [];

iconTypeConvert = {
    "Food and Water": "fas fa-utensils",
    "Travel Assistance": "fas fa-car",
    "Everyday Items": "fas fa-car",
    "Housing": "fas fa-home",
    "other": "fas fa-circle"
}

getUserName();
getDonations();
getRequests();

var socket = io.connect("http://localhost:5000");

socket.on("donation-download", (donation) => {
    appendDonationToDonationFeed(donation, true);
});

socket.on("request-download", (request) => {
    appendRequestToRequestsFeed(request, true);
});

async function logout() {
    await client.auth.logout();
    window.location.href = "file:///Users/Ben/Documents/Eleos/docs/index.html";
}

async function submitNewDonation() {
    let doc = getLoginFormInfo();
    await donationDB.insertOne(doc)
        .then((res) => {
            //appendDonationToDonationFeed(doc, true);
            socket.emit('donation-upload', doc);
            const titleEl = document.getElementById("donation-title-text");
            const locationEl = document.getElementById("donation-location-text");
            const descreptionEl = document.getElementById("donation-description-textarea");
            titleEl.value = "";
            locationEl.value = "";
            descreptionEl.value = "";
            $("#donation-modal").modal('hide');
        });
}

async function submitNewRequest() {
    let doc = getrequestFormInfo();
    await requestsDB.insertOne(doc)
        .then((res) => {
            //appendDonationToDonationFeed(doc, true);
            socket.emit('request-upload', doc);
            const titleEl = document.getElementById("request-title-text");
            const locationEl = document.getElementById("request-location-text");
            const descreptionEl = document.getElementById("request-description-textarea");
            titleEl.value = "";
            locationEl.value = "";
            descreptionEl.value = "";
            $("#request-modal").modal('hide');
        });
}

function appendDonationToDonationFeed(donationDoc, animate) {
    let template = document.querySelector('#donation-box-template');
    let clone = document.importNode(template.content, true);
    $(clone).find('.user-name').text(donationDoc.name);
    $(clone).find('.user-donation').text(donationDoc.title);
    $(clone).find('.user-location').text(donationDoc.location);
    $(clone).find('.user-icon').addClass(iconTypeConvert[donationDoc.service])
    // let id = ("contact-" + name).replace(/\s+/g, '-');
    let id = 'donation-' + donationsList.length;
    $(clone).find('.donation-box').attr('id', id);
    let orgElem = $('#donations').prepend(clone);
    if (animate) {
        $("#" + id).slideDown();
    } else {
        $("#" + id).slideDown(0);
    }
    $("#" + id).click(() => {
        openClaimDonationModal(donationDoc);
    });
    donationsList.push(donationsList);
}

function appendRequestToRequestsFeed(requestDoc, animate) {
    let template = document.querySelector('#request-box-template');
    let clone = document.importNode(template.content, true);
    $(clone).find('.user-name').text(requestDoc.name);
    $(clone).find('.user-donation').text(requestDoc.title);
    $(clone).find('.user-location').text(requestDoc.location);
    $(clone).find('.user-icon').addClass(iconTypeConvert[requestDoc.service])
    // let id = ("contact-" + name).replace(/\s+/g, '-');
    let id = 'request-' + requestsList.length;
    $(clone).find('.request-box').attr('id', id);
    let orgElem = $('#requests').prepend(clone);
    if (animate) {
        $("#" + id).slideDown();
    } else {
        $("#" + id).slideDown(0);
    }
    $("#" + id).click(() => {
        //openClaimDonationModal(donationDoc);
    });
    requestsList.push(requestDoc);
}

function getDonations() {
    let cursor = donationDB.find({}).asArray()
        .then(docs => docs.map(doc => appendDonationToDonationFeed(doc, false)));
}

function getRequests() {
    let cursor = requestsDB.find({}).asArray()
        .then(docs => docs.map(doc => appendRequestToRequestsFeed(doc, false)));
}

function getUserName() {
    usersDB.find({user: userId}).asArray()
        .then(name => {userName = name[0].name});
}

function openClaimDonationModal(doc) {
    $('#claim-modal-description').text(doc.description);
    $('#claim-modal-name').text(doc.name);
    $('#claim-modal-location').text(doc.location);
    $('#claim-modal-title').text(doc.title)
    $('#claim-donation-modal').modal('show');
}

function getLoginFormInfo() {
    const titleEl = document.getElementById("donation-title-text");
    const locationEl = document.getElementById("donation-location-text");
    const descreptionEl = document.getElementById("donation-description-textarea");
    const service = $('#donation-service-type-selector :selected').text()
    const title = titleEl.value;
    const location = locationEl.value;
    const description = descreptionEl.value;
    return { title: title, location: location, service: service, description: description, name: userName };
}

function getrequestFormInfo() {
    const titleEl = document.getElementById("request-title-text");
    const locationEl = document.getElementById("request-location-text");
    const descreptionEl = document.getElementById("request-description-textarea");
    const service = $('#request-service-type-selector :selected').text()
    const title = titleEl.value;
    const location = locationEl.value;
    const description = descreptionEl.value;
    return { title: title, location: location, service: service, description: description, name: userName };
}

