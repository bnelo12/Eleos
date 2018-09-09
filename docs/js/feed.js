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
var searchList = [];

iconTypeConvert = {
    "Food and Water": "fas fa-utensils",
    "Travel Assistance": "fas fa-car",
    "Everyday Items": "fas fa-couch",
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
        openFufillRequestModal(requestDoc);
    });
    requestsList.push(requestDoc);
}

function appendResultToSearchFeed(searchDoc, animate) {
    let template = document.querySelector('#search-box-template');
    let clone = document.importNode(template.content, true);
    $(clone).find('.user-name').text(searchDoc.name);
    $(clone).find('.user-donation').text(searchDoc.title);
    $(clone).find('.user-location').text(searchDoc.location);
    $(clone).find('.user-icon').addClass(iconTypeConvert[searchDoc.service])
    // let id = ("contact-" + name).replace(/\s+/g, '-');
    let id = 'search-' + searchList.length;
    $(clone).find('.search-box').attr('id', id);
    let orgElem = $('#searches').prepend(clone);
    if (animate) {
        $("#" + id).slideDown();
    } else {
        $("#" + id).slideDown(0);
    }
    $("#" + id).click(() => {
        openFufillRequestModal(searchDoc);
    });
    searchList.push(searchDoc);
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

function openFufillRequestModal(doc) {
    $('#fufill-modal-description').text(doc.description);
    $('#fufill-modal-name').text(doc.name);
    $('#fufill-modal-location').text(doc.location);
    $('#fufill-modal-title').text(doc.title)
    $('#fufill-request-modal').modal('show');
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

function openSearchModal() {
    $("#search-modal").modal('show');
}

async function executeSearch() {
    var option = $( 'input[name=inlineRadioOptions]:checked' ).val();
    if (!option) {
        alert("Please select a search option!");
        return;
    }
    var query = $('#search-input').val();
    if (option === "request") {
        requestsDB.find({}).asArray()
        .then((docs) => {
            docs.forEach((doc) => {
                const location = query.match("\bin\b")
                let wordSearch = query.replace("in ", "")
                wordSearch = wordSearch.split(' ').join('|')
                const removed = doc.location.replace(",", "");
                if (location && !removed.match(wordSearch,"i")) {
                    return;
                }
                if (doc.title.match(wordSearch,"i")) {
                    appendResultToSearchFeed(doc, false);
                }
            });
        })
    }
    if (option === "donation") {
        donationDB.find({}).asArray()
        .then((docs) => {
            docs.forEach((doc) => {
                const location = query.match("\bin\b")
                let wordSearch = query.replace("in ", "")
                wordSearch = wordSearch.split(' ').join('|')
                const removed = doc.location.replace(",", "");
                if (location && !removed.match(wordSearch)) {
                    return;
                }
                if (doc.title.match(wordSearch)) {
                    appendResultToSearchFeed(doc, false);
                }
            });
        })
    }
    openSearchModal();
}

$(document).ready(() => {
    document.getElementById('search-input').onkeydown = function(e){
        if(e.keyCode == 13){
            executeSearch()
        }
    };
    $('#search-modal').on('hidden.bs.modal', () => {
        searchList = [];
        $('#searches').empty();
    })
});
